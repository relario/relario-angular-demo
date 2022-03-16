import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Location, SmsService } from './sms.service';
import { Observable } from 'rxjs';

@Injectable()
export class NetworkResolver implements Resolve<Location> {
  constructor(private readonly smsService: SmsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Location> {
    return this.smsService.getSelfIpAddress().pipe(switchMap(res => {
      return this.smsService.getCountryAndCarrier(res);
    }));
  }

}
