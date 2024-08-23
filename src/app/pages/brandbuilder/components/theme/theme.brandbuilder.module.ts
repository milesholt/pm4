import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ThemeBrandBuilderComponent } from './theme.brandbuilder.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [ThemeBrandBuilderComponent],
  exports: [ThemeBrandBuilderComponent],
})
export class ThemeBrandBuilderModule {}
