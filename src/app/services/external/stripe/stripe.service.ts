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

  async createCustomer(user: any) {
    const postData = {
      action: 'createCustomer',
      customer_name: user.displayName,
      customer_email: user.email,
      user_id: user.uid,
    };

    return await this.doRequest(postData);
  }

  async doSubscription(data: any) {
    const hostUrl = `${window.location.protocol}//${window.location.host}`;
    let postData: any = {
      action: 'doSubscription',
      customer_name: data.displayName,
      customer_email: data.email,
      user_id: data.uid,
      mode: 'subscription',
      payment_type: 'card',
      url: hostUrl,
      productName: data.productName,
    };

    console.log('post data');
    console.log(postData);

    if (data.hasOwnProperty('stripeCustomerId'))
      postData.customerId = data.stripeCustomerId;
    return await this.doRequest(postData);
  }

  async setPaymentMethodSubscription(data: any) {
    let postData: any = {
      action: 'setPaymentMethodSubscription',
      subscriptionId: data.subscriptionId,
      customerId: data.customerId,
    };

    console.log('post data');
    console.log(postData);

    return await this.doRequest(postData);
  }

  async doRequest(postData: any) {
    console.log('doing request');

    console.log(this.baseUrl + '/stripe.php');

    try {
      const response = await fetch(this.baseUrl + '/stripe.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      console.log('result:');
      console.log(result);

      if (result.error) {
        console.log('request error');
        throw new Error(result.error);
      }

      return result;
    } catch (e) {
      console.log('request error');
      console.log(e);
    }
  }
}
