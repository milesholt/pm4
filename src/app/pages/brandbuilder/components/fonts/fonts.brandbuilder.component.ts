import { Component, OnInit, Inject } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

import WebFont from 'webfontloader';

@Component({
  //standalone: true,
  selector: 'app-fonts-brandbuilder-comp',
  templateUrl: './fonts.brandbuilder.component.html',
  styleUrls: ['./fonts.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class FontsBrandBuilderComponent implements OnInit {
  fonts = ['Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Raleway'];
  themeFonts = [];
  selectedFont: string;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private modalCtrl: ModalController,
    @Inject(NavParams) private navParams: NavParams
  ) {
    this.selectedFont = this.navParams.get('selectedFont') || 'Roboto';
  }

  ngOnInit() {
    this.fonts = this.lib.mergeArray(this.fonts, this.themeFonts);
    console.log(this.fonts);
    this.loadFonts();
  }

  loadFonts() {
    WebFont.load({
      google: {
        families: this.fonts,
      },
    });
  }

  selectFont(font: string) {
    this.modalCtrl.dismiss(font);
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
}
