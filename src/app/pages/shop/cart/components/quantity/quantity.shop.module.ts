import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QuantityShopComponent } from './quantity.shop.component';

//import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref],
  declarations: [QuantityShopComponent],
  exports: [QuantityShopComponent],
})
export class QuantityShopModule {}
