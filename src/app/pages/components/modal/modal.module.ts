import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from './modal.component';
import { ModalDynamicComponent } from './modal-dynamic.component';

import { CoreService } from '../../../services/core.service'; // Adjust the path as necessary
import { Library } from '../../../app.library'; // Adjust the path as necessary

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [ModalComponent, ModalDynamicComponent],
  exports: [ModalComponent, ModalDynamicComponent],
  providers: [CoreService, Library], // Add providers here
})
export class ModalComponentModule {}
