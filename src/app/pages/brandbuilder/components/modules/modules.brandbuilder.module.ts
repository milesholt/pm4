import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModulesComponent } from './modules.brandbuilder.component';

//import { SomeComponent } from './modules.brandbuilder.component';

import { DynamicWrapperComponent } from 'src/app/pages/components/dynamic/dynamic.component';

//Modules
import { ContactFormModule } from '../../../components/contactform/contactform.module';
import { AccordionModule } from '../../../components/accordion/accordion.module';
import { GalleryModule } from '../../../components/gallery/gallery.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ContactFormModule,
    AccordionModule,
    GalleryModule,
  ],
  declarations: [ModulesComponent, DynamicWrapperComponent],
  exports: [ModulesComponent],
})
export class ModulesModule {}
