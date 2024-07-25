import { Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../app.library';
import { CoreService } from '../../services/core.service';

import IG, { API_BASE_URL } from 'ig-node-api';
import { environment } from 'src/environments/environment';

interface TradeParameters {
  entryPrice: number;
  stopPercentage: number;
  riskPercentage: number;
  accountEquity: number;
  valuePerPoint: number;
  riskRewardRatio: number;
}

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
  pricedata: any = [];
  results: any = [];
  findings: any = {};
  tradeResponse: any;
  go: boolean | null = null;
  epics: any = ['CC.D.S.USS.IP'];
  epic: string = '';

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {}

  async ngOnInit() {
    //await this.logout();
    await this.login();
    await this.ini();
    //await this.getPrices();
    //await this.getWatchList();
    //await this.openPosition();
  }

  async ini() {
    console.log('ini');
    this.epics.forEach(async (epic: string) => {
      this.epic = epic;
      await this.getPrices(epic);
    });
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

  async logout() {
    this.myIg = new IG(
      environment.ig.IG_DEMO_USERNAME,
      environment.ig.IG_DEMO_PASSWORD,
      environment.ig.IG_DEMO_API_KEY,
      API_BASE_URL.DEMO,
    );
    this.session = await this.myIg.logout();
  }

  async getWatchList() {
    const watchlists = await this.myIg.getWatchlists();
    this.session = watchlists;
    //My Markets
    const id = '17671591';
    const list = await this.myIg.getWatchlistDetail(id);
    this.session = list;
  }

  async getPrices(epic: string) {
    console.log('getting prices');
    // Get the current date and time
    const now = new Date();

    // Create a new date object for one hour before the current time
    const oneHourBefore = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursBefore = new Date(now.getTime() - 5 * 60 * 60 * 1000);

    // Format the dates as strings 'YYYY-MM-DDTHH:MM:SS'
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      //const minutes = String(date.getMinutes()).padStart(2, '0');
      //const seconds = String(date.getSeconds()).padStart(2, '0');
      //return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      return `${year}-${month}-${day}T${hours}:00:00`;
    };

    const formatDate2 = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}`;
    };

    const formatHour = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      return `${hours}`;
    };

    const from = formatDate(twoHoursBefore);
    const to = formatDate(oneHourBefore);

    let from2 = formatDate2(oneHourBefore) + ':30:00';
    let to2 = formatDate2(now) + ':00:00';

    console.log(epic);
    console.log(from2);
    console.log(to2);

    //get this hour
    const prices = await this.myIg.getPrices({
      epic: epic,
      resolution: 'HOUR',
      max: 1,
      pageSize: 0,
      pageNumber: 1,
      //from: from2,
      //to: to2,
      from: '2024-07-10T18:30:00',
      to: '2024-07-10T19:00:00',
    });

    console.log(prices);
    this.session = prices;

    /*this.service.http
      .getJSON('./assets/deus/data/pricedata.json')
      .subscribe((res: any) => {
        this.pricedata = res;
        this.runMultiple(this.pricedata);
        //this.runAIQuery(pricedata);
      });*/
  }

  async runMultiple(pricedata: any = false, i: number = 0) {
    console.log('running multiple');
    console.log('running AI Query: ' + i);
    await this.runAIQuery(pricedata).then(async (result) => {
      this.results.push(result);
      i++;
      if (i < 5) {
        this.runMultiple(pricedata, i);
        console.log(`Result ${i + 1}:`, result);
      } else {
        console.log('All results:', this.results);
        await this.analyseResults();
        this.decide();
      }
    });
  }

  async analyseResults() {
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

    // Remove 'summary' property
    if (this.findings['summary']) {
      delete this.findings['summary'];
    }

    // Calculate the average for arrays containing only numbers
    for (const key in this.findings) {
      const values = this.findings[key];
      // Get average for arrays with numbers
      if (values.every((value: any) => typeof value === 'number')) {
        const sum = values.reduce((acc: any, val: any) => acc + val, 0);
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

  async decide() {
    this.go = false;
    let f = this.findings;

    if (f.overallTrend == 'downward') {
      if (
        f.movingAverages < 5 &&
        f.movingAveragesConvergenceDivergence < 5 &&
        f.relativeStrengthIndex < 5 &&
        f.fibonacciRetracement <= 5 &&
        f.bollingerBands <= 5 &&
        f.overallRisk !== 'high' &&
        f.riskLevel < 5 &&
        f.decision !== 'CAUTION'
      )
        this.go = true;
    }

    if (f.overallTrend == 'upward') {
      if (
        f.movingAverages > 5 &&
        f.movingAveragesConvergenceDivergence > 5 &&
        f.relativeStrengthIndex > 5 &&
        f.fibonacciRetracement >= 5 &&
        f.bollingerBands >= 5 &&
        f.overallRisk !== 'high' &&
        f.riskLevel < 5 &&
        f.decision !== 'CAUTION'
      )
        this.go = true;
    }

    if (this.go == true) this.beginTrade();
  }

  async beginTrade() {
    var lastClosePrice = this.pricedata[this.pricedata.length - 1];
    var dir = this.findings.decision.includes('SELL') ? 'SELL' : 'BUY';
    var entryPrice = dir == 'SELL' ? lastClosePrice.bid : lastClosePrice.ask;

    const tradeParams: TradeParameters = {
      entryPrice: entryPrice,
      stopPercentage: 5,
      riskPercentage: 1,
      accountEquity: 10000,
      valuePerPoint: 1,
      riskRewardRatio: 2,
    };

    const tradeDetails = this.calculateTradeDetails(tradeParams);
    this.openPosition(tradeDetails);
  }

  calculateTradeDetails(params: TradeParameters) {
    const {
      entryPrice,
      stopPercentage,
      riskPercentage,
      accountEquity,
      valuePerPoint,
      riskRewardRatio,
    } = params;

    // Calculate Stop Distance in Points
    const stopDistance = entryPrice * (stopPercentage / 100);

    // Calculate Stop Loss Price for a Short Position
    const stopLossPrice = entryPrice + stopDistance;

    // Calculate Limit Distance in Points based on Risk-Reward Ratio
    const limitDistance = stopDistance * riskRewardRatio;

    // Calculate Take Profit Price for a Short Position
    const takeProfitPrice = entryPrice - limitDistance;

    // Calculate Risk Per Trade
    const riskPerTrade = accountEquity * (riskPercentage / 100);

    // Calculate Position Size
    const positionSize = riskPerTrade / (stopDistance * valuePerPoint);

    return {
      stopDistance,
      stopLossPrice,
      limitDistance,
      takeProfitPrice,
      positionSize,
    };
  }

  async runAIQuery(data: any = false, attempt: number = 0) {
    return new Promise(async (resolve) => {
      //setTimeout(async () => {
      if (!!data) {
        console.log(data);

        let reportJSON: any = {
          summary: '',
          movingAverages: 0,
          movingAveragesConvergenceDivergence: 0,
          relativeStrengthIndex: 0,
          fibonacciRetracement: 0,
          bollingerBands: 0,
          overallTrend: '',
          riskLevel: 0,
          overallRisk: '',
          decision: '',
        };

        const prompt =
          'Using the following five technical analysis methods: Moving Averages, MACD (Moving Average Convergence Divergence), Fibonacci Retracement, Bollinger Bands & Relative Strength Index (RSI), analyse the following JSON financial data and give me a report with a final decision on whether to BUY or SELL. Using your response, complete the blank values from the following JSON structure, and only this structure. Do no create any other properties: ' +
          JSON.stringify(reportJSON) +
          ' The summary property can be a summary report in no more than 500 words. For the value of the property "movingAverage", provide a score out of 10 based on the result of the analysis method Moving Averages, (with 0 being the strongest indication of the stock price going down and 10 being the highest indication of the stock price going up). For the value of the property "movingAveragesConvergenceDivergence", provide a score out of 10 based on the result of the analysis method Moving Averages Convergence Divergence, (with 0 being the strongest indication of the stock price going down and 10 being the highest indication of the stock price going up). For the value of the property "relativeStrengthIndex", provide a score out of 10 based on the result of the analysis method Relative Strength Index, (with 0 being the strongest indication of the stock price going down and 10 being the highest indication of the stock price going up). For the value of the property "fibonacciRetracement", provide a score out of 10 based on the result of the analysis method Fibonacci Retracement, (with 0 being the strongest indication of the stock price going down and 10 being the highest indication of the stock price going up). For the value of the property "bollingerBands", provide a score out of 10 based on the result of the analysis method Bollinger Bands, (with 0 being the strongest indication of the stock price going down and 10 being the highest indication of the stock price going up). Make sure the values for each of the analysis method properties are a score as mentioned, and no more than 10. The overallTrend property can be either "downward", "neutral", or "upward". The riskLevel can be a number 0 out of 5, with 0 being low risk and 5 being high risk. overallRisk can either be "low", "medium" or "high". The decision needs to be BUY, STRONG BUY, SELL, STRONG SELL or NEUTRAL. If the overallRisk is "high" the decision should be CAUTION. And here is the JSON financial data: ' +
          JSON.stringify(data) +
          ' Do not return any other response, or additional text, only the JSON structure, with no line breaks and formatted correctly.';

        this.session = await this.service.ai.useGeminiPro(prompt, 'json');

        try {
          JSON.parse(this.session);
          console.log('formatted JSON');
          this.session = JSON.parse(this.session);
          //check for null values
          let pass = true;
          Object.keys(this.session).forEach((key) => {
            if (this.session[key] == null) pass = false;
          });
          if (!pass) {
            if (attempt < 3) {
              attempt++;
              this.service.ai.message = 'Trying again..' + attempt;
              this.runAIQuery(data, attempt);
            }
          }
        } catch (e) {
          //if not json try again
          if (attempt < 3) {
            attempt++;
            this.service.ai.message = 'Trying again..' + attempt;
            this.runAIQuery(data, attempt);
          }
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

  async openPosition(details: any) {
    const createPositionResponse = await this.myIg.createOtcPosition({
      epic: this.epic,
      direction: details.direction,
      orderType: 'MARKET',
      size: details.size,
      forceOpen: true,
      guaranteedStop: false,
      stopLevel: null,
      stopDistance: details.stopDistance,
      trailingStop: 'true',
      trailingStopIncrement: '0',
      limitLevel: null,
      limitDistance: details.limitDistance,
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
