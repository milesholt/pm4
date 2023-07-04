import { Injectable, NgZone } from '@angular/core';
//import { User } from '../../../shared/user';
//import * as auth from 'firebase/auth';

import { environment } from '../../../../../environments/environment';
import { initializeApp, getApp } from 'firebase/app';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
//import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration

import { Capacitor } from '@capacitor/core';

import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  //OAuthProvider,
  //PhoneAuthProvider,
  signInWithCredential,
  //EmailAuthProvider,
  signOut,
} from 'firebase/auth';


import { Router } from '@angular/router';
@Injectable({ 
  providedIn: 'root',
})
export class AuthCapacitorService {
constructor(
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
	const firebaseConfig = environment.firebase;
	initializeApp(firebaseConfig);
  }

	async getFirebaseAuth(){
  		if (Capacitor.isNativePlatform()) {
    		return initializeAuth(getApp(), {
      			persistence: indexedDBLocalPersistence,
    		});
  		} else {
    		return getAuth();
  		}
	};


async signInWithFacebook() {
  // 1. Create credentials on the native layer
  const result = await FirebaseAuthentication.signInWithFacebook();
  // 2. Sign in on the web layer using the access token
  const credential = FacebookAuthProvider.credential(
    result.credential?.accessToken,
  );
  const auth = getAuth();
  await signInWithCredential(auth, credential);
};

async signInWithGoogle() {
  // 1. Create credentials on the native layer
  const result = await FirebaseAuthentication.signInWithGoogle();
  // 2. Sign in on the web layer using the id token
  const credential = GoogleAuthProvider.credential(result.credential?.idToken);
  const auth = getAuth();
  await signInWithCredential(auth, credential);
};

async signOut() {
  // 1. Sign out on the native layer
  await FirebaseAuthentication.signOut();
  // 1. Sign out on the web layer
  const auth = getAuth();
  await signOut(auth);
};



}



