import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormComponent } from './form.component';

import { AliasPipe } from 'src/app/pipes/alias.pipe';
import { FormatPipe } from 'src/app/pipes/format.pipe';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [FormComponent, AliasPipe, FormatPipe],
  exports: [FormComponent],
})
export class FormModule {}
