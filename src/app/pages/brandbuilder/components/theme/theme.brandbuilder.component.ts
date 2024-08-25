import {
  Component,
  OnInit,
  ViewChild,
  Input,
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

import { FontsBrandBuilderComponent } from '../fonts/fonts.brandbuilder.component';

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
  data: any = null;

  theme: any = {
    primary: '#3880ff',
    secondary: '#3dc2ff',
    tertiary: '#5260ff',
    fontFamily: 'Roboto',
  };

  themes: any = [];
  fonts: any = [];

  selectedFont: string = 'Roboto';

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
    console.log(this.data);
    this.loadThemeData();
  }

  ngAfterViewInit() {
    this.setColorPickerWidth();
  }

  loadThemeData() {
    this.data.themes.colours.forEach((colour: any, index: number) => {
      const font = this.data.themes.fonts[index].name;
      const theme = {
        primary: colour.primary,
        secondary: colour.secondary,
        tertiary: colour.tertiary,
        fontFamily: font,
      };
      this.fonts.push(font);
      this.themes.push(theme);
    });
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

  async openFontSelector() {
    const modal = await this.modalController.create({
      component: FontsBrandBuilderComponent,
      componentProps: {
        selectedFont: this.selectedFont,
        themeFonts: this.fonts,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedFont = result.data;
      }
    });

    return await modal.present();
  }

  dismiss() {
    // You can also perform any validation here before dismissing
    this.modalController.dismiss();
  }
}
