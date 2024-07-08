import { Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../app.library';
import { CoreService } from '../../services/core.service';

import IG, { API_BASE_URL } from 'ig-node-api';
import { environment } from 'src/environments/environment';

@Component({
  //standalone: true,
  selector: 'app-deus',
  templateUrl: './deus.component.html',
  styleUrls: ['./deus.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class DeusComponent implements OnInit {
  session: any;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {}

  ngOnInit() {
    this.login();
  }

  async login() {
    const myIg = new IG(
      environment.ig.IG_DEMO_USERNAME,
      environment.ig.IG_DEMO_PASSWORD,
      environment.ig.IG_DEMO_API_KEY,
      API_BASE_URL.DEMO,
    );
    this.session = await myIg.login();
  }
}
