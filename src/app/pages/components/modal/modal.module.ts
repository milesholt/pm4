import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from './modal.component';
import { ModalDynamicComponent } from './modal-dynamic.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [ModalComponent, ModalDynamicComponent],
  exports: [ModalComponent, ModalDynamicComponent],
})
export class ModalComponentModule {}
