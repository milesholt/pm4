import { Component, OnInit, AfterViewInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

import { environment } from 'src/environments/environment';

@Component({
  //standalone: true,
  selector: 'app-card-payment-comp',
  templateUrl: './card.payment.component.html',
  styleUrls: ['./card.payment.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class CardPaymentComponent implements AfterViewInit {
  private stripePromise: Promise<Stripe | null>;
  private cardElement!: StripeCardElement;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {
    this.stripePromise = loadStripe(environment.stripe.publicTestKey);
  }

  async ngAfterViewInit() {
    const stripe = await this.stripePromise;

    if (!stripe) {
      throw new Error('Stripe.js not loaded');
    }

    const elements = stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
  }

  async createPaymentMethod() {
    const stripe = await this.stripePromise;

    if (!stripe) {
      throw new Error('Stripe.js not loaded');
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
    });

    if (error) {
      console.error(error);
      return null;
    } else {
      return paymentMethod;
    }
  }
}
