import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLinkWithHref,
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent],
})
export class FooterModule {}
