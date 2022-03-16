import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { DetectionComponent } from './pages/detection/detection.component';
import { ManualEntryComponent } from './pages/manual-entry/manual-entry.component';
import { WifiDetectedComponent } from './pages/wifi-detected/wifi-detected.component';
import { NetworkResolver } from './services/network.resolver';
import { NumberVerificationComponent } from './pages/number-verification/number-verification.component';
import { SuccessComponent } from './pages/success/success.component';
import { CodeVerificationComponent } from './pages/code-verification/code-verification.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'detection',
    component: DetectionComponent,
    resolve: {
      network: NetworkResolver
    }
  },
  {
    path: 'manual',
    component: ManualEntryComponent,
    resolve: {
      network: NetworkResolver
    }
  },
  {
    path: 'code-verification',
    component: CodeVerificationComponent
  },
  {
    path: 'wifi-detected',
    component: WifiDetectedComponent
  },
  {
    path: 'number-verification',
    component: NumberVerificationComponent
  },
  {
    path: 'success',
    component: SuccessComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
