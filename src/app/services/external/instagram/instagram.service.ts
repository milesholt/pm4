import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstagramService {
  //private backendURL = 'http://localhost:3000/instagram';
  private baseUrl = 'https://siteinanhour.com/server/instagram2.php';

  constructor(private http: HttpClient) {}

  getImages(username: string): Observable<any> {
    console.log('Getting insta images from backend');
    //return this.http.get<string[]>(`${this.backendURL}?username=${username}`);

    /*this.http.get(`${this.baseUrl}?username=${username}`).subscribe(
      (res) => {
        // handle the response here
        console.log(res);
      },
      (err) => {
        // handle the error here
        console.error(err);
      }
    );*/

    return this.http.get(`${this.baseUrl}?username=${username}`);
  }
}
