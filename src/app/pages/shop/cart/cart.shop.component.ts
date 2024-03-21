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
  selector: 'app-shop-cart',
  templateUrl: './cart.shop.component.html',
  styleUrls: ['./cart.shop.component.scss'],
  providers: [CoreService, Library],
})
export class CartShopComponent implements OnInit {
  // @ViewChild('itemQuantity') itemQuantity!: ElementRef;
  @ViewChild('testInput', { static: true }) input!: ElementRef;

  products: any;
  //cart: any;
  //quantity: number;
  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    private elementRef: ElementRef<HTMLElement>,
    // private itemQuantity: ElementRef<HTMLInputElement>,
  ) {}

  ngOnInit() {
    const element = this.elementRef.nativeElement;
    this.getCart();
  }

  ngAfterViewInit() {
    // this.input is NOW valid !!
    console.log(this.input);
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

  test(product: any) {
    //const element = this.itemQuantity.nativeElement;
    console.log('test');
    console.log(this.input);
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
