import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  baseUrl = 'https://siteinanhour.com/server';

  constructor() {
    this.stripePromise = loadStripe(environment.stripe.publicTestKey);
  }

  async createSubscription(
    email: string,
    paymentMethodId: string,
    priceId: string
  ) {
    const response = await fetch(this.baseUrl + '/stripe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        paymentMethodId: paymentMethodId,
        priceId: priceId,
      }),
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    return result.clientSecret;
  }

  async createCheckoutSession(productName: string): Promise<string> {
    console.log('createCheckoutSession');

    const hostUrl = `${window.location.protocol}//${window.location.host}`;

    console.log(hostUrl);

    const postUrl = this.baseUrl + '/stripe-checkout.php';

    console.log(postUrl);

    const response = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productName: productName, url: hostUrl }),
    });

    const result = await response.json();

    if (result.error) {
      console.log('here');
      throw new Error(result.error);
    }

    console.log(result);

    return result.id;
  }

async createCustomer(user:any){
    const postData = {
      action: 'createCustomer',
      customer_name: user.name,
      customer_email: user.email,
      user_id: user.uid,
      productName: productName,
      hostUrl: hostUrl
    }

    return await this.doRequest(postData);
 }

 async doSubscription(user:any){
  const hostUrl = `${window.location.protocol}//${window.location.host}`;
  let postData = {
    action: 'doSubscription',
    customer_name: user.name,
    customer_email: user.email,
    user_id: user.uid,
    mode: 'subscription',
    payment_type: 'card',
    url: hostUrl

  }

  if(user.hasOwnProperty('stripeCustomerId')) postData.customerId = user.stripeCustomerId;
  return await this.doRequest(postData);

 }

 async doRequest(postData:any) {

  const response = await fetch(this.baseUrl + '/stripe.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
  });

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  return result;
  
 }

}
