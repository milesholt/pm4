import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MailchimpCom} from './mailchimp.brandbuilder.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [EmbedComponent],
  exports: [MailchimpComponrnt]
})
  export class EmbedModule {}
