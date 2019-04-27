import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  AngularFireModule,
  FirebaseOptionsToken,
  FirebaseNameOrConfigToken
} from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {
  RECAPTCHA_SETTINGS,
  RecaptchaModule,
  RecaptchaSettings
} from 'ng-recaptcha';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyMissingTranslationHandler } from './missing-translation-handler';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegisterComponent } from './register/register.component';
import { TrackingDetailsComponent } from './tracking-details/tracking-details.component';
import { TrackingComponent } from './tracking/tracking.component';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const HttpLoaderFactory = (http: HttpClient) => {
  return new TranslateHttpLoader(http);
};

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RecaptchaModule.forRoot(),
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: MissingTranslationHandler,
      useClass: MyMissingTranslationHandler
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LeBklcUAAAAAD2O6oZL2uNDr-SipCvbAm367cbP',
        size: 'invisible'
      } as RecaptchaSettings
    },
    {
      provide: FirebaseOptionsToken,
      useValue: {
        apiKey: 'AIzaSyA2XjDo9d6Kx56_cRb8xAXVgoqDEACeSTA',
        authDomain: 'ananday-donation.firebaseapp.com',
        databaseURL: 'https://ananday-donation.firebaseio.com',
        projectId: 'ananday-donation',
        storageBucket: 'ananday-donation.appspot.com',
        messagingSenderId: '361968678369'
      }
    },
    {
      provide: FirebaseNameOrConfigToken,
      useValue: '[DEFAULT]'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
