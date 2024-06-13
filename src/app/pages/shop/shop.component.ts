import {
  ViewChild,
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Library } from '../../app.library';
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { ProductComponent } from './product/product.component';

import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

import { register } from 'swiper/element/bundle';
import { SearchShopComponent } from './components/search/search.shop.component';
register();

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [CoreService, Library],
})
export class ShopComponent implements OnInit {
  products: any = [];
  search: string | boolean = false;
  searchData: any = null;
  category: string = '';
  filterProducts: any = [];
  excludedProducts: any = [];
  filterCategory: string = 'all';
  featuredProducts: any = [];
  private observer: IntersectionObserver | undefined;
  private pagesJSON = 'assets/json/pages.json';
  heroSlides: any = {};
  showMoreClicked: boolean = false;
  statusMessage: string = '';
  filterProducts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  @ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;
  @ViewChildren('item') items?: QueryList<ElementRef>;
  @ViewChild(SearchShopComponent) searchComponent!: SearchShopComponent;

  public url: string;
  public title: string;

  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    //public productComponent: ProductComponent,
  ) {
    this.url = environment.url;
    this.title = environment.title;
  }

  async ngOnInit() {
    await this.service.http.getJSON(this.pagesJSON).subscribe((pages) => {
      this.heroSlides = pages.shop;
      //once main content is loaded, finish
      this.finishLoad();
    });
  }

  async finishLoad() {
    await this.test();
    await this.checkReturn();
    await this.doSearch();

    this.filterCategory =
      this.filterCategory !== ''
        ? this.library.alias(this.filterCategory)
        : 'all';

    let category = this.filterCategory;

    this.route.queryParams.subscribe((params: Params) => {
      if (params['search']) {
        this.search = params['search'];
        category = this.library.alias(params['search']);
      }
    });

    this.route.paramMap.subscribe((params) => {
      category = String(params.get('category'));
      if (this.heroSlides.hasOwnProperty(category)) {
        this.filterCategory = category;
        this.search = category;
      }
    });

    //do meta for category
    //if no category exists, it will default to 'all' or default meta
    if (category == 'null') category = 'all';
    this.service.seo.doMeta(this.heroSlides[category].meta);
  }

  ngAfterViewInit(): void {
    this.initializeObserver();
    //Ensure products grid fades in when Shop Now button is clicked

    setTimeout(() => {
      const sliderCta = document.querySelector('#slider-cta');
      if (sliderCta) {
        sliderCta.addEventListener('click', () => {
          this.elementRef.nativeElement
            .querySelector('#productsGrid')
            .classList.add('fade-in');
          //if on featured page, show all products when clicked and redo scroll

          const sectionElement = document.querySelector('#searchBar');
          if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              if (this.search == 'featured' || this.search == 'all') {
                this.showAll();
              } else {
                this.showExcluded();
              }
            }, 800);
          }
        });
      }
    }, 800);
  }

  ngAfterViewChecked(): void {
    this.observeElements();
  }

  initializeObserver() {
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      threshold: 0.3, // Trigger when 30% of the target is visible
    });
  }

  observeElements() {
    if (!this.observer) return;

    const targetElements =
      this.elementRef.nativeElement.querySelectorAll('.anim');
    targetElements.forEach((element: any) => {
      this.observer!.observe(element);
    });
  }

  handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.3) {
        // Element is at least 30% visible
        const targetElement = entry.target as HTMLElement;
        targetElement.classList.add('fade-in');
        // Perform your desired actions here
      }
    });
  }

  /*scrollToSection() {
    // Perform scrolling action to the desired section
    const sectionElement = document.getElementById('productsGrid');
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }*/

  async checkReturn() {
    if (this.router.url.indexOf('?return') > -1) {
      const checkoutId = localStorage.getItem('checkoutId');

      if (checkoutId === null || checkoutId === undefined)
        this.router.navigate(['/shop']);

      const checkout = await this.service.shop.fetchCheckout(checkoutId);
      this.service.shop.checkoutComplete = false;

      if (!!checkout) {
        if (checkout.completedAt !== null) {
          this.service.shop.checkoutComplete = true;
          this.service.ads.google.trackConversion(
            checkout.totalPrice.amount,
            checkout.totalPrice.currencyCode,
            'purchase',
          );
        }
      }
    }
  }

  doSearch() {
    if (this.searchComponent) {
      //this.searchComponent.checkQuery();
      this.filterCategory =
        this.searchData.keyword !== ''
          ? this.library.alias(this.searchData.keyword)
          : 'all';

      if (this.filterCategory == 'featured') this.filterCategory = 'all';

      //if (keyword == '') this.test();
      //if (keyword == '') this.test();
      this.search = this.searchData.keyword;
      this.filterProducts = this.searchData.results;
      this.filterProducts$.next(this.searchData.results);
      this.excludedProducts = this.searchData.excluded;

      this.doFeatured();
      this.cdr.detectChanges();
    }
  }

  async doFeatured() {
    if (this.filterCategory !== 'all') {
      const cat = this.heroSlides[this.filterCategory];

      this.featuredProducts = await this.products.filter((product: any) =>
        cat.featuredProducts.includes(product.id),
      );
    }
  }

  async showExcluded() {
    this.filterProducts = [...this.filterProducts, ...this.excludedProducts];
    this.showMoreClicked = true;
  }

  showAll() {
    this.search = 'all';
    this.filterProducts = this.products;
    this.showMoreClicked = true;
  }

  async handleSearchCallback(searchData: any) {
    //if no products loaded yet, try again
    this.searchData = searchData;
    await this.doSearch();
    await this.handleStatus();
  }

  async handleFilterCallback(filterData: any) {
    this.cdr.detectChanges();
  }

  handleStatus() {
    //Handle status message
    if (this.search !== '' && typeof this.search == 'string') {
      if (
        this.heroSlides.hasOwnProperty(this.search) &&
        this.filterProducts.length == 0
      )
        this.statusMessage =
          'Sorry all products are currently sold out. Please try again later.';

      if (
        !this.heroSlides.hasOwnProperty(this.search) &&
        this.filterProducts.length == 0
      )
        this.statusMessage =
          'Sorry no products could be found, please try a different search.';
    }
  }

  test() {
    this.service.shop.getProducts(this.service.shop.client).then((products) => {
      this.products = products;
      //this.filterProducts = products;
    });
  }
}
