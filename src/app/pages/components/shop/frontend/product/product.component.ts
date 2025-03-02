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

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [CoreService, Library],
})
export class ProductComponent implements OnInit {
  products: any = [];
  relatedProducts: any = [];
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
  cartIdx: number | boolean = false;
  cartSubscription: Subscription;
  filterCategory: any = false;

  @Input() productDesc: string = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    public service: CoreService,
  ) {
    this.cartSubscription = this.service.shop.cart$.subscribe(async (cart) => {
      if (this.products.length) await this.getProduct();
    });
    this.filterCategory =
      this.route.snapshot.queryParamMap.get('filterCategory');
  }

  async ngOnInit() {
    await this.getAlias();
    await this.getProducts();
    await this.getProduct();
    await this.doMeta();
    await this.getRelatedProducts();
  }

  async ngAfterViewInit() {}

  async getAlias() {
    this.alias = String(this.route.snapshot.paramMap.get('alias'));
  }

  async getProducts() {
    this.products = await this.service.shop.getProducts(
      this.service.shop.client,
    );
  }

  async getRelatedProducts() {
    const limitCount = 4;
    this.relatedProducts = this.products
      .filter(
        (product: any) =>
          product.productType == this.product.productType &&
          product.id !== this.product.id,
      )
      .slice(0, limitCount);
  }

  async getProduct() {
    const idx = this.library.getArrayIndex(this.products, this.alias, 'handle');
    if (idx !== -1) this.idx = idx;
    this.id = this.products[this.idx].id;
    this.product = await this.service.shop
      .getProduct(this.products, this.idx, this.product)
      .then(async (product) => {
        await this.getCartIdx(product);
        return product;
      });
  }

  async getCartIdx(product: any = false) {
    this.cartIdx = await this.service.shop.getCartIdx(product);
  }

  async doMeta() {
    const meta = {
      title: this.product.title,
      description: this.service.seo.getMetaDescription(
        this.product.description,
      ),
      image: this.product.images[0].src,
      keywords:
        this.service.seo.doKeywords(this.product.title) +
        ', Obscura Solutions, health products, premium health supplements, organic health products, natural wellness, vegan health solutions, Ayurvedic products, anti-ageing remedies, gourmet coffee, holistic health, wellness products',
    };
    this.service.seo.doMeta(meta);
  }
}
