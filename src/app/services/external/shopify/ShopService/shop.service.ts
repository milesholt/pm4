import { Injectable, NgZone, ChangeDetectorRef } from '@angular/core';
import { User } from '../../../shared/user';
import Client from 'shopify-buy';
import { Router } from '@angular/router';
import { Library } from '../../../../app.library';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  userData: any; // Save logged in user data
  client: any;
  cart: any;
  test: any = 'abc';
  checkout: any;
  checkoutComplete: any = null;
  private cartSubject = new BehaviorSubject<any>(null);
  cart$ = this.cartSubject.asObservable();
  test$ = this.cartSubject.asObservable();
  activeProduct: any = null;

  constructor(
    public library: Library,
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    //public changeDet: ChangeDetectorRef,
  ) {
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

  async getProduct(products: any, idx: number = 0, product: any = {}) {
    let p = products[idx];

    product.id = p.id;
    product.featuredImage = p.featuredImage;
    product.description = await this.formatDesc(p);
    product.images = p.images;
    product.title = p.title;
    product.price = p.variants[0].price.amount;
    product.currency = p.variants[0].price.currencyCode;
    product.variants = p.variants;
    product.alias = p.handle;
    //product.tags = p.tags ? p.tags : null;
    //product.meta.title = p.seo.title ? p.seo.title : null;
    //product.meta.description = p.seo.description ? p.seo.description : null;
    product.productType = p.productType;
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

  async getCheckoutId() {
    return localStorage.getItem('checkoutId') ?? (await this.createCheckout());
  }

  cartUpdated(): Observable<boolean> {
    return this.cart.asObservable();
  }

  updateCart(cart: any) {
    this.cart = cart;
    localStorage.setItem('cart', cart);
    this.cartSubject.next(cart);
    //this.changeDet.detectChanges();
  }

  async addToCart(product: any) {
    //console.log(product);
    const checkoutId = await this.getCheckoutId();
    this.cart = await this.client.checkout
      .addLineItems(checkoutId, [
        {
          variantId: product.variants[0].id,
          quantity: 1,
        },
      ])
      .then((cart: any) => {
        this.updateCart(cart);
        return cart;
      })
      .catch((error: any) => {
        alert(error);
      });

    /*this.client.checkout
      .addLineItems(checkoutId, [
        {
          variantId: product.variants[0].id,
          quantity: 1,
        },
      ])
      .then((cart: any) => {
        this.updateCart(cart);
        //return cart;
      })
      .catch((error: any) => {
        alert(error);
      });*/

    //this.test = 'addtocart';
    //alert(this.test);
  }

  async testItem(q: any) {
    let qq = q as HTMLInputElement;
    alert(qq.value);
  }

  async updateItem(itemidx: any, quantity: any) {
    const q = quantity as HTMLInputElement;
    const checkoutId = await this.getCheckoutId();
    const item = this.cart.lineItems[itemidx];
    const lineItemsToUpdate = [{ id: item.id, quantity: parseInt(q.value) }];
    this.cart = await this.client.checkout
      .updateLineItems(checkoutId, lineItemsToUpdate)
      .then((cart: any) => {
        this.updateCart(cart);
        return cart;
      })
      .catch((error: any) => {
        alert(error);
      });
  }

  async findInCart(product: any = false) {
    const checkoutId = await this.getCheckoutId();
    if (product) {
      if (!this.isCartEmpty()) {
        if (this.cart.lineItems.length === 0) {
          return false;
        }
        for (let i = 0; i < this.cart.lineItems.length; i++) {
          if (this.cart.lineItems[i].variant.id == product.variants[0].id) {
            return this.cart.lineItems[i];
          }
        }
      }
    }
    return false;
  }

  getCartIdx(product: any = false) {
    let idx: boolean | number = false;
    if (product) {
      if (!this.isCartEmpty()) {
        for (let i = 0; i < this.cart.lineItems.length; i++) {
          //console.log(this.cart.lineItems[i].variant.id);
          if (this.cart.lineItems[i].variant.id == product.variants[0].id) {
            idx = i;
          }
        }
      }
    }

    //console.log(product);
    //console.log('getCartidx:' + idx);
    //if (idx == -1 && this.cart.lineItems) idx = this.cart.lineItems.length;
    return idx;
  }

  async removeItem(item: any = false) {
    let checkoutId = false;
    checkoutId = await this.getCheckoutId();
    /*this.cart = await this.client.checkout
      .removeLineItems(checkoutId, [item.id])
      .then((cart: any) => {
        return cart;
      })
      .catch((error: any) => {
        alert(error);
      });*/

    if (!!checkoutId && !!item) {
      /*this.cart = await this.client.checkout.removeLineItems(checkoutId, [
        item.id,
      ]);*/
      await this.client.checkout
        .removeLineItems(checkoutId, [item.id])
        .then((cart: any) => {
          this.updateCart(cart);
          //this.cart = cart;
        })
        .catch((error: any) => {
          alert(error);
        });

      //this.updateCart(this.cart);
    }

    //
  }

  async getCart() {
    const checkoutId = await this.getCheckoutId();
    this.cart = await this.client.checkout.fetch(checkoutId);
    //this.updateCart(this.cart);
    return this.cart;
  }

  getCartLength(): number {
    if (!this.isCartEmpty()) {
      return this.cart.lineItems.length;
    } else {
      return 0;
    }
  }

  isCartEmpty(): boolean {
    if (!this.library.isEmpty(this.cart)) {
      if (this.cart.lineItems.length > 0) {
        return false;
      }
    }
    return true;
  }

  async formatDesc(product: any) {
    //return desc.replace(/(<([^>]+)>)/gi, '');
    //add class if there is an image
    let desc = new DOMParser().parseFromString(
      product.descriptionHtml,
      'text/html',
    );

    let imgs = desc.querySelectorAll('img');

    desc.querySelectorAll('img').forEach((img: any) => {
      var iconPath = 'https://supliful.s3.amazonaws.com/categories/images';
      if (img.src.includes(iconPath)) {
        img.classList.add('icon');
      }
    });

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
