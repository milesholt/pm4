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
  cart: any;
  checkout: any;
  checkoutComplete: any = null;

  constructor(
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) {
    console.log('shop service');
    // Initializing a client to return content in the store's primary language
    /*this.client = Client.buildClient({
      domain: 'quickstart-5ff0e693.myshopify.com',
      storefrontAccessToken: 'b5f247a5b7594e3cb01d84ae0c5b33d3',
      apiVersion: '2020-07',
    });*/

    this.client = Client.buildClient({
      domain: '448c6a-3.myshopify.com',
      storefrontAccessToken: '911fbc2ed8e032001c7c6ac7e493a57d',
      apiVersion: '2023-10',
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

  async getProduct(products: any, idx: number = 0) {
    let product = products[idx];

    /*let desc = new DOMParser().parseFromString(
      product.descriptionHtml,
      'text/html',
    );
    let imgs = desc.querySelectorAll('img');

    desc.querySelectorAll('img').forEach((img: any) => {
      var iconPath = 'https://supliful.s3.amazonaws.com/categories/images';
      if (img.src.includes(iconPath)) {
        img.classList.add('icon');
      }
    });*/

    //product.descriptionHtml = desc.body.innerHTML;
    // products[idx].descriptionHtml = 'test';

    product.descriptionFormatted = await this.formatDesc(product);

    return product;
  }

  async createCheckout() {
    this.checkout = await this.client.checkout.create();
    localStorage.setItem('checkoutId', this.checkout.id);
    return this.checkout.id;
  }

  async openCheckout() {
    window.open(this.cart.webUrl, '_self');
  }

  async addToCart(product: any) {
    const checkoutId = !this.client.checkout.id
      ? await this.createCheckout()
      : this.client.checkout.id;

    this.cart = await this.client.checkout.addLineItems(checkoutId, [
      {
        variantId: product.variants[0].id,
        quantity: 1,
      },
    ]);
    console.log(this.cart);

    this.openCheckout();
    //return this.cart;
  }

  async formatDesc(product: any) {
    console.log('formatting..');
    //return desc.replace(/(<([^>]+)>)/gi, '');
    //add class if there is an image
    let desc = new DOMParser().parseFromString(
      product.descriptionHtml,
      'text/html',
    );

    let imgs = desc.querySelectorAll('img');

    console.log(imgs.length);
    desc.querySelectorAll('img').forEach((img: any) => {
      var iconPath = 'https://supliful.s3.amazonaws.com/categories/images';
      if (img.src.includes(iconPath)) {
        console.log('adding class');
        img.classList.add('icon');
      }
    });

    console.log('desc:');
    console.log(desc.body.innerHTML);

    //product.descriptionHtml = desc.body.innerHTML;

    //return new Promise((resolve) => desc);
    /*desc = desc.replace(
      'src="https://supliful.s3.amazonaws.com/categories/images/',
      'class="icon" src="https://supliful.s3.amazonaws.com/categories/images',
    );
    console.log(desc);
    return desc;*/

    /*
    return new Promise((resolve) => {
      console.log(desc);
      resolve(desc);   
    });
    */
    return desc.body.innerHTML;
    //return product.descriptionHtml;
  }

  async fetchCheckout(checkoutId: any) {
    console.log('fetching checkout');
    this.checkout = await this.client.checkout.fetch(checkoutId);
    console.log(this.checkout);
    return this.checkout;
  }
}
