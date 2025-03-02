import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FilterShopComponent } from './filter.shop.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [FilterShopComponent],
  exports: [FilterShopComponent],
})
export class FilterShopModule {}
