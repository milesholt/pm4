import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavComponent } from './nav.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [NavComponent],
})
export class NavComponentModule {}
