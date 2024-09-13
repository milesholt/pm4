import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DeusComponent } from './deus.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [DeusComponent],
})
export class DeusModule {}
