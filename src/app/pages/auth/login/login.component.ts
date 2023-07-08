import { Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../../../services/external/firebase/AuthService/auth.service';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class LoginComponent implements OnInit {
  user: any;
  signedIn: any;
  greeting: string = '';
  loginForm: any;
  errorMessage: string = '';

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  registerAccount() {
    this.navCtrl.navigateForward('/register');
  }

  async emailLogin(fields: any) {
    await this.service.auth
      .signInWithEmailPassword(fields.email, fields.password)
      .then(
        (res: any) => {
          this.handleLogin(res);
        },
        (err: any) => {
          console.log(err);
          this.errorMessage = err.message;
        }
      );
  }

  async socialLogin(social: string = '') {
    if (social == 'Facebook') {
      await this.service.auth.signInWithFacebook().then(
        (res: any) => {
          console.log('result from Facebook Auth:');
          setTimeout(() => {
            console.log(res);
            this.handleLogin(res);
          });
        },
        (err: any) => {
          this.errorMessage = err.message;
        }
      );
    } else {
      eval('this.service.auth.signInWith' + social + '()').then(
        (res: any) => {
          this.handleLogin(res);
        },
        (err: any) => {
          this.errorMessage = err.message;
        }
      );
    }
  }

  handleLogin(res: any) {
    console.log('handle login:');
    console.log(res);
    //Handle logged in user data here before directing
    //Check if new user, user permissions, if user verified
    //res.user.isEmailVerified
    //res.additionalUserInfo.isNewUser

    //To do: timeout is needed otherwise the next time after logging in, it fails to navigate
    setTimeout(() => {
      //this.router.navigate(['dashboard']);
    });
  }
}

/*

import { forwardRef, Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  providers: [CoreService, Library]
})
export class AuthLoginPage {

  user:any;
  signedIn:any;
  greeting:string;
  loginForm: any;
  errorMessage: string = '';

  constructor(
    public navCtrl: NavController,
    public service: CoreService,
    public formBuilder: FormBuilder
  ) {}

   ngOnInit() {
     this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
     });
  }

  registerAccount(){
     this.navCtrl.navigateForward('/register');
  }

  tryLogin(value){
    this.service.auth.doLogin(value)
    .then(res => {
      console.log(res);
      this.navCtrl.navigateForward('/dashboard');
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    })
  }

  socialLogin(social){
    eval('this.service.auth.do' + social + 'Login()')
    .then((res) => {
      console.log('logged in');
      this.navCtrl.navigateForward('/dashboard');
    }, (err) => {
      this.errorMessage = err.message;
    });
  }


}

*/
