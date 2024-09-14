import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { loadGapiInsideDOM } from 'gapi-script';

import { environment } from 'src/environments/environment';

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {
  private CLIENT_ID = environment.google.drive.web.client_id;
  private API_KEY = environment.google.apiKey;
  private DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  ];
  private SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

  private gapiLoaded$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadGapi();
  }

  private loadGapi(): void {
    loadGapiInsideDOM().then(() => {
      gapi.load('client:auth2', () => {
        gapi.client
          .init({
            apiKey: this.API_KEY,
            clientId: this.CLIENT_ID,
            discoveryDocs: this.DISCOVERY_DOCS,
            scope: this.SCOPES,
          })
          .then(() => {
            this.gapiLoaded$.next(true);
          });
      });
    });
  }

  login() {
    return gapi.auth2.getAuthInstance().signIn();
  }

  logout() {
    return gapi.auth2.getAuthInstance().signOut();
  }

  isSignedIn() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  listImages() {
    return gapi.client.drive.files.list({
      q: "mimeType contains 'image/'",
      fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
    });
  }
}
