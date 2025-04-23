import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LibraryComponent } from './library.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [LibraryComponent],
  exports: [LibraryComponent]
})
export class LibraryComponentModule {}
