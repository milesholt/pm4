import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContactFormComponent } from './contactform.component';

import { AliasPipe } from 'src/app/pipes/alias.pipe';
import { FormatPipe } from 'src/app/pipes/format.pipe';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [ContactFormComponent, AliasPipe, FormatPipe],
  exports: [ContactFormComponent],
})
export class ContactFormModule {}
