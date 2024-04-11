import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ShopComponent } from './shop.component';

import { SearchShopModule } from './components/search/search.shop.module';
import { FilterShopModule } from './components/filter/filter.shop.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLinkWithHref,
    SearchShopModule,
    FilterShopModule,
  ],
  declarations: [ShopComponent],
})
export class ShopModule {}
