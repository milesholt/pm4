import { Component } from '@angular/core';

//import { SafeHtmlPipe } from './pipes/safeHtml.pipe';

//This only worked if in child component
/*import { register } from 'swiper/element/bundle';
register();
*/

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  //imports: [SafeHtmlPipe],
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
}
