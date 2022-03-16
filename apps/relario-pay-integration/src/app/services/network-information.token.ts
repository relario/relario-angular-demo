import { InjectionToken } from '@angular/core';

export const NETWORK_INFORMATION: InjectionToken<NetworkInformation | null> = new InjectionToken('Network Information API', {
  factory: () => {
    if (window?.navigator?.connection) {
      return window.navigator.connection;
    }
    return null;
  },
  providedIn: 'root'
});
