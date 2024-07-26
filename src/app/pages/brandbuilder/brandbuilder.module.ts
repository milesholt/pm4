import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';

import { BrandBuilderComponent } from './brandbuilder.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/*Other components */
import { ShopComponent } from '../shop/shop.component';
import { FeedModule } from '../components/feed/feed.module';
import { SliderModule } from '../components/slider/slider.module';
import { SearchShopModule } from '../shop/components/search/search.shop.module';
import { FilterShopModule } from '../shop/components/filter/filter.shop.module';
import { ContactFormModule } from '../components/contactform/contactform.module';
import { AccordionModule } from '../components/accordion/accordion.module';
import { FooterModule } from '../components/footer/footer.module';
import { RefresherModule } from '../components/refresher/refresher.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    RouterLinkWithHref,
    CommonModule,
    FormsModule,
    SearchShopModule,
    FilterShopModule,
    ContactFormModule,
    FeedModule,
    SliderModule,
    AccordionModule,
    FooterModule,
    RefresherModule,
  ],
  declarations: [BrandBuilderComponent],
})
export class BrandBuilderModule {}
