import { OnInit, ViewChild, Component } from '@angular/core';
import { CoreService } from './services/core.service';
import { Library } from './app.library';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { CartShopComponent } from './pages/shop/cart/cart.shop.component';
//import { SafeHtmlPipe } from './pipes/safeHtml.pipe';

//This only worked if in child component
/*import { register } from 'swiper/element/bundle';
register();
*/

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  //imports: [SafeHtmlPipe],
  styleUrls: ['app.component.scss'],
  providers: [CoreService, Library],
})
export class AppComponent implements OnInit {
  activePageTitle = 'Shop';
  activeIndex = 0;
  cart: any;
  cartLength: number = 0;
  cartSubscription: Subscription;
  Pages = [
    {
      title: 'Shop',
      url: '/shop',
      icon: 'storefront',
    },
    /*{
      title: 'Cart',
      url: '/cart',
      icon: 'cart',
    },*/
    {
      title: 'Login',
      url: '/login',
      icon: 'person',
    },
    {
      title: 'Register',
      url: '/register',
      icon: 'person',
    },
  ];
  constructor(
    public library: Library,
    public service: CoreService,
    public router: Router,
    //public cartComp: CartShopComponent,
  ) {
    this.cartSubscription = this.service.shop.cart$.subscribe((cart) => {
      this.cartLength = cart.lineItems.length;
      //this.cart.lineItems = cart.lineItems;
    });
  }

  ngOnInit() {
    //
  }

  getSearchParams(category: string): any {
    return { search: category };
  }

  ngAfterViewInit() {
    if (this.service.shop.cart.lineItems) {
      this.cartLength = this.service.shop.cart.lineItems.length;
    }
  }
}
