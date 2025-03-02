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
import { MenuController } from '@ionic/angular';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './cart.shop.component.html',
  styleUrls: ['./cart.shop.component.scss'],
  providers: [CoreService, Library],
})
export class CartShopComponent implements OnInit {
  products: any;
  test: string = 'a';
  //cartSubscription: Subscription;
  cartLength: number = 0;
  //changeDet: any;
  @Input() cart: any;

  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    public changeDet: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private menuController: MenuController,
  ) {
    /*this.cartSubscription = this.service.shop.cart$.subscribe(async (cart) => {
      this.changeDet.detectChanges();
    });*/
  }

  ngOnDestroy() {
    //this.cartSubscription.unsubscribe();
  }

  ngOnInit() {
    const element = this.elementRef.nativeElement;
    //this.service.shop.getCart();
  }

  navigateToProductPage(product: any) {
    this.router.navigateByUrl(`/shop/product/${product.handle}`);
    this.menuController.close('cart');
  }

  doCheckout(){
    this.service.ads.google.trackConversion(
      this.service.shop.cart.totalPrice.amount,
      this.service.shop.cart.totalPrice.currencyCode,
      'checkout'
    );
    this.service.shop.openCheckout();
  }

  async ngAfterContentInit() {}
}
