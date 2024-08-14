import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from './modal.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [ModalComponent],
  exports: [ModalComponent],
})
export class ModalComponentModule {}
