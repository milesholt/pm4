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

  async createCheckoutSession(priceId: string): Promise<string> {
    const hostUrl = `${window.location.protocol}//${window.location.host}`;

    const response = await fetch(this.baseUrl + '/stripe-checkout.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId: priceId, url: hostUrl }),
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    return result.id;
  }
}
