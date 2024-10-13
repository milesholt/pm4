import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TemplateComponent } from './comp.brandbuilder.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [TemplateComponent],
  exports: [TemplateComponent],
})
export class CompModule {}
