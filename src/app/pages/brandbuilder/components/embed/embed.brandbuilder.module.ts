import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmbedComponent } from './embed.brandbuilder.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [EmbedComponent],
  exports: [EmbedComponent]
})
  export class EmbedModule {}
