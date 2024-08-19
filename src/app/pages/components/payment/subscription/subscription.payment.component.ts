import { Input, Component, OnInit, ViewChild } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

import { loadStripe } from '@stripe/stripe-js';
import { CardPaymentComponent } from '../../payment/card/card.payment.component';

import { environment } from 'src/environments/environment';

@Component({
  //standalone: true,
  selector: 'app-subscription-comp',
  templateUrl: './subscription.payment.component.html',
  styleUrls: ['./subscription.payment.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
//
export class SubscriptionComponent implements OnInit {
  @Input() userSettings: any = false;
  @ViewChild(CardPaymentComponent) cardInputComponent!: CardPaymentComponent;
  private stripePromise = loadStripe(environment.stripe.publicTestKey);

  isPlanChosen = false;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {}

  async choosePlanCard(productName: string) {
    this.isPlanChosen = true;
    const email = 'user@example.com'; // Replace with user email from your app

    try {
      const paymentMethod = await this.cardInputComponent.createPaymentMethod();

      if (!paymentMethod) {
        console.error('Payment method creation failed');
        return;
      }

      const clientSecret = await this.service.stripe.createSubscription(
        email,
        paymentMethod.id,
        productName
      );
      const stripe = await this.cardInputComponent['stripePromise'];

      const result = await stripe!.confirmCardPayment(clientSecret);

      if (result.error) {
        console.error(result.error.message);
      } else {
        console.log('Subscription successful');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  }

  async choosePlan(productName: string) {
    try {
      const stripe = await this.stripePromise;

      if (!stripe) {
        throw new Error('Stripe.js not loaded');
      }

      const preData = {
        ...this.service.auth.getUser(),
        ...this.userSettings,
        ...{ productName: productName },
      };

      console.log(preData);

      const response = await this.service.stripe.doSubscription(preData);

      console.log(response);

      if (response.status == 'checkout') {
        //Store subscription data
        const paymentData = {
          sessionId: response.sessionId,
          subscriptionId: response.subscriptionId,
          productName: productName,
          userId: this.service.auth.getUser().uid,
          paymentType: 'subscription',
          customerId: response.customerId,
          method: 'checkout',
        };

        const sessionId = response.sessionId;

        console.log(paymentData);

        localStorage.setItem('bb_payment_data', JSON.stringify(paymentData));

        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error('Error redirecting to Stripe Checkout:', error);
        }
      }

      if (response.status == 'success') {
        //Handle subscription update
        console.log('Subscription updated');
        const subscriptionId = response.subscriptionId;
        console.log(subscriptionId);

        const paymentData = {
          subscriptionId: response.subscriptionId,
          productName: productName,
          userId: this.service.auth.getUser().uid,
          paymentType: 'subscription',
          method: 'subscription',
        };

        console.log(paymentData);

        localStorage.setItem('bb_payment_data', JSON.stringify(paymentData));

        //update user settings
        const queryParams = { status: 'success' };
        this.router.navigate(['payment-response'], { queryParams });
      }
    } catch (error) {
      console.error('Error creating subscription...');
      console.log(error);
    }
  }

  async doCheckout(productName: string) {
    try {
      console.log('creating session');
      const session: any = await this.service.stripe.createCheckoutSession(
        productName
      );

      const sessionId = session.sessionId;

      console.log('session: ');
      console.log(session);
      const stripe = await this.stripePromise;

      if (!stripe) {
        throw new Error('Stripe.js not loaded');
      }

      console.log(stripe);

      //Store subscription data
      const paymentData = {
        sessionId: sessionId,
        productName: productName,
        userId: this.service.auth.getUser().uid,
        paymentType: 'subscription',
      };

      console.log(paymentData);

      localStorage.setItem('bb_payment_data', JSON.stringify(paymentData));

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Error redirecting to Stripe Checkout:', error);
      }
    } catch (error) {
      console.error('Error creating checkout session:');
      console.log(error);
    }
  }
}
