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

@Component({
  selector: 'app-product',
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
  cartIdx: number = -1;

  @Input() productDesc: string = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    public service: CoreService,
  ) {}

  async ngOnInit() {
    await this.getAlias();
    await this.getProducts();
    await this.getProduct();
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

  getCartIdx(product: any = false) {
    /*this.cartIdx = await this.service.shop
      .getCartIdx(this.product)
      .then((idx) => {
        return idx;
      });*/
    this.cartIdx = this.service.shop.getCartIdx(product);
  }
}