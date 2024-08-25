import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ColorPickerModule } from 'ngx-color-picker';

import { ThemeBrandBuilderComponent } from './theme.brandbuilder.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ColorPickerModule],
  declarations: [ThemeBrandBuilderComponent],
  exports: [ThemeBrandBuilderComponent],
})
export class ThemeBrandBuilderModule {}
