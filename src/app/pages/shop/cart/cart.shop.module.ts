import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartShopComponent } from './cart.shop.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref],
  declarations: [CartShopComponent],
  exports: [CartShopComponent],
})
export class CartShopModule {}
