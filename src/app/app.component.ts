import { OnInit, ViewChild, Component } from '@angular/core';
import { CoreService } from './services/core.service';
import { Library } from './app.library';
import { Subscription } from 'rxjs';

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
  ) {
    this.cartSubscription = this.service.shop.cart$.subscribe((cart) => {
      // Update another variable based on the cart change
      // For example:
      this.cartLength = cart.lineItems.length;
    });
  }

  ngOnInit() {
    this.cartLength = this.service.shop.cart.length;
    //if cart length changed
    this.service.shop.cartUpdated().subscribe(() => {
      alert('cart updated');
      this.cartLength = this.service.shop.cart.length;
    });
  }
}
