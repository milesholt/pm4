import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TestComponent } from './test.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [TestComponent],
})
export class TestModule {}
