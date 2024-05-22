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

  @Input() slidesPerView: number = 1;
  @Input() navigation: boolean = false;
  @Input() thumbs: number | boolean = false;
  @Input() zoom: boolean = false;
  @Input() init: boolean = true;
  @Input() slideSuffix: string = '';
  @Input() type: string | boolean = false;
  @Input() classes: string | boolean = false;
  @Input() cta: any = false;

  @ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {}

  ngOnInit() {}

  doCTA() {
    // Perform scrolling action to the desired section
    if (this.cta.anchor) {
      const sectionElement = document.querySelectorAll(this.cta.anchor)[0];
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
        /*const offset = 50;
        const offsetPosition = sectionElement.offsetTop - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });*/
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.mainSwiper) {
        this.iniSlider();
      }
    });
  }

  async iniSlider() {
    var zoomParams =
      this.zoom == true
        ? {
            maxRatio: 5,
            minRatio: 1,
            toggle: true,
          }
        : false;

    // swiper element
    //const swiperEl = <any>document.querySelector('.main-swiper');
    const swiperEl = this.mainSwiper.nativeElement;
    // swiper parameters
    const swiperParams = {
      slidesPerView: this.slidesPerView,
      navigation: this.navigation,
      /*pagination: {
        clickable: true,
      },*/
      zoom: zoomParams,
      thumbs: {
        swiper: '.thumbs-swiper',
      },
      on: {
        init() {},
      },
    }; //

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    // and now initialize it
    swiperEl.initialize();
  }

  setWordClass(string: string) {
    const wordCount = string.split(/\s+/).length;
    let wordClass = '';

    if (wordCount <= 1) {
      wordClass = 'one-word';
    } else if (wordCount <= 5) {
      wordClass = 'few-words';
    } else {
      wordClass = 'many-words';
    }

    return wordClass;
  }
}
