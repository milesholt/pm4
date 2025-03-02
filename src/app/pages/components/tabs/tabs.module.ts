import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsComponent } from './tabs.component';

import { DynamicWrapperComponentModule } from '../dynamic/dynamic.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DynamicWrapperComponentModule,
  ],
  declarations: [TabsComponent],
  exports: [TabsComponent],
})
export class TabsComponentModule {}
