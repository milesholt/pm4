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
import { CartShopComponent } from '../cart/cart.shop.component';
import { Library } from '../../../app.library';
import { Router, ActivatedRoute } from '@angular/router';

import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [CoreService, Library, CartShopComponent],
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
  cartLabel: string = '';
  cartItem: any;
  removeCartItemLabel: string = 'Remove from cart';
  addCartItemLabel: string = 'Add to cart';

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
    private cartComp: CartShopComponent,
  ) {}

  async ngOnInit() {
    await this.getAlias();
    await this.getProducts();
    await this.getProduct();
    await this.iniSlider();
    this.cartItem = await this.service.shop.findInCart(this.product);
    this.cartLabel =
      this.cartItem !== false
        ? this.removeCartItemLabel
        : this.addCartItemLabel;
  }

  async toggleAddToCart(product: any) {
    console.log(product);
    //this.cartItem = await this.isCartItem();

    if (this.cartItem !== false) {
      this.cartLabel = this.addCartItemLabel;
      await this.service.shop.removeItem(this.cartItem);
    } else {
      this.cartLabel = this.removeCartItemLabel;
      await this.service.shop.addToCart(product);
    }
    this.cartItem = await this.isCartItem();
  }

  async isCartItem() {
    return this.service.shop.findInCart(this.product);
  }

  async updateItem(item: any, event: any) {
    await this.service.shop.updateItem(item, event);
  }

  async addQuantity(input: any) {
    input.value = input.value < input.max ? input.value + 1 : input.max;
    await this.updateItem(this.cartItem, input);
  }

  async minusQuantity(input: any) {
    input.value = input.value > 1 ? input.value - 1 : 1;
    await this.updateItem(this.cartItem, input);
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
