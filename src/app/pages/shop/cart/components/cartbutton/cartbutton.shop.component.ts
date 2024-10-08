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
  selector: 'app-cartbutton-shop-comp',
  templateUrl: './cartbutton.shop.component.html',
  styleUrls: ['./cartbutton.shop.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class CartButtonShopComponent implements OnInit {
  @Input() product: any = false;

  cartLabel: any = '';
  cartItem: any;
  removeCartItemLabel: string = 'Remove from cart';
  addCartItemLabel: string = 'Add to cart';
  cartSubscription: Subscription;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    public changeDet: ChangeDetectorRef,
  ) {
    this.cartSubscription = this.service.shop.cart$.subscribe(async (cart) => {
      await this.getCartItem();
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  async ngOnInit() {}

  async ngAfterViewInit() {
    await this.getCartItem();
  }

  async getCartItem() {
    this.cartItem = await this.service.shop.findInCart(this.product);
    this.cartLabel =
      this.cartItem !== false
        ? this.removeCartItemLabel
        : this.addCartItemLabel;
    return this.cartItem;
  }

  async toggleAddToCart(product: any) {
    if (this.cartItem !== false) {
      this.service.shop.removeItem(this.cartItem);
    } else {
      await this.service.shop.addToCart(product);
      this.service.ads.google.trackConversion(
        this.service.shop.cart.totalPrice.amount,
        this.service.shop.cart.totalPrice.currencyCode,
        'addtocart'
      );
    }
    this.changeDet.detectChanges();
    //await this.service.shop.getCart();
    //await this.getCartItem();
  }
}
