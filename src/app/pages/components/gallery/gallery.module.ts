import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GalleryComponent } from './gallery.component';

import { ImageModule } from '../image/image.module';
import { LibraryComponentModule } from '../library/library.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ImageModule,
    LibraryComponentModule,
  ],
  declarations: [GalleryComponent],
  exports: [GalleryComponent],
})
export class GalleryModule {}
