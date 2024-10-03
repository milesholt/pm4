import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ImageComponent } from './image.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [ImageComponent],
  exports: [ImageComponent],
})
export class ImageModule {}
