import { Injectable } from '@angular/core';

declare var gtag: any;

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  google: GoogleAdsService;
  constructor() {
    this.google = new GoogleAdsService();
  }
}

export class GoogleAdsService {
  constructor() {}

  sendConversionEvent(
    conversionId: string,
    conversionLabel: string,
    value: number = 1.0,
    currency: string = 'USD',
  ) {
    gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`,
      value: value,
      currency: currency,
    });
  }

  trackConversion(value: number = 1.0, currency: string = 'USD') {
    const conversionId = 'AW-16467533659'; // Replace with your Google Ads conversion ID
    const conversionLabel = '7N9OCIfQjZUZENu-qqw9'; // Replace with your Google Ads conversion label
    this.sendConversionEvent(conversionId, conversionLabel, value, currency);
  }
}
