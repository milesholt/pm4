import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getTest(url: string, params: any) {
    return this.http.get(url, params);
  }

  post(url: string, data: any): Observable<any> {
    return this.http.post<any>(url, data);
  }

  getJSON(path:string): Observable<any> {
    return this.http.get(path);
  }
}
