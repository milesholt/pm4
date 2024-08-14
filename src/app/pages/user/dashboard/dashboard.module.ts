import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { ModalComponentModule } from '../../components/modal/modal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLinkWithHref,
    ModalComponentModule,
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
