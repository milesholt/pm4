import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../../internal/HttpService/http.service';

@Injectable({
  providedIn: 'root',
})
export class CloudflareService {
  //private apiToken = 'sW3mbwWuYWqu6yOsLnWuQgC1EOe9NksZCirACGvd';
  private apiToken = '123fd3092355aaee81d5fe3a98ea70553c25a';
  private zoneId = 'f8e2215081373eadbb9cbbedc9f1e5a4';
  private baseUrl = 'https://api.cloudflare.com/client/v4/zones/' + this.zoneId;
  private email = 'contact@milesholt.co.uk';

  private serverUrl = 'https://siteinanhour.com/server/cloudflare.php';

  constructor(private http: HttpService) {}

  createHostname(data: any): Observable<any> {
    return this.http.post(this.serverUrl, data);
  }

  createHostnameOff(hostname: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const url = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/custom_hostnames`;

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Email': this.email,
          'X-Auth-Key': this.apiToken,
        },
        body: JSON.stringify({
          hostname: hostname,
          ssl: {
            method: 'http', // Use HTTP validation for SSL
            type: 'dv', // Use Domain Validation
          },
        }),
      };

      fetch(url, options)
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            console.log('Custom hostname created successfully.');
            console.log(response);
            resolve(response);
          } else {
            console.error('Failed to create custom hostname.');
            console.error(response);
            reject(response);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          reject(error);
        });
    });
  }
}
