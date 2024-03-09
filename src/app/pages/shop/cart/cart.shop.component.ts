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

@Component({
  selector: 'app-cart.shop.component.ts',
  templateUrl: './cart.shop.component.html',
  styleUrls: ['./cart.shop.component.scss'],
  providers: [CoreService, Library],
})
export class CartShopComponent implements OnInit {
  products: any;
  //cart: any;
  //quantity: number;
  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
  ) {}

  ngOnInit() {
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
