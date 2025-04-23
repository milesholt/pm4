import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ImageComponent } from './image.component';
import { LibraryComponentModule} from '../library/library.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, LibraryComponentModule],
  declarations: [ImageComponent],
  exports: [ImageComponent],
})
export class ImageModule {}
