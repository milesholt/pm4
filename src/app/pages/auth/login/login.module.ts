import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterLinkWithHref  
  ],
  declarations: [LoginComponent]
})
export class LoginModule {}
