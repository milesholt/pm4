import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductComponent } from './product.component';
//import { QuantityShopComponent } from '../cart/components/quantity/quantity.shop.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { QuantityShopModule } from '../cart/components/quantity/quantity.shop.module';
import { CartButtonShopModule } from '../cart/components/cartbutton/cartbutton.shop.module';
import { SliderModule } from '../../components/slider/slider.module';
import { FooterModule } from '../../components/footer/footer.module';

//Pipes
import { SafeHtmlPipe } from '../../../pipes/safeHtml.pipe';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLinkWithHref,
    RouterModule,
    QuantityShopModule,
    CartButtonShopModule,
    SliderModule,
    FooterModule,
  ],
  declarations: [ProductComponent, SafeHtmlPipe],
})
export class ProductModule {}
