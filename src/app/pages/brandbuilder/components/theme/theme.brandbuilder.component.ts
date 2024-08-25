import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';
import WebFont from 'webfontloader';

@Component({
  //standalone: true,
  selector: 'app-theme-brandbuilder-comp',
  templateUrl: './theme.brandbuilder.component.html',
  styleUrls: ['./theme.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ThemeBrandBuilderComponent implements OnInit, AfterViewInit {
  selectedColor: string = 'primary';

  theme: any = {
    primary: '#3880ff',
    secondary: '#3dc2ff',
    tertiary: '#5260ff',
    fontFamily: 'Roboto',
  };

  fonts = ['Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Raleway'];

  colorPickerVisible: boolean = true;

  @ViewChild('modalContainer', { static: true })
  modalContainer: ElementRef | null = null;
  modalWidth: number | null = null; // Default width

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadFonts();
  }

  ngAfterViewInit() {
    this.setColorPickerWidth();
  }

  selectColor(color: 'primary' | 'secondary' | 'tertiary') {
    this.selectedColor = color;
    this.colorPickerVisible = false; // Temporarily hide to force rerender
    setTimeout(() => {
      this.colorPickerVisible = true; // Show the color picker again
    }, 0);
  }

  setColorPickerWidth() {
    setTimeout(() => {
      if (this.modalContainer !== null) {
        console.log('found container');
        //const modalWidth = this.modalContainer.nativeElement.clientWidth;
        this.modalWidth =
          document.querySelector('.theme-container')?.clientWidth ?? null;
      }
    }, 300);
  }

  applyTheme() {
    this.modalController.dismiss(this.theme); //
  }

  loadFonts() {
    WebFont.load({
      google: {
        families: this.fonts,
      },
    });
  }

  dismiss() {
    // You can also perform any validation here before dismissing
    this.modalController.dismiss();
  }
}
