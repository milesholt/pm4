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

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public route: ActivatedRoute,
    public lib: Library
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const status = params['status']; // Get the document ID from query parameters
      const sessionId = params['sessionId'] ?? false; // Get the document ID from query parameters

      this.status = status;
      if (status == 'success') {
        this.responseTitle = 'Payment Finalising';
        this.responseMessage =
          'One moment. Please do not close the browser and wait for the process to complete. Session ID is: ' +
          this.sessionId;

        const paymentData = localStorage.getItem('bb_payment_data');
        this.responseData =
          paymentData !== null ? JSON.parse(paymentData) : null;
      }
      if (status == 'cancel') {
        this.responseTitle = 'Payment Cancelled';
        this.responseMessage =
          'There was an issue with payment or the payment was cancelled.';
      }
    });
  }

  ngOnDestroy() {}
}
