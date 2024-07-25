import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';

import { BrandBuilderComponent } from './brandbuilder.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, RouterLinkWithHref, CommonModule, FormsModule],
  declarations: [BrandBuilderComponent],
})
export class BrandBuilderModule {}
