import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AIAnalysisService {
  //private apiUrl = 'https://project-dues-server-python-f3sosw4zha-uc.a.run.app/';
  private apiUrl = 'https://project-deus-server-node-f3sosw4zha-uc.a.run.app/';

  constructor(private http: HttpClient) {}

  analyzeText(text: string): Observable<any> {
    console.log('analysing text');
    console.log(text);
    console.log(this.apiUrl);
    return this.http.post<any>(this.apiUrl, { text });
  }
}
