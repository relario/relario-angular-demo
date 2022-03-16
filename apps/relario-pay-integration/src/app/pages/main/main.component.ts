import { Component, Injector, OnInit } from '@angular/core';
import { NETWORK_INFORMATION } from '../../services/network-information.token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private readonly networkConnectionType: NetworkInformation | null;

  constructor(private readonly injector: Injector,
              private readonly router: Router) {
    this.networkConnectionType = injector.get(NETWORK_INFORMATION);
  }

  ngOnInit(): void {
  }

  detectNetwork() {
    if (this.networkConnectionType && this.networkConnectionType.type && this.networkConnectionType.type !== 'cellular') {
      this.router.navigate(['wifi-detected']);
    } else {
      this.router.navigate(['detection']);
    }
  }
}
