import { Input, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../../app.library';
import { CoreService } from '../../../../../services/core.service';

import { Subscription } from 'rxjs';

@Component({
  //standalone: true,
  selector: 'app-quantity-shop-comp',
  templateUrl: './quantity.shop.component.html',
  styleUrls: ['./quantity.shop.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class QuantityShopComponent implements OnInit {
  @Input() item: any = false;
  @Input() product: any;
  @Input() itemidx: number = -1;

  cartSubscription: Subscription;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {
    this.cartSubscription = this.service.shop.cart$.subscribe((cart) => {
      this.item = cart.lineItems[this.itemidx];
    });
  }

  /* ngOnInit() {
    this.cartSubscription = this.service.shop.cart.item$.subscribe(cart:any => {
      this.item = cart.lineItems[this.itemidx];
    });
  }*/

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  async ngOnInit() {
    this.item = this.service.shop.cart.lineItems[this.itemidx];
  }

  async ngAfterViewInit() {
    if (!this.item) await this.getCartItem();
  }

  async getCartItem() {
    this.item = this.service.shop.cart.lineItems[this.itemidx];
  }

  async addQuantity(item: any, input: any) {
    input.value = input.value < input.max ? input.value + 1 : input.max;
    this.service.shop.activeProduct = this.product;
    await this.service.shop.updateItem(this.item, input);
  }

  async minusQuantity(item: any, input: any) {
    input.value = input.value > 1 ? input.value - 1 : 1;
    this.service.shop.activeProduct = this.product;
    await this.service.shop.updateItem(this.item, input);
  }
}
