import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontsBrandBuilderComponent } from './fonts.brandbuilder.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [FontsBrandBuilderComponent],
  exports: [FontsBrandBuilderComponent],
})
export class FontsBrandBuilderModule {}
