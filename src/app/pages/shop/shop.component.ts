import {
  ViewChild,
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Library } from '../../app.library';
import { Router, ActivatedRoute } from '@angular/router';
//import { ProductComponent } from './product/product.component';

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
  filterProducts: any = [];
  filterCategory: string = 'all';
  featuredProducts: any = [];

  heroSlides: any = {
    Mushroom: {
      product: 'Mushroom',
      slides: [
        {
          title: 'Fungi',
          description: 'Discover the power of mushrooms',
          image: 'http://obscura.solutions/assets/images/mushroom.webp',
        },
      ],
      content: [
        {
          title: 'Some content 1',
          content: '<p>Html content goes here<p>',
          image: 'http://obscura.solutions/assets/images/cordyceps.webp',
        },
        {
          title: 'Some content 2',
          content: '<p>Html content goes here2<p>',
          image: 'http://obscura.solutions/assets/images/reishi_mushroom.webp',
        },
      ],
      questions: [
        {
          title: 'What are the health benefits of Mushrooms?',
          content:
            'Reduces inflammation, improves cognitivity and stimulates the creation of brain cells, improves metabolism.',
        },
      ],
      featuredProducts: [
        'gid://shopify/Product/8945628414289',
        'gid://shopify/Product/8945648959825',
        'gid://shopify/Product/8959035638097',
      ],
    },
  };

  @ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;

  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    private cdr: ChangeDetectorRef,
    //public productComponent: ProductComponent,
  ) {}

  ngOnInit() {
    this.test();
    this.checkReturn();
  }

  ngAfterViewInit() {}

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
      if (checkout.completedAt !== null)
        this.service.shop.checkoutComplete = true;
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

  async handleSearchCallback(searchData: any) {
    const results = searchData.results;
    const keyword = searchData.keyword;
    this.filterCategory = searchData.keyword;

    if (keyword == '') this.test();
    this.filterProducts = results;
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
