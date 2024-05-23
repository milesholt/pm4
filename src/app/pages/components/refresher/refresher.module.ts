import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RefresherComponent } from './refresher.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [RefresherComponent],
  exports: [RefresherComponent],
})
export class RefresherModule {}
