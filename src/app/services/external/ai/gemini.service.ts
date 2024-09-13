import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AIGeminiService {
  public message: string = 'Generating';
  public generating: boolean = false;
  public generated: boolean = false;

  async useGeminiPro(
    input: any = '',
    format: string = 'text',
    attempt: number = 0,
  ) {
    const prompt = input;
    this.generating = true;
    this.generated = false;
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let res: any = '';

    //if (format == 'text')
    res = response.candidates?.[0].content.parts[0].text || response.text();

    /*if (format == 'json') {
      res = await this.cleanJsonResponse(
        response.candidates?.[0].content.parts[0].text || response.text(),
      );

      if (res == null) {
        //Sometimes the json returns broken. Try three times before failing
        if (attempt < 3) {
          attempt++;
          this.useGeminiPro(prompt, format, attempt);
          this.message = 'Hold on...';
        } else {
          this.message = 'AI failed. Try again?';
        }
      } else {
        this.generated = true;
        this.generating = false;
      }
    }*/

    //if (res == null)
    //res = response.candidates?.[0].content.parts[0].text || response.text();
    this.message = '';
    return res;
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
