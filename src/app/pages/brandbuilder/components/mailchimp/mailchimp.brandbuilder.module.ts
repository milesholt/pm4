import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MailchimpComponent} from './mailchimp.brandbuilder.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [MailchimpComponent],
  exports: [MailchimpComponent]
})
  export class MailchimpModule {}
