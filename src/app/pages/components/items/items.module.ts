import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ItemsComponent } from './items.component';

import { FormModule } from '../form/form.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, FormModule],
  declarations: [ItemsComponent],
  exports: [ItemsComponent],
})
export class ItemsComponentModule {}
