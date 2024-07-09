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
  results: any = [];
  findings: any = {};

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {}

  async ngOnInit() {
    //await this.login();
    await this.getPrices();
    //await this.getWatchList();
    //await this.openPosition();
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

  async getPrices() {
    /*const prices = await this.myIg.getPrices({
      epic: 'CC.D.S.USS.IP',
      resolution: 'DAY',
      max: 6,
      pageSize: 0,
      pageNumber: 1,
      from: '2024-06-01T00:00:00',
      to: '2024-07-01T00:00:00',
    });*/

    this.service.http
      .getJSON('./assets/deus/data/pricedata.json')
      .subscribe((res: any) => {
        const pricedata = res;
        this.runMultiple(pricedata);
        //this.runAIQuery(pricedata);
      });
  }

  async runMultiple(pricedata: any = false, i: number = 0) {
    console.log('running multiple');
    console.log('running AI Query: ' + i);
    await this.runAIQuery(pricedata).then((result) => {
      this.results.push(result);
      i++;
      if (i < 5) {
        this.runMultiple(pricedata, i);
        console.log(`Result ${i + 1}:`, result);
      } else {
        console.log('All results:', this.results);
        this.analyseResults();
      }
    });
  }

  async analyseResults() {
    /*this.results.forEach((item: any) => {
      if (typeof item === 'object' && item !== null) {
        for (const key in item) {
          if (!this.findings[key]) {
            this.findings[key] = [];
          }
          this.findings[key].push(item[key]);
        }
      }
    });*/

    // Loop through the array
    this.results.forEach((item: any) => {
      if (typeof item === 'object' && item !== null) {
        for (const key in item) {
          if (!this.findings[key]) {
            this.findings[key] = [];
          }
          this.findings[key].push(item[key]);
        }
      }
    });

    // Move 'summary' property
    if (this.findings['summary']) {
      delete this.findings['summary'];
    }

    // Calculate the average for arrays containing only numbers
    for (const key in this.findings) {
      const values = this.findings[key];
      if (values.every((value: any) => typeof value === 'number')) {
        const sum = values.reduce((acc: any, val: any) => acc + val, 0);
        //const average = sum / values.length;
        //this.findings[key] = average;
        //const average = (sum / values.length).toFixed(1);
        this.findings[key] = Math.round(sum / values.length);
      } else if (values.every((value: any) => typeof value === 'string')) {
        // Find the most frequent string in arrays containing only strings
        const frequencyMap: { [key: string]: number } = values.reduce(
          (map: { [key: string]: number }, value: string) => {
            map[value] = (map[value] || 0) + 1;
            return map;
          },
          {},
        );

        const maxFrequency = Math.max(
          ...(Object.values(frequencyMap) as number[]),
        );
        const mostFrequentStrings = Object.keys(frequencyMap).filter(
          (key) => frequencyMap[key] === maxFrequency,
        );

        if (mostFrequentStrings.length === 1) {
          this.findings[key] = mostFrequentStrings[0];
        }
      }
    }
  }

  async runAIQuery(data: any = false) {
    return new Promise(async (resolve) => {
      //setTimeout(async () => {
      if (!!data) {
        console.log(data);

        let reportJSON: any = {
          summary: '',
          movingAveragesScore: 0,
          MACDScore: 0,
          fibonacciScore: 0,
          rsiScore: 0,
          overallTrend: '',
          riskLevel: 0,
          overallRisk: '',
          decision: '',
        };

        /*const query =
        'Using the following five technical analysis methods: Moving Averages, MACD (Moving Average Convergence Divergence), Fibonacci Retracement, Bollinger Bands & Relative Strength Index (RSI), analyse the following JSON financial data and give me a report with a final decision on whether to BUY or SELL. Using your response, complete the blank values from the following JSON structure, and only this structure. Do no create any other properties: ' +
        JSON.stringify(reportJSON) +
        ' The outcome property can contain all your response. Where any of the property keys has the word "Score", complete the value based on a risk score out of 10. The overallTrend property can be either downward, neutral, or upward. The riskLevel can be 0 out of 5. The decision needs to be BUY, STRONG BUY, SELL, STRONG SELL or NEUTRAL. And here is the JSON financial data: ';
      JSON.stringify(data);*/

        const query =
          'Using the following five technical analysis methods: Moving Averages, MACD (Moving Average Convergence Divergence), Fibonacci Retracement, Bollinger Bands & Relative Strength Index (RSI), analyse the following JSON financial data and give me a report with a final decision on whether to BUY or SELL. Using your response, complete the blank values from the following JSON structure, and only this structure. Do no create any other properties: ' +
          JSON.stringify(reportJSON) +
          ' The summary property can be a summary report in no more than 500 words. Where any of the property keys has the word "Score", complete the value based on a risk score, being a number out of 10. The overallTrend property can be either "downward", "neutral", or "upward". The riskLevel can be a number 0 out of 5. overallRisk can either be "low", "medium" or "high". The decision needs to be BUY, STRONG BUY, SELL, STRONG SELL or NEUTRAL. If the overallRisk is "high" the decision should be CAUTION. And here is the JSON financial data: ' +
          JSON.stringify(data) +
          ' Do not return any other response, or additional text, only the JSON structure, with no line breaks and formatted correctly.';

        const prompt = query;
        /*const prompt =
        'Using this JSON data, can you provide all the high price ask numbers in a list.' +
        JSON.stringify(data);*/
        this.session = await this.service.ai.useGeminiPro(prompt, 'json');

        try {
          JSON.parse(this.session);
          console.log('formatted JSON');
          this.session = JSON.parse(this.session);
        } catch (e) {
          console.log('could not format JSON');
        }

        console.log(this.session);
        //resolve(this.session);
      } else {
        //reject('No data');
        console.log('No data provided. Cannot run AI Query');
        this.session = null;
      }

      resolve(this.session);
      // }, 60000); // Simulate an async operation with a timeout
    });
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
