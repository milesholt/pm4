import { OnInit, ViewChild, Component } from '@angular/core';
import { CoreService } from './services/core.service';
import { Library } from './app.library';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { CartShopComponent } from './pages/shop/cart/cart.shop.component';
import { CookieService } from 'ngx-cookie-service';
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
    /*{
      title: 'Shop',
      url: '/shop',
      icon: 'storefront',
    },*/
    /*{
      title: 'About Us',
      url: '/about-us',
      icon: '',
    },
    {
      title: 'Contact Us',
      url: '/contact-us',
      icon: '',
    },*/
    /*{
      title: 'Cart',
      url: '/cart',
      icon: 'cart',
    },*/
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'person',
    },
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
    public lib: Library,
    public service: CoreService,
    public router: Router,
    private titleService: Title,
    private meta: Meta,
    public route: ActivatedRoute,
    private cookieService: CookieService
  ) //public cartComp: CartShopComponent,
  {
    this.cartSubscription = this.service.shop.cart$.subscribe((cart) => {
      this.cartLength = this.service.shop.getCartLength();
    });
  }

  ngOnInit() {
    /*this.titleService.setTitle(this.activePageTitle);
    this.meta.updateTag({ property: 'og:url', content: 'http://yoururl.com' });
    this.meta.updateTag({
      property: 'og:title',
      content: this.activePageTitle,
    });
    this.meta.updateTag({ property: 'og:image', content: 'your image link' });
    this.meta.updateTag({ property: 'og:description', content: 'description' });*/
    this.doCampaignCheck();
  }

  getSearchParams(category: string | boolean): any {
    return { search: category };
  }

  ngAfterViewInit() {
    this.cartLength = this.service.shop.getCartLength();
  }

  doRefresh(event: any) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  doCampaignCheck() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['cid']) {
        this.cookieService.set('cid', params['cid'], { expires: 90 });
        this.cookieService.set('campaign_landing', this.router.url, {
          expires: 90,
        });
      }
      if (params['adgroupid']) {
        this.cookieService.set('adgroupid', params['adgroupid'], {
          expires: 90,
        });
      }
      if (params['keyword']) {
        this.cookieService.set('keyword', params['keyword'], { expires: 90 });
      }
      if (params['source_campaign']) {
        this.cookieService.set('source_campaign', params['source_campaign'], {
          expires: 90,
        });
      }
      if (params['creative']) {
        this.cookieService.set('creative', params['creative'], { expires: 90 });
      }
    });
  }
}
