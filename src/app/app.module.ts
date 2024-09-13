import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
//This had no effect and only works in child component and module
//import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Library } from './app.library';

// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

//Auth service
import { AuthService } from './services/external/firebase/AuthService/auth.capacitor.service';

//Cart
import { CartShopModule } from './pages/shop/cart/cart.shop.module';
import { QuantityShopModule } from './pages/shop/cart/components/quantity/quantity.shop.module';

import { FooterModule } from './pages/components/footer/footer.module';

//Error Handling
import { GlobalErrorHandler } from './error-handling';

//Pipes
//import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
//import { FormatPipe } from './pipes/format.pipe';

@NgModule({
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    CartShopModule,
    FooterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //QuantityShopModule,
    //SafeHtmlPipe,
  ],
  providers: [
    Library,
    AuthService,
    Meta,
    Title,
    CookieService,
    //FormatPipe,
    //SafeHtmlPipe,
    { provide: ErrorHandler, useClass: GlobalErrorHandler},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
