import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccordionComponent } from './accordion.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [AccordionComponent],
  exports: [AccordionComponent],
})
export class AccordionModule {}
