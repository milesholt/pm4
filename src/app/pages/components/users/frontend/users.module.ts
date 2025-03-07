import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersFrontendComponent } from './users.component';
import { FormModule } from '../../form/form.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, FormModule],
  declarations: [UsersFrontendComponent],
})
export class UsersFrontendComponentModule {}
