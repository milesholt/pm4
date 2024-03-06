import {
  Input,
  ChangeDetectorRef,
  Component,
  OnInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';
import { Router, ActivatedRoute } from '@angular/router';

import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-product.component.ts',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [CoreService, Library],
})
export class ProductComponent implements OnInit {
  products: any;
  product: any = {
    id: null,
    title: null,
    description: null,
    meta: null,
    tags: null,
    alias: null,
    images: [],
    productType: null,
    featuredImage: null,
    price: 0,
    currency: null,
    url: null,
    variants: [],
  };
  //productDesc: any = 'test';
  id: any = null;
  alias: string = '';
  idx: number = 0;

  @Input() productDesc: string = 'test';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    public service: CoreService,
    private changeDetectorRef: ChangeDetectorRef,
    // public safeHtml: SafeHtmlPipe,
  ) {}

  async ngOnInit() {
    await this.getAlias();
    await this.getProducts();
    await this.getProduct();
    await this.iniSlider();
  }

  async getAlias() {
    this.alias = String(this.route.snapshot.paramMap.get('alias'));
  }

  async getProducts() {
    this.products = await this.service.shop.getProducts(
      this.service.shop.client,
    );
  }

  async getProduct() {
    const idx = this.library.getArrayIndex(this.products, this.alias, 'handle');
    if (idx !== -1) this.idx = idx;
    this.id = this.products[this.idx].id;
    this.product = await this.service.shop.getProduct(
      this.products,
      this.idx,
      this.product,
    );
  }

  async iniSlider() {
    // swiper element
    const swiperEl = <any>document.querySelector('swiper-container');

    // swiper parameters
    const swiperParams = {
      slidesPerView: 1,
      zoom: {
        maxRatio: 5,
        minRatio: 1,
        toggle: true,
      },
      navigation: true,
      /*pagination: {
        clickable: true,
      },*/
      thumbs: {
        swiper: '.thumbs-swiper',
      },
      on: {
        init() {},
      },
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    // and now initialize it
    swiperEl.initialize();
  }
}
