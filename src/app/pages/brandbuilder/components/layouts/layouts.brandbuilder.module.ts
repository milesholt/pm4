import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LayoutsComponent } from './layouts.brandbuilder.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [LayoutsComponent],
  exports: [LayoutsComponent],
})
export class LayoutsModule {}
