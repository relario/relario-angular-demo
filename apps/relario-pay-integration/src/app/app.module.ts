import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetectionComponent } from './pages/detection/detection.component';
import { MainComponent } from './pages/main/main.component';
import { SmsService } from './services/sms.service';
import { ManualEntryComponent } from './pages/manual-entry/manual-entry.component';
import { WifiDetectedComponent } from './pages/wifi-detected/wifi-detected.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NetworkResolver } from './services/network.resolver';
import { NumberVerificationComponent } from './pages/number-verification/number-verification.component';
import { SuccessComponent } from './pages/success/success.component';
import { CodeVerificationComponent } from './pages/code-verification/code-verification.component';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [
    AppComponent,
    DetectionComponent,
    MainComponent,
    ManualEntryComponent,
    WifiDetectedComponent,
    NumberVerificationComponent,
    SuccessComponent,
    CodeVerificationComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    CountdownModule
  ],
  providers: [SmsService, NetworkResolver ],
  bootstrap: [AppComponent]
})
export class AppModule { }
