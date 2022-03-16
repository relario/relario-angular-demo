import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Location, SmsService, Transaction } from '../../services/sms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mccMncList } from '../../services/mcc-mnc';
import { CountdownComponent, CountdownConfig, CountdownEvent, CountdownStatus } from 'ngx-countdown';


enum BtnText {
  next = 'Next',
  wait = 'Waiting'

}

@Component({
  selector: 'app-detection',
  templateUrl: './detection.component.html',
  styleUrls: ['./detection.component.scss']
})
export class DetectionComponent implements OnInit {

  private countdown: CountdownComponent | undefined;

  @ViewChild('cd', { static: false }) set countdownComponent(content: CountdownComponent) {
    if (content) {
      this.countdown = content;
    }
  }

  type: string = '';
  mccMncList = mccMncList;
  networks: string[] = [];
  countries: string[] = [];
  selectedNetwork: string = '-- Choose Network --';
  selectedCountry: string = '-- Choose Country --';
  connection: NetworkInformation;
  smsLink: string = '#';
  paymentConfirmed: boolean = false;
  transaction: Transaction | undefined;
  verificationTimeout: number = 0;
  monitorTimeout: number = 0;
  buttonText: BtnText = BtnText.next;
  buttonTextType = BtnText;
  countdownConfig: CountdownConfig = {
    demand: true,
    leftTime: 60,
    prettyText: (count) => {
      return `Waiting ${count} seconds`;
    },
    format: 's'
  };

  constructor(private readonly smsService: SmsService,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly changeDetectionRef: ChangeDetectorRef) {
    this.connection = window.navigator.connection;
    this.countries = Array.from(new Set(this.mccMncList.map(item => item.country)));
  }

  ngOnInit(): void {

    this.route.data.subscribe({
      next: res => {
        const network: Location = res['network'];
        if (network.status === 'found') {
          this.selectedCountry = this.mccMncList.find(item => item.iso.toLowerCase() === network.countryCode.toLowerCase())?.country ?? this.selectedCountry;
          this.setNetworks(this.selectedCountry);
          this.selectedNetwork = this.mccMncList.find(item => item.mcc === network.mcc && item.mnc === network.mnc)?.network ?? this.selectedNetwork;
        }
      },
      error: error => {
        console.log(error);
        this.router.navigate(['manual']);
      }
    });
  }


  selectCountry($event: Event) {
    this.setNetworks(($event.target as HTMLSelectElement).value);
  }

  setNetworks(country: string) {
    this.networks = Array.from(new Set(this.mccMncList.filter(item => item.country === country).map(item => item.network)));
  }

  createTransaction() {
    this.smsService.createPaymentTransaction({
      customerId: 'Auth OTP customer',
      ipAddress: ''
    }).subscribe(res => {
      localStorage.setItem('transactionId', res.transactionId.toString(10));
      this.smsLink = this.getClickToSmsUrl(['41766013200'], res.smsBody);
      // this.smsLink = this.getClickToSmsUrl(res.phoneNumbersList, res.smsBody);
      window.open(this.smsLink, '_blank');
      this.buttonText = BtnText.wait;
      this.changeDetectionRef.detectChanges();
      this.countdown?.begin();
      this.monitorTransaction(res.transactionId);
    });
  }

  async monitorTransaction(transactionId: number) {
    if (this.paymentConfirmed) {
      return;
    }

    try {
      this.transaction = await this.smsService.getPaymentTransaction(transactionId).toPromise();

      if (this.transaction?.smsCount === this.transaction?.payments.length) {
        // payment is complete
        this.confirmPayment();
      } else {
        this.monitorTimeout = setTimeout(() => {
          this.monitorTransaction(transactionId);
        }, 5000);

      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // wrong transaction
      console.log(e);
      localStorage.removeItem('transactionId');
    }
    return;
  }

  async confirmPayment() {
    this.paymentConfirmed = true;

    if (this.verificationTimeout) {
      clearTimeout(this.verificationTimeout);
    }
    localStorage.removeItem('transactionId');
    this.router.navigate(['number-verification'], {
      state: {
        mobileNumber: this.transaction?.payments[0].cli,
      }
    });

  }


  getClickToSmsUrl(ddis: string[], smsBody: string): string {
    const phoneNumbers = ddis.map(ddi => `+${ddi}`);

    // detect client OS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const text = encodeURIComponent('Please do not alter this message and press SEND ') + smsBody;
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    // @ts-ignore
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // use the iOS URL
      return this.generateIosClickToSmsUrl(phoneNumbers, text);
    } else {
      // use the Android URL
      return this.generateAndroidClickToSmsUrl(phoneNumbers, text);
    }
  }

  private generateIosClickToSmsUrl(phoneNumbers: string[], smsBody: string): string {
    return `sms://open?addresses=${phoneNumbers.join(',')};?&body=${smsBody}`;
  }

  private generateAndroidClickToSmsUrl(phoneNumbers: string[], smsBody: string): string {
    return `sms://${phoneNumbers.join(',')};?&body=${smsBody}`;
  }

  getSmsLink() {
    return this.smsLink;
  }

  handleCountdown($event: CountdownEvent) {
    if ($event.status === CountdownStatus.done) {
      this.paymentConfirmed = true;
      this.router.navigate(['number-verification']);
    }
  }
}
