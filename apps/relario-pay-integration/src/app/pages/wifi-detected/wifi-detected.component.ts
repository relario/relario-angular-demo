import { Component, Injector, OnInit } from '@angular/core';
import { NETWORK_INFORMATION } from '../../services/network-information.token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wifi-detected',
  templateUrl: './wifi-detected.component.html',
  styleUrls: ['./wifi-detected.component.scss']
})
export class WifiDetectedComponent implements OnInit {
  private readonly networkConnectionType: NetworkInformation | null;

  constructor(private readonly injector: Injector,
              private readonly router: Router) {
    this.networkConnectionType = injector.get(NETWORK_INFORMATION);
  }

  ngOnInit(): void {
  }

  detectNetworkChange() {
    if (this.networkConnectionType && this.networkConnectionType.type && this.networkConnectionType.type !== 'cellular') {
      this.router.navigate(['wifi-detected']);
    } else {
      this.router.navigate(['detection']);
    }
  }
}
