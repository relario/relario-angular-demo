import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { mccMncList } from '../../services/mcc-mnc';
import { Location, SmsService } from '../../services/sms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CountdownComponent, CountdownConfig, CountdownEvent, CountdownStatus } from 'ngx-countdown';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss']
})
export class ManualEntryComponent implements OnInit {

  private countdown: CountdownComponent | undefined;

  @ViewChild('cd', { static: false }) set countdownComponent(content: CountdownComponent) {
    if (content) {
      this.countdown = content;
    }
  }

  countDownConfig: CountdownConfig = {
    demand: true,
    // format: 'mm:ss',
  };
  countryCodes: string[];
  selectedCountryCode: string = '';
  mccMncList = mccMncList;
  phoneNumber: string = '';
  error: string = '';
  timer: number = 0;
  disableBtn: boolean = false;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly smsService: SmsService,
              private readonly changeDetector : ChangeDetectorRef) {
    this.countryCodes = Array.from(new Set(this.mccMncList.map(item => item.country_code)));
    this.error = this.router.getCurrentNavigation()?.extras?.state?.['error'];
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: res => {
        const network: Location = res['network'];
        if (network.status === 'found') {
          this.selectedCountryCode = this.mccMncList.find(item => item.mcc === network.mcc && item.mnc === network.mnc)?.country_code ?? this.selectedCountryCode;
        }
      },
      error: error => {
        console.log(error);
        // this.router.navigate(['manual']);
      }
    });
  }

  countryCodeChange($event: Event) {
    const value = ($event.target as HTMLSelectElement).value;
  }


  submitForm() {
    this.error = '';
    this.smsService.startVerification(this.selectedCountryCode + this.phoneNumber)
      .subscribe({
        next: (value) => {
          switch (value.status) {
            case '0':
              this.router.navigate(['code-verification'], {
                state: {
                  requestId: value,
                }
              });
              break;
            case '3':
              this.error = 'Invalid Phone number';
              break;
            case '7':
              this.error = 'The phone number provided is blacklisted';
              break;
            case '10':
              this.error = 'There is already a verification in process';
              break;
            case '15':
              this.error = 'The phone number is in unsupported network';
              break;
            default:
              this.error = '';
              this.router.navigate(['success'], {
                state: {
                  requestId: value,
                }
              });
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 429) {
            const timeLeft = err.headers.get('x-ratelimit-reset');
            this.timer = parseInt(timeLeft ?? '0', 10);
            this.disableBtn = true;
            this.countDownConfig = {
              demand: true,
              format: 's',
              leftTime: this.timer,
              prettyText: text => {
                return 'Please retry in ' + text + ' seconds';
              }
            };
            this.changeDetector.detectChanges();
            this.countdown?.begin();
          }
        }
      });

  }

  handleZero($event: CountdownEvent) {
    if ($event.status === CountdownStatus.done) {
      this.timer = 0;
      this.disableBtn = false;
    }
  }
}
