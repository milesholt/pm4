import { Input, Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  //@Input() item: any = false;
  @Input() product: any = false;
  @Input() itemidx: any = false;

  cartSubscription: Subscription;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    public changeDet: ChangeDetectorRef,
  ) {
    this.cartSubscription = this.service.shop.cart$.subscribe(async (cart) => {
      //if (!this.service.shop.isCartEmpty() && !!this.product && !this.itemidx) {
      //await this.getCartIdx();
      //this.itemidx = await this.service.shop.getCartIdx(this.product);
      //}
      if (
        !this.service.shop.isCartEmpty() &&
        !!this.product &&
        this.itemidx === false
      ) {
        //await this.getCartIdx();
        this.itemidx = await this.service.shop.getCartIdx(this.product);
      }
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  async ngOnInit() {}

  async ngAfterViewInit() {
    //console.log('loading quantity - afterview');
    //if (!this.item) await this.getCartItem();
    //if (this.itemidx == -1) {
    //await this.getCartIdx();
    //}
    /*if (!this.service.shop.isCartEmpty() && !!this.product && !this.itemidx) {
      await this.getCartIdx();
    }*/

    if (
      !this.service.shop.isCartEmpty() &&
      !!this.product &&
      this.itemidx === false
    ) {
      //await this.getCartIdx();
      //this.itemidx = await this.service.shop.getCartIdx(this.product);
    }
  }

  async getCartItem() {
    /* if (!this.service.shop.isCartEmpty())
      if (!!this.itemidx)
        this.item = this.service.shop.cart.lineItems[this.itemidx];*/
  }

  async getCartIdx() {
    //if (this.itemidx === false) {
    /*this.itemidx = await this.service.shop
        .getCartIdx(this.product)
        .then((idx: any) => {
          return idx;
        });*/
    //console.log(this.product);
    //console.log(this.product);
    this.itemidx = await this.service.shop.getCartIdx(this.product);
    // }
  }

  async addQuantity(input: any) {
    if (input.value == '') input.value = 1;
    input.value =
      parseInt(input.value) < parseInt(input.max)
        ? parseInt(input.value) + 1
        : input.max;
    await this.service.shop.updateItem(this.itemidx, input);
  }

  async minusQuantity(input: any) {
    input.value = input.value > 1 ? input.value - 1 : 1;
    await this.service.shop.updateItem(this.itemidx, input);
  }

  // Use a getter function to check if lineItem is truthy
  get isCartItem(): boolean {
    return this.itemidx !== false; //
  }

  /*isCartItem() {
    return !!this.item;
  }*/
}
