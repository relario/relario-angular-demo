import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SmsService } from '../../services/sms.service';

@Component({
  selector: 'app-code-verification',
  templateUrl: './code-verification.component.html',
  styleUrls: ['./code-verification.component.scss']
})
export class CodeVerificationComponent implements OnInit {

  code: string = '';
  invalidCode: boolean = false;
  errorMessage = 'Invalid Code';

  constructor(private readonly router: Router,
              private readonly smsService: SmsService) {
  }

  ngOnInit(): void {
  }

  submitForm() {
    this.invalidCode = false;
    const requestId = localStorage.getItem('requestId');
    if (!requestId) {
      return;
    }
    this.smsService.checkVerification(requestId, this.code)
      .subscribe({
        next: value => {
          if (value.status === '0') {
            this.router.navigate(['success']);
          } else {
            this.invalidCode = true;
            if (value.status === '17') {
              this.errorMessage = 'Verification failed. Redirecting to number verification...';
              setTimeout(() => {
                this.router.navigate(['manual'], {
                  state: {
                    error: 'Please retry the verification process'
                  }
                });
              }, 2000);
            }
          }

          console.log(value);
        }
      });
  }
}
