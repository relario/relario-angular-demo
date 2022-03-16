import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-number-verification',
  templateUrl: './number-verification.component.html',
  styleUrls: ['./number-verification.component.scss']
})
export class NumberVerificationComponent implements OnInit {

  mobileNumber: string = '';

  constructor(private readonly router: Router) {
    this.mobileNumber = this.router.getCurrentNavigation()?.extras?.state?.['mobileNumber'];
  }

  ngOnInit(): void {

  }

}
