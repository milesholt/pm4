import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GalleryComponent } from './gallery.component';


@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [GalleryComponent],
  exports: [GalleryComponent]
})
export class GalleryModule {}
