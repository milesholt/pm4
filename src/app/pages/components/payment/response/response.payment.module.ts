import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ResponsePaymentComponent } from './response.payment.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [ResponsePaymentComponent],
})
export class ResponsePaymentModule {}
