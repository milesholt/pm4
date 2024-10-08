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
import { FormModule } from '../components/form/form.module';
import { AccordionModule } from '../components/accordion/accordion.module';
import { FooterModule } from '../components/footer/footer.module';
import { RefresherModule } from '../components/refresher/refresher.module';
import { GalleryModule } from '../components/gallery/gallery.module';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentEditableDirective } from 'src/app/directives/content-editable.directive';

import { ThemeBrandBuilderModule } from './components/theme/theme.brandbuilder.module';
import { ModulesModule } from './components/modules/modules.brandbuilder.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    RouterLinkWithHref,
    CommonModule,
    FormsModule,
    SearchShopModule,
    FilterShopModule,
    FormModule,
    FeedModule,
    SliderModule,
    AccordionModule,
    FooterModule,
    RefresherModule,
    GalleryModule,
    ThemeBrandBuilderModule,
    ModulesModule,
    //BrowserAnimationsModule,
  ],
  declarations: [BrandBuilderComponent, ContentEditableDirective],
})
export class BrandBuilderModule {}
