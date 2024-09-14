import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MailchimpComponent } from './mailchimp.brandbuilder.component';
//import { EmbedComponent } from '../embed/embed.brandbuilder.component';

import { EmbedModule } from '../embed/embed.brandbuilder.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, EmbedModule],
  declarations: [MailchimpComponent],
  exports: [MailchimpComponent],
})
export class MailchimpModule {}
