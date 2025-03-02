import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { ModalComponentModule } from '../../components/modal/modal.module';
import { SubscriptionComponentModule } from '../../components/payment/subscription/subscription.payment.module';
import { CardPaymentModule } from '../../components/payment/card/card.payment.module';

import { UsersBackendComponentModule } from '../../components/users/backend/users.module';
import { ShopComponentBackendModule } from '../../components/shop/backend/shop.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLinkWithHref,
    ModalComponentModule,
    SubscriptionComponentModule,
    CardPaymentModule,
    UsersBackendComponentModule,
    ShopComponentBackendModule,
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
