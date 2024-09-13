import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardPaymentComponent } from './card.payment.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [CardPaymentComponent],
  exports: [CardPaymentComponent],
})
export class CardPaymentModule {}
