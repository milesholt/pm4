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

  trackConversion(value: number = 1.0, currency: string = 'USD', type: string) {
    const conversionId = 'AW-16467533659'; // Replace with your Google Ads conversion ID
    let conversionLabel : string | boolean = false; 
    
    switch(type){
      case 'paymentinfo':
        conversionLabel = '7N9OCIfQjZUZENu-qqw9';
      break;
      case 'purchase':
        conversionLabel = 'KjRqCPXPjZUZENu-qqw9';
      break;
      case 'addtocart':
        conversionLabel = 'o4bsCIHQjZUZENu-qqw9';
      break;
      case 'checkout':
        conversionLabel = '0IQXCITQjZUZENu-qqw9';
      break;      
    }

    if(!!conversionLabel) 
      this.sendConversionEvent(conversionId, conversionLabel, value, currency);
  }
}
