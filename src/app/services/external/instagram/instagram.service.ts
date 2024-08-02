import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstagramService {

  private instagramURL = 'https://www.instagram.com';

  constructor(private http: HttpClient) { }

  getImages(username: string, count: number = 5): Observable<string[]> {
    return this.http.get<any>(`${this.instagramURL}/${username}/?__a=1`).pipe(
      map(response => {
        const posts = response.graphql.user.edge_owner_to_timeline_media.edges;
        return posts.slice(0, count).map((post:any) => post.node.display_url);
      })
    );
  }
}
