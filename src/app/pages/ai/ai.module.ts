import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AIComponent } from './ai.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [AIComponent],
})
export class AIModule {}
