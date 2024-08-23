import { Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-theme-brandbuilder-comp',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ThemeBrandBuilderComponent implements OnInit {
  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {}
}
