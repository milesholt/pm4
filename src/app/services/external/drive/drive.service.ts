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

  public gapiLoaded$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadGapiClient();
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

  private loadGapiClient() {
    // Load gapi client
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => this.initializeGapiClient();
    document.body.appendChild(script);
  }

  public initializeGapiClient() {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: this.API_KEY,
          clientId: this.CLIENT_ID,
          discoveryDocs: this.DISCOVERY_DOCS,
          scope: this.SCOPES,
        })
        .then(() => {
          console.log('GAPI client initialized');
          this.gapiLoaded$.next(true);
        })
        .catch((error: any) => {
          console.error('Error initializing GAPI client', error);
          this.gapiLoaded$.next(false);
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

  listFiles(folderId: string = 'root') {
    return gapi.client.drive.files.list({
      q: `'${folderId}' in parents and trashed = false`, // List files in a folder
      fields: 'files(id, name, mimeType, parents)', // Fetch only necessary fields
      pageSize: 100, // You can adjust this for pagination if needed
    });
  }

  listImages() {
    return gapi.client.drive.files.list({
      q: "mimeType contains 'image/'",
      fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
    });
  }

  listFileContent(fileId: string) {
    return gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media',
    });
  }
}
