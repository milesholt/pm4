import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PexelsService {
  private apiKey = '1Buo0pShJwPYZfcVDAw0KhKSogTSwrrzwN8OfTakcAwd0hVpXHkBpnSs';
  private baseUrl = 'https://api.pexels.com/v1';

  constructor(private http: HttpClient) {}

  searchPhotos(query: string, perPage: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.apiKey,
    });

    return this.http.get(
      `${this.baseUrl}/search?query=${query}&per_page=${perPage}`,
      { headers },
    );
  }
}
