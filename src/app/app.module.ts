import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {
  RECAPTCHA_SETTINGS,
  RecaptchaModule,
  RecaptchaSettings
} from './ng-recaptcha';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegisterComponent } from './register/register.component';
import { TrackingDetailsComponent } from './tracking-details/tracking-details.component';
import { TrackingComponent } from './tracking/tracking.component';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoRootModule } from './transloco-root.module';

@NgModule({
  declarations: [
    AppComponent,
    TrackingComponent,
    RegisterComponent,
    RecoveryComponent,
    TrackingDetailsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RecaptchaModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyA2XjDo9d6Kx56_cRb8xAXVgoqDEACeSTA',
      authDomain: 'ananday-donation.firebaseapp.com',
      databaseURL: 'https://ananday-donation.firebaseio.com',
      projectId: 'ananday-donation',
      storageBucket: 'ananday-donation.appspot.com',
      messagingSenderId: '361968678369'
    }),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    TranslocoRootModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LeBklcUAAAAAD2O6oZL2uNDr-SipCvbAm367cbP',
        size: 'invisible'
      } as RecaptchaSettings
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
