import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Library } from '../../app.library';
import { Router, ActivatedRoute } from '@angular/router';
//import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [CoreService, Library],
})
export class ShopComponent implements OnInit {
  products: any;
  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    //public productComponent: ProductComponent,
  ) {}

  ngOnInit() {
    this.test();
    this.checkReturn();
  }

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

  test() {
    this.service.shop.getProducts(this.service.shop.client).then((products) => {
      console.log(products);
      this.products = products;
    });
  }
}
