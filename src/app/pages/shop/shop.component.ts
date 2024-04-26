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

  heroSlides: any = {
    Mushroom: {
      product: 'Mushroom',
      slides: [
        {
          title: 'Fungi',
          description: 'Discover the power of mushrooms',
          image:
            'https://cdn.shopify.com/s/files/1/0815/3694/2417/products/1707134754929-generated-label-image-0.jpg?v=170802151',
          //image:'https://www.pexels.com/photo/close-up-photo-of-white-mushrooms-1643416/',
        },
      ],
      content: [
        {
          title: 'Some content 1',
          content: '<p>Html content goes here<p>',
          image:
            'https://cdn.shopify.com/s/files/1/0815/3694/2417/products/1707134754929-generated-label-image-0.jpg?v=170802151',
        },
        {
          title: 'Some content 2',
          content: '<p>Html content goes here2<p>',
          image:
            'https://cdn.shopify.com/s/files/1/0815/3694/2417/products/1707134754929-generated-label-image-0.jpg?v=170802151',
        },
      ],
      questions: [
        {
          title: 'What are the health benefits of Mushrooms?',
          content:
            'Reduces inflammation, improves cognitivity and stimulates the creation of brain cells, improves metabolism.',
        },
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

  async handleSearchCallback(searchData: any) {
    const results = searchData.results;
    const keyword = searchData.keyword;
    this.filterCategory = searchData.keyword;

    if (keyword == '') this.test();
    this.filterProducts = results;
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