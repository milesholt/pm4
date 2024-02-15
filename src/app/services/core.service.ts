import { Injectable } from '@angular/core';
//import { Http, Headers } from "@angular/http";
//import { Observable } from 'rxjs/Rx';
//import { Definitions } from '../app.definitions';
//import { Library } from '../app.library';

import { Platform } from '@ionic/angular';

//connect to internal services
//import { ToastService } from './internal/ToastService/toast.service';
//import { ModalService } from './internal/ModalService/modal.service';
//import { NotificationService } from './internal/NotificationService/notification.service';

//connect to external services
import { AuthService } from './external/firebase/AuthService/auth.capacitor.service';
//import { UserService } from './external/firebase/UserService/user.service';
//import { DatabaseService } from './external/firebase/DatabaseService/database.service';
//import { NotificationServiceExt } from './external/firebase/NotificationService/notification.service';
//import { ShopService } from './external/printful/ShopService/shop.service';
import { ShopService } from './external/shopify/ShopService/shop.service';

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
    public shop: ShopService,
  ) {}
}

export {};
