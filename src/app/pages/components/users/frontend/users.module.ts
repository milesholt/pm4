import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersFrontendComponent } from './users.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [UsersFrontendComponent],
})
export class UsersFrontendComponentModule {}
