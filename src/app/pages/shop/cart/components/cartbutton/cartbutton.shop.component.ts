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
  selector: 'app-cartbutton-shop-comp',
  templateUrl: './cartbutton.shop.component.html',
  styleUrls: ['./cartbutton.shop.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class CartButtonShopComponent implements OnInit {
  @Input() item: any;

  cartLabel: string = '';
  cartItem: any;
  removeCartItemLabel: string = 'Remove from cart';
  addCartItemLabel: string = 'Add to cart';
  cartSubscription: Subscription;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {
    this.cartSubscription = this.service.shop.cart$.subscribe(async (cart) => {
      this.cartItem = await this.service.shop.findInCart(this.item);
      
      this.cartLabel =
        this.cartItem !== false
          ? this.removeCartItemLabel
          : this.addCartItemLabel;
    });
  }

  ngOnInit() {}

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
    //this.cartItem = await this.isCartItem();
  }

  async isCartItem() {
    return this.service.shop.findInCart(this.item);
  }
}
