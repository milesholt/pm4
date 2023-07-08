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
    this.runAuth();
  }

  async runAuth() {
    //Initialise firebase app with config
    const firebaseConfig = environment.firebase;
    initializeApp(firebaseConfig);

    //Initialise firebase auth service, detect if native or not using capacitor check
    const auth = await this.getFirebaseAuth();

    //After device check and auth initialised, check for user using authState
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        //If user is logged in, add to localStorage (this might already be done by Capacitor)
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        //Otherwise clear userData
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  //makes sure user is signed in next time app is run
  async getFirebaseAuth() {
    if (Capacitor.isNativePlatform()) {
      return initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence,
      });
    } else {
      return getAuth();
    }
  }

  async signInWithEmailPassword(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      const auth = getAuth();
      const options = { email: email, password: password };
      FirebaseAuthentication.signInWithEmailAndPassword(options)
        .then((userCredential) => {
          // Signed in
          //const user = userCredential.user;
          this.setUserData(userCredential.user);
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
    const result: any = await FirebaseAuthentication.signInWithFacebook();
    //const res: any = result !== undefined ? result : '';
    // 2. Sign in on the web layer using the access token
    const credential = FacebookAuthProvider.credential(
      result.credential?.accessToken
    );
    const auth = getAuth();
    await signInWithCredential(auth, credential)
      .then((userCredential) => {
        return userCredential;
      })
      .catch((error) => {
        return error;
      });
  }

  async signInWithGoogle() {
    // 1. Create credentials on the native layer
    const result = await FirebaseAuthentication.signInWithGoogle();
    // 2. Sign in on the web layer using the id token
    const credential = GoogleAuthProvider.credential(
      result.credential?.idToken
    );
    const auth = getAuth();
    await signInWithCredential(auth, credential)
      .then((userCredential) => {
        return userCredential;
      })
      .catch((error) => {
        return error;
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any) {
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

  // Sign up with email/password
  async signUp(email: string, password: string) {
    const options = { email: email, password: password };
    return await FirebaseAuthentication.createUserWithEmailAndPassword(options)
      .then((result) => {
        this.sendVerificationMail();
        this.setUserData(result.user);
      })
      .catch((error: any) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  async sendVerificationMail() {
    return await FirebaseAuthentication.getCurrentUser()
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
      });
  }

  // Reset Forggot password
  async forgotPassword(passwordResetEmail: string) {
    const options = { email: passwordResetEmail };
    return FirebaseAuthentication.sendPasswordResetEmail(options)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  async SignOut() {
    console.log('signing out');
    // 1. Sign out on the native layer
    await FirebaseAuthentication.signOut();
    // 1. Sign out on the web layer
    const auth = getAuth();
    await signOut(auth);
  }
}
