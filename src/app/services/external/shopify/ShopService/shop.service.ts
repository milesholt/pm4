import { Injectable, NgZone } from '@angular/core';
import { User } from '../../../shared/user';
import Client from 'shopify-buy';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  userData: any; // Save logged in user data
  constructor(
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) {
    console.log('shop service');
    // Initializing a client to return content in the store's primary language
    const client = Client.buildClient({
      domain: 'quickstart-5ff0e693.myshopify.com',
      storefrontAccessToken: 'b5f247a5b7594e3cb01d84ae0c5b33d3',
    });

    // Fetch all products in your shop
    client.product.fetchAll().then((products) => {
      // Do something with the products
      console.log(products);
    });
  }
}
