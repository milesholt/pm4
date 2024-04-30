import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ShopComponent } from './shop.component';

import { FeedModule } from '../components/feed/feed.module';
import { SliderModule } from '../components/slider/slider.module';

import { SearchShopModule } from './components/search/search.shop.module';
import { FilterShopModule } from './components/filter/filter.shop.module';

import { ContactFormModule } from '../components/contactform/contactform.module';
import { AccordionModule } from '../components/accordion/accordion.module';

import { FooterModule } from '../components/footer/footer.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLinkWithHref,
    SearchShopModule,
    FilterShopModule,
    ContactFormModule,
    FeedModule,
    SliderModule,
    AccordionModule,
    FooterModule,
  ],
  declarations: [ShopComponent],
})
export class ShopModule {}
