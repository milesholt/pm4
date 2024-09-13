import { Injectable, NgZone } from '@angular/core';
import { User } from '../../../shared/user';
import * as printful from 'printful-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  userData: any; // Save logged in user data
  constructor(
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    console.log('shop service');
    const key = '7ik1AXM4If3VqtORSjT9u8bZg00GeVYtwNIz2PuO';
    //const print = new printful({ apiKey: key });

    //print.products.getProduct();
    //console.log(new printful());
  }
}
