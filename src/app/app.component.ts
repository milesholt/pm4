import { Component } from '@angular/core';

//This only worked if in child component
/*import { register } from 'swiper/element/bundle';
register();
*/

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
}
