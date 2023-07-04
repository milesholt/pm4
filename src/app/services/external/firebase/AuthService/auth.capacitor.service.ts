import { Injectable, NgZone } from '@angular/core';
import { User } from '../../../shared/user';
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
  signInWithEmailAndPassword,
  //EmailAuthProvider,
  signOut,
} from 'firebase/auth';


import { Router } from '@angular/router';
@Injectable({ 
  providedIn: 'root',
})
export class AuthService {
userData: any; // Save logged in user data
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


async signInWithEmailPassword(email:string,password:string){
	return new Promise<any>((resolve,reject) => {
		const auth = getAuth();
		const options = { email : email, password: password }
		await FirebaseAuthentication.signInWithEmailAndPassword(options)
  		.then((userCredential) => {
    	// Signed in 
    	//const user = userCredential.user;
    	this.SetUserData(userCredential.user);
    		resolve(userCredential);
    	// ...
  		})
  		.catch((error) => {
    		//const errorCode = error.code;
    		//const errorMessage = error.message;
    		reject(error);
  		});
	});
}

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

/* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    /*const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );*/
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    /*return userRef.set(userData, {
      merge: true,
    });*/
  }

async signOut() {
  // 1. Sign out on the native layer
  await FirebaseAuthentication.signOut();
  // 1. Sign out on the web layer
  const auth = getAuth();
  await signOut(auth);
};



}



