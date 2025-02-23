import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersBackendComponent } from './users.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [UsersBackendComponent],
  exports: [UsersBackendComponent],
})
export class UsersBackendComponentModule {}
