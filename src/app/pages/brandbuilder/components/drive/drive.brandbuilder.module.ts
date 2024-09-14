import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DriveComponent } from './drive.brandbuilder.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [DriveComponent],
  exports: [DriveComponent],
})
export class DriveModule {}
