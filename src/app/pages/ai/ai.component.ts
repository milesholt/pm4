import { Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../app.library';
import { CoreService } from '../../services/core.service';

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

import { environment } from 'src/environments/environment';

@Component({
  //standalone: true,
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class AIComponent implements OnInit {
  analysisResult: string = '';
  message: string = '';
  prompt: string =
    "I have a trade open for the commodity OIL. The position is BUY. What is today's financial anaylsis for this commodity. Summarize with one word either positive or negative at the end.";
  generating: boolean = false;
  generated: boolean = false;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {}

  ngOnInit() {}

  //doesn't work yet - using server on google run - port8080 fails to listen
  /*analyzeText(text: any = '') {
    this.service.ai.analyzeText(text).subscribe((result) => {
      this.analysisResult = result;
    });
  }*/

  async useGeminiPro(prompt: any = '', attempt: number = 0) {
    this.prompt = prompt;
    this.generating = true;
    // Gemini Client
    const genAI = new GoogleGenerativeAI(environment.ai.gemini.API_KEY);

    const generationConfig = {
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      maxOutputTokens: 100,
    };
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      ...generationConfig,
    });

    const result = await model.generateContent(this.prompt);

    const response = await result.response;
    console.log(response.candidates?.[0].content.parts[0].text);

    this.analysisResult =
      response.candidates?.[0].content.parts[0].text || response.text();

    /*this.analysisResult = await this.cleanJsonResponse(
      response.candidates?.[0].content.parts[0].text || response.text(),
    );

    if (this.analysisResult == null) {
      //Sometimes the json returns broken. Try three times before failing
      if (attempt < 3) {
        attempt++;
        this.TestGeminiPro(attempt);
        this.message = 'Hold on...';
      } else {
        this.message = 'Damn. Failed to generate this time. Try again?';
      }
    } else {
      this.generating = false;
    }*/
  }

  async cleanJsonResponse(response: any) {
    try {
      // Remove any extra quotes around the JSON
      let cleanedResponse = response.replace(/^"|"$/g, '');

      // Remove any unnecessary newlines and trim the string
      cleanedResponse = response.replace(/\n/g, '').trim();

      // Remove any leading and trailing quotes
      cleanedResponse = cleanedResponse.replace(/^"|"$/g, '');

      cleanedResponse = cleanedResponse.replace('```', '');

      // Parse the JSON to remove extra spaces

      let parsedJson = JSON.parse(cleanedResponse);
      //console.log(parsedJson);
      // Convert back to JSON string with standard formatting

      //return JSON.stringify(parsedJson);
      return parsedJson;
      //return cleanedResponse;
    } catch (error) {
      console.error('Invalid JSON response:', error);
      return null;
    }
  }
}
