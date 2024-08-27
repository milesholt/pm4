import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VideoComponent } from './video.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [VideoComponent],
  exports: [VideoComponent],
})
export class VideoModule {}
