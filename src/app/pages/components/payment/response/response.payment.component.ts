import { Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-response-payment-comp',
  templateUrl: './response.payment.component.html',
  styleUrls: ['./response.payment.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ResponsePaymentComponent implements OnInit {
  status: string = '';
  responseMessage: string = '';
  responseData: any = null;
  responseTitle: string = '';
  sessionId: string | boolean = false;
  isFinalising: boolean = true;
  isSuccess: boolean = false;
  isFail: boolean = false;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public route: ActivatedRoute,
    public lib: Library
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.status = params['status'] ?? ''; // Get the document ID from query parameters
      this.sessionId = params['session_id'] ?? false; // Get the document ID from query parameters

      if (this.status == 'success') {
        this.responseTitle = 'Payment Finalising';
        this.responseMessage =
          'One moment. Please do not close the browser and wait for the process to complete.';

        let paymentData: any = localStorage.getItem('bb_payment_data') ?? null;
        this.responseData =
          paymentData !== null ? JSON.parse(paymentData) : null;

        if (paymentData !== null) {
          paymentData = JSON.parse(paymentData);

          const userId = paymentData.userId;

          const pathSegments = ['users', userId, 'user'];
          const documentName = 'settings';
          let documentData: any = {
            aiLimit: 100,
            aiCalls: 0,
            membershipId: paymentData.productName,
            stripeCustomerId: paymentData.stripeCustomerId,
            siteLimit: 5,
            sitesCreated: 0,
          };

          if (paymentData.sessionId)
            documentData.stripeSessionId = paymentData.sessionId;

          if (paymentData.subscriptionId)
            documentData.stripeSubscriptionId = paymentData.subscriptionId;

          this.service.firestore
            .updateDocument(pathSegments, documentName, documentData)
            .then(() => {
              console.log('User settings updated successully');
              this.responseMessage =
                'New subscription finalised successfully! You can now enjoy the benefits of your new membership.<br><br><a href="/dashboard">Click here</a> to continue.';
              this.isSuccess = true;
              this.isFinalising = false;
              /*setTimeout(()=>{
                this.router.navigate('/dashboard');
              },2000);*/
            })
            .catch((e) => {
              console.log('Could not update user settings');
              console.log(e);
              this.responseMessage =
                'Oops. New user subscription failed to complete. Please refresh the browser or contact us.';
              this.isFail = true;
              this.isFinalising = false;
            });
        } else {
          console.log('No payment data');
        }
      }
      if (this.status == 'cancel') {
        this.responseTitle = 'Payment Cancelled';
        this.responseMessage =
          'There was an issue with payment or the payment was cancelled.';
      }
    });
  }

  ngOnDestroy() {}
}
