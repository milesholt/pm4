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
  @Input() item: any;
  cartSubscription: Subscription;
  isCartEmpty: boolean = true;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {
    this.cartSubscription = this.service.shop.cart$.subscribe(async (cart) => {
      this.isCartEmpty = await this.service.shop.isCartEmpty();
    });
  }

  ngOnInit() {}

  async updateItem(item: any, event: any) {
    await this.service.shop.updateItem(item, event);
    this.isCartEmpty = await this.service.shop.isCartEmpty();
  }

  async getCartItem() {
    return await this.service.shop.findInCart(this.item);
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
