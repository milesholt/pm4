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
    this.stripePromise = loadStripe(environment.stripe.publicLiveKey);
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

    if (data.hasOwnProperty('stripeCustomerId'))
      postData.customerId = data.stripeCustomerId;

    if (data.hasOwnProperty('stripeSubscriptionId'))
      postData.subscriptionId = data.stripeSubscriptionId;

    console.log('post data');
    console.log(postData);

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

  async getActiveSubscription(data: any) {
    let postData: any = {
      action: 'getActiveSubscription',
      customerId: data.customerId,
    };

    console.log('getting active subscription, post data:');
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

      // Log the raw response text for debugging purposes
      const responseText = await response.text();
      console.log('Raw Response Text:', responseText);

      let result;
      try {
        // Parse the response text as JSON
        result = JSON.parse(responseText);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Failed to parse response as JSON.');
      }

      console.log('result:');
      console.log(result);

      // Check if the result contains an error
      if (result.error) {
        console.log('result error');
        throw new Error(result.error);
      }

      return result;
    } catch (e) {
      console.log('request error');
      console.log(e);
      throw e; // rethrow the error to handle it upstream if needed
    }
  }
}
