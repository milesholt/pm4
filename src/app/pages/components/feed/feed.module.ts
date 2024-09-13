import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FeedComponent } from './feed.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  declarations: [FeedComponent],
  exports: [FeedComponent],
})
export class FeedModule {}
