import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

import { register } from 'swiper/element/bundle';
register();

@Component({
  //standalone: true,
  selector: 'app-slider-comp',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class SliderComponent implements OnInit {
  @Input() config: any = {};
  @Input() slides: any = [];
  @ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.mainSwiper) {
        this.iniSlider();
      }
    });
  }

  async iniSlider() {
    // swiper element
    //const swiperEl = <any>document.querySelector('.main-swiper');
    const swiperEl = this.mainSwiper.nativeElement;
    // swiper parameters
    const swiperParams = {
      slidesPerView: 1,
      navigation: false,
      /*pagination: {
        clickable: true,
      },*/
      /*thumbs: {
        swiper: '.thumbs-swiper',
      },*/
      on: {
        init() {},
      },
    }; //

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    // and now initialize it
    swiperEl.initialize();
  }
}
