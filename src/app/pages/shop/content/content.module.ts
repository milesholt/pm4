import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContentComponent } from './content.component';
import { FooterModule } from '../../components/footer/footer.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FooterModule,
    RouterModule,
    HttpClientModule,
  ],
  declarations: [ContentComponent],
  exports: [ContentComponent],
})
export class ContentModule {}
