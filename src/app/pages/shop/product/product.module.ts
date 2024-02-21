import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductComponent } from './product.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref],
  declarations: [ProductComponent],
})
export class ProductModule {}
