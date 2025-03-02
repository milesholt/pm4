import { Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../../../services/external/firebase/AuthService/auth.service';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';
import { throwError } from 'rxjs';

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
  vendorId: string | null = null;
  siteId: string | null = null;
  routeParams: any;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private route: ActivatedRoute
  ) {
    // Get vendorId from route/query params
    this.route.queryParams.subscribe((params) => {
      this.routeParams = params;
      this.vendorId = params['vendorId'] || null;
      this.siteId = params['siteId'] || null;
    });
  }

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

          console.log(res);
          //this.navCtrl.navigateForward('/register');
          this.handleLogin(res);
        },
        (err: any) => {
          this.errorMessage = err.message;
        }
      );
    } else {
      // eval('this.service.auth.signInWith' + social + '()').then(
      //   (res: any) => {
      //     this.handleLogin(res);
      //   },
      //   (err: any) => {
      //     this.errorMessage = err.message;
      //   }
      // );

      await this.service.auth.signInWithGoogle().then(
        (res: any) => {
          console.log('result from Google Auth:');

          console.log(res);
          this.handleLogin(res);
        },
        (err: any) => {
          this.errorMessage = err.message;
        }
      );
    }
  }

  async handleLogin(res: any) {
    console.log('handle login:');
    console.log(res);

    const user = res.user;

    //Handle logged in user data here before directing
    //Check if new user, user permissions, if user verified
    //res.user.isEmailVerified
    //res.additionalUserInfo.isNewUser
    //const isNewUser = res.additionalUserInfo.isNewUser;

    // Check if vendorId is available
    if (this.vendorId) {
      // Path to the customers collection for this vendor and site
      const pathSegments = [
        'users',
        this.vendorId,
        'sites',
        this.siteId,
        'users',
      ];
      const pathSegments2 = ['users', this.vendorId, 'sites'];

      try {
        // Use Firestore service to check if user exists in the "customers" collection
        const userDoc = await this.service.firestore
          .getDocumentById(pathSegments, res.user.uid)
          .subscribe({
            next: async (userDoc) => {
              //userid exists in vendor's site
              //continue to vendor site or customer dashboard
              if (this.siteId) {
                //if navigating to vendor site
                const siteDoc = await this.service.firestore.getDocumentPromise(
                  ['users', this.vendorId, 'sites'],
                  this.siteId
                );

                /*if (siteDoc) {
                  const siteurl = ['brandbuilder'];
                  const queryParams = { site: siteDoc.publishId };
                  this.router.navigate(siteurl, { queryParams });
                }*/

                //if navigating to customer dashboard
                setTimeout(() => {
                  console.log('redirecting...');
                  const queryParams = {
                    publishSiteId: siteDoc.publishId,
                    siteId: this.siteId,
                    userId: res.user.uid,
                    vendorId: this.vendorId,
                  };
                  this.router.navigate(['users'], { queryParams });
                });
                //
              }
            },
            error: (error) => {
              //No user found here, or customers does not exist
              // Handle the case where the user is not found in the collection (new user)
              this.saveCustomerData(user.uid, user.displayName, user.email);
            },
          });
      } catch (error: any) {
        console.log('New user detected:', error.message);
        // Handle the case where the user is not found in the collection (new user)
        this.saveCustomerData(user.uid, user.displayName, user.email);
      }
    } else {
      //To do: timeout is needed otherwise the next time after logging in, it fails to navigate
      setTimeout(() => {
        console.log('redirecting...');
        this.router.navigate(['dashboard']);
      });
    }
  }

  private async saveCustomerData(
    userId: string,
    name: string | null,
    email: string | null
  ) {
    if (!this.vendorId) {
      console.error('Vendor ID is missing');
      return;
    }

    const customerData = {
      createdAt: new Date(),
      userId: userId,
      name: name,
      email: email,
      type: 'customer',
      group: 1,
    };

    this.service.firestore
      .createDocument(
        ['users', this.vendorId, 'sites', this.siteId, 'users'],
        customerData,
        userId
      )
      .then(() => {
        console.log('Customer data saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving customer data:', error);
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
