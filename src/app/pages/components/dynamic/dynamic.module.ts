import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DynamicWrapperComponent } from './dynamic.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [DynamicWrapperComponent],
  exports: [DynamicWrapperComponent],
})
export class DynamicWrapperComponentModule {}
