import { Injectable } from '@angular/core';
//import { Http, Headers } from "@angular/http";
import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs/Rx';
//import { Definitions } from '../app.definitions';
//import { Library } from '../app.library';

import { Platform } from '@ionic/angular';

//connect to internal services
import { HttpService } from './internal/HttpService/http.service';
//import { ToastService } from './internal/ToastService/toast.service';
//import { ModalService } from './internal/ModalService/modal.service';
//import { NotificationService } from './internal/NotificationService/notification.service';

//connect to external services
import { AuthService } from './external/firebase/AuthService/auth.capacitor.service';
import { FirestoreService } from './external/firebase/FireStoreService/firestore.service';
//import { UserService } from './external/firebase/UserService/user.service';
//import { DatabaseService } from './external/firebase/DatabaseService/database.service';
//import { NotificationServiceExt } from './external/firebase/NotificationService/notification.service';
//import { ShopService } from './external/printful/ShopService/shop.service';
import { ShopService } from './external/shopify/ShopService/shop.service';

import { SeoService } from './internal/SeoService/seo.service';
import { AdsService } from './internal/AdsService/ads.service';

import { AIAnalysisService } from './external/ai/analysis.service';
import { AIGeminiService } from './external/ai/gemini.service';
import { PexelsService } from './external/pexels/pexels.service';
import { InstagramService } from './external/instagram/instagram.service';
import { StripeService } from './external/stripe/stripe.service';

/*
@Injectable()
export class CoreService {

  constructor(private platform: Platform, public lib: Library, public db: DatabaseService, public auth: AuthService, public user: UserService, public notification: NotificationService, public notificationExt : NotificationServiceExt, public toast: ToastService, public modal:ModalService){
  }

  //return definitions
  getDefinitions(){
  	 return Definitions;
  }

}

export { ModalService }
*/

@Injectable()
export class CoreService {
  constructor(
    public auth: AuthService,
    public firestore: FirestoreService,
    public shop: ShopService,
    public http: HttpService,
    public seo: SeoService,
    public ads: AdsService,
    public ai: AIGeminiService,
    public pexels: PexelsService,
    public instagram: InstagramService,
    public stripe: StripeService
  ) {}
}

export {};
//
