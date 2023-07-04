import { Injectable, NgZone } from '@angular/core';
//import { User } from '../../../shared/user';
//import * as auth from 'firebase/auth';

import { environment } from '../../../../../environments/environment';
import { initializeApp } from 'firebase/app';
//import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = environment.firebase;

const app = initializeApp(firebaseConfig);

import { Router } from '@angular/router';
@Injectable({ 
  providedIn: 'root',
})
export class AuthCapacitorService {
constructor(
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {

 app

}
}



