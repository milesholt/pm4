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
  myIg: any;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {}

  async ngOnInit() {
    await this.login();
    await this.getWatchList();
    await this.openPosition();
  }

  async login() {
    this.myIg = new IG(
      environment.ig.IG_DEMO_USERNAME,
      environment.ig.IG_DEMO_PASSWORD,
      environment.ig.IG_DEMO_API_KEY,
      API_BASE_URL.DEMO,
    );
    this.session = await this.myIg.login();
  }

  async getWatchList() {
    const watchlists = await this.myIg.getWatchlists();
    this.session = watchlists;
    //My Markets
    const id = '17671591';
    const list = await this.myIg.getWatchlistDetail(id);
    this.session = list;
  }

  async openPosition() {
    const createPositionResponse = await this.myIg.createOtcPosition({
      epic: 'CC.D.S.USS.IP',
      direction: 'BUY',
      orderType: 'MARKET',
      size: 3,
      forceOpen: true,
      guaranteedStop: false,
      stopLevel: null,
      stopDistance: '4',
      trailingStop: 'true',
      trailingStopIncrement: '0',
      limitLevel: null,
      limitDistance: '4',
      currencyCode: 'GBP',
      expiry: 'DFB',
    });
    console.log(createPositionResponse);
    this.session = createPositionResponse;

    const dealStatus = await this.myIg.checkDealStatus(
      createPositionResponse.dealReference,
    );
    console.log(dealStatus);
  }
}
