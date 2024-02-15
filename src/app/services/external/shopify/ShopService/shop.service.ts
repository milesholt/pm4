import { Injectable, NgZone } from '@angular/core';
import { User } from '../../../shared/user';
import Client from 'shopify-buy';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  userData: any; // Save logged in user data
  client: any;
  constructor(
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) {
    console.log('shop service');
    // Initializing a client to return content in the store's primary language
    this.client = Client.buildClient({
      domain: 'quickstart-5ff0e693.myshopify.com',
      storefrontAccessToken: 'b5f247a5b7594e3cb01d84ae0c5b33d3',
      apiVersion: '2020-07',
    });

    /* // Fetch all products in your shop
    client.product.fetchAll().then((products: any) => {
      // Do something with the products
      console.log(products);
    });*/
  }

  async getProducts(client: any) {
    const products = await client.product.fetchAll();
    return products;
  }
}
