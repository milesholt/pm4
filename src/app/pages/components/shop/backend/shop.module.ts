import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ShopComponentBackend } from './shop.component';

import { FeedModule } from '../../../components/feed/feed.module';
import { SliderModule } from '../../../components/slider/slider.module';

import { FormModule } from '../../../components/form/form.module';
import { AccordionModule } from '../../../components/accordion/accordion.module';

import { FooterModule } from '../../../components/footer/footer.module';

import { RefresherModule } from '../../../components/refresher/refresher.module';
import { TabsComponentModule } from '../../tabs/tabs.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLinkWithHref,
    FormModule,
    FeedModule,
    SliderModule,
    AccordionModule,
    FooterModule,
    RefresherModule,
    TabsComponentModule,
  ],
  declarations: [ShopComponentBackend],
  exports: [ShopComponentBackend],
})
export class ShopComponentBackendModule {}
