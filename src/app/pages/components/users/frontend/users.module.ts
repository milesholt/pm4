import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersFrontendComponent } from './users.component';
import { FormModule } from '../../form/form.module';
import { GalleryModule } from '../../gallery/gallery.module';
import { ImageModule } from '../../image/image.module';
import { ModulesModule } from 'src/app/pages/brandbuilder/components/modules/modules.brandbuilder.module';
import {TabsComponentModule} from '../../tabs/tabs.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FormModule,
    GalleryModule,
    ImageModule,
    ModulesModule,
    TabsComponentModule
  ],
  declarations: [UsersFrontendComponent],
})
export class UsersFrontendComponentModule {}
