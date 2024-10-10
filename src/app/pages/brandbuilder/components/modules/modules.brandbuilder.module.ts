import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModulesComponent } from './modules.brandbuilder.component';

//import { SomeComponent } from './modules.brandbuilder.component';

import { DynamicWrapperComponent } from 'src/app/pages/components/dynamic/dynamic.component';

//Modules
import { FormModule } from '../../../components/form/form.module';
import { AccordionModule } from '../../../components/accordion/accordion.module';
import { GalleryModule } from '../../../components/gallery/gallery.module';
import { VideoModule } from 'src/app/pages/components/video/video.module';
import { MailchimpModule } from '../mailchimp/mailchimp.brandbuilder.module';
import { DriveModule } from '../drive/drive.brandbuilder.module';
import { ImageModule } from 'src/app/pages/components/image/image.module';
import { LinkModule } from '../link/link.brandbuilder.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FormModule,
    AccordionModule,
    GalleryModule,
    VideoModule,
    MailchimpModule,
    DriveModule,
    ImageModule,
    LinkModule,
  ],
  declarations: [ModulesComponent, DynamicWrapperComponent],
  exports: [ModulesComponent],
})
export class ModulesModule {}
