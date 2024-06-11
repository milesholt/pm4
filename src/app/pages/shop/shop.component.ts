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

import { register } from 'swiper/element/bundle';
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
  category: string = '';
  filterProducts: any = [];
  excludedProducts: any = [];
  filterCategory: string = 'all';
  featuredProducts: any = [];
  private observer: IntersectionObserver | undefined;
  private pagesJSON = 'assets/json/pages.json';
  heroSlides: any = {};

  @ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;
  @ViewChildren('item') items?: QueryList<ElementRef>;

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

  finishLoad() {
    this.test();
    this.checkReturn();
    this.filterCategory =
      this.filterCategory !== ''
        ? this.library.alias(this.filterCategory)
        : 'all';

    this.route.queryParams.subscribe((params: Params) => {
      if (params['search']) {
        this.search = params['search'];
        const query = this.library.alias(params['search']);
        this.service.seo.doMeta(this.heroSlides[query].meta);
      }
    });

    /* this.route.url.subscribe((urlSegments) => {
      // Convert urlSegments to an array of string
      const segments = urlSegments.map((segment) => segment.path);

      // Check if 'shop' exists in the segments
      const shopIndex = segments.indexOf('shop');
      if (shopIndex !== -1) {
        // Get the last segment
        const lastSegment = segments[segments.length - 1];
        //Check if segment is a category
        //alert(lastSegment);
        if (this.heroSlides.hasOwnProperty(lastSegment)) {
          // Append the last segment to the variable
          this.search = lastSegment;
          this.filterCategory = lastSegment;
          this.service.seo.doMeta(this.heroSlides[this.search].meta);
        }
      }
    });*/

    this.route.paramMap.subscribe((params) => {
      const category = String(params.get('category'));
      if (this.heroSlides.hasOwnProperty(category)) {
        // Append the category to the variable if it matches any category key
        this.filterCategory = category;
        this.search = category;
        this.service.seo.doMeta(this.heroSlides[this.search].meta);
      }
    });
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
          //if on featured page, show all products when clicked
          if (this.search == 'featured') {
            this.search = 'all';
            this.test();
          }
        });
      }
    }, 1000);
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
  }

  async handleSearchCallback(searchData: any) {
    const results = searchData.results;
    const keyword = searchData.keyword;
    this.filterCategory =
      searchData.keyword !== ''
        ? this.library.alias(searchData.keyword)
        : 'all';
    if (this.filterCategory == 'featured') this.filterCategory = 'all';

    if (keyword == '') this.test();
    this.filterProducts = results;
    this.excludedProducts = searchData.excluded;

    this.doFeatured();
    this.cdr.detectChanges();
  }

  async handleFilterCallback(filterData: any) {
    this.cdr.detectChanges();
  }

  test() {
    this.service.shop.getProducts(this.service.shop.client).then((products) => {
      this.products = products;
      this.filterProducts = products;
    });
  }
}
