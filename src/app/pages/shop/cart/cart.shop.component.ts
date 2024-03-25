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
import { AlertController } from '@ionic/angular';

//import { CartButtonShopComponent } from './components/cartbutton/cartbutton.shop.component';
import { QuantityShopComponent } from './components/quantity/quantity.shop.component';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './cart.shop.component.html',
  styleUrls: ['./cart.shop.component.scss'],
  providers: [
    CoreService,
    Library,
    //QuantityShopComponent,
    //CartButtonShopComponent,
  ],
})
export class CartShopComponent implements OnInit {
  @ViewChild(QuantityShopComponent) quantityComp!: QuantityShopComponent;

  products: any;
  //cartSubscription: Subscription;
  //cart: any;
  //quantity: number;
  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    //public cartButtonComp: CartButtonShopComponent,
    //public quantityComp: QuantityShopComponent,
    private elementRef: ElementRef<HTMLElement>,
  ) {
    /*this.cartSubscription = this.service.shop.cart$.subscribe(async (cart) => {
      //alert(this.service.shop.activeProduct);
      await this.quantityComp.getCartItem();
      //this.quantityComp.item.quantity = 0;
      //await this.cartButtonComp.getCartItem();
    });*/
  }

  ngOnInit() {
    const element = this.elementRef.nativeElement;
    this.getCart();
  }

  async getCart() {
    await this.service.shop.getCart();
  }

  async updateItem(item: any, event: any) {
    await this.service.shop.updateItem(item, event);
  }

  async removeItem(item: any) {
    await this.service.shop.removeItem(item);
  }

  async addQuantity(item: any, input: any) {
    input.value = input.value < input.max ? input.value + 1 : input.max;
    await this.updateItem(item, input);
  }

  async minusQuantity(item: any, input: any) {
    input.value = input.value > 1 ? input.value - 1 : 1;
    await this.updateItem(item, input);
  }
}
