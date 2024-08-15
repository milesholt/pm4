import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SubscriptionComponent } from './subscription.payment.component';
import { CardPaymentModule } from '../card/card.payment.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, CardPaymentModule],
  declarations: [SubscriptionComponent],
  exports: [SubscriptionComponent],
})
export class SubscriptionComponentModule {}
