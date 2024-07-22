import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ContentComponent } from './content.component';

//Components
import { SliderModule } from '../components/slider/slider.module';
import { ContactFormModule } from '../components/contactform/contactform.module';
import { AccordionModule } from '../components/accordion/accordion.module';
import { FooterModule } from '../components/footer/footer.module';
import { RefresherModule } from '../components/refresher/refresher.module';
import { VideoModule } from '../components/video/video.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLinkWithHref,
    SliderModule,
    ContactFormModule,
    AccordionModule,
    FooterModule,
    RefresherModule,
    VideoModule,
  ],
  declarations: [ContentComponent],
  exports: [ContentComponent],
})
export class ContentModule {}
