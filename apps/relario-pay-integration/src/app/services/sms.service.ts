import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CancelVerificationResponse, CheckResponse, VerificationResponse } from '@relario-pay/api-interfaces';

// import { CreateTransactionRequest } from '../../../../common/src';

export interface Transaction {
  transactionId: number;
  merchantId: number;
  productId: string;
  productName?: string;
  customerId: string;
  smsCount?: number;
  callDuration?: number;
  customerIpAddress: string;
  smsBody: string;
  iosClickToSmsUrl: string;
  androidClickToSmsUrl: string;
  phoneNumbersList: string[];
  payments: Payment[];
  createdAt: number;
}

export interface Payment {
  id: number;
  transactionId: number;
  cli: string;
  ddi: string;
  smsBody?: string;
  callDuration?: string;
  initiatedAt: number;
  ipnStatus: string;
}

export interface Location {
  city: string;
  countryCode: string;
  domainName: string;
  ispName: string;
  latitude: number;
  longitude: number;
  mcc: string;
  mnc: string;
  mobileBrand: string;
  region: string;
  status: string;
}


export interface CreateTransactionRequest {
  customerId: string;
  ipAddress: string;
  phoneNumber?: string;
}

@Injectable()
export class SmsService {

  private ipAddress = '';
  private location: Location | null = null;
  private requestId = '';

  constructor(private readonly http: HttpClient) {
  }

  get getLocation(): Location | null {
    return this.location;
  }

  createPaymentTransaction(data: CreateTransactionRequest): Observable<Transaction> {
    if (!data.ipAddress) {
      data.ipAddress = this.ipAddress;
    }
    return this.http.post<Transaction>(`${environment.apiUrl}/transactions`, data);
  }

  getPaymentTransaction(transactionid: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${environment.apiUrl}/transactions/${transactionid}`);
  }

  public getCountryAndCarrier(ip: string): Observable<Location> {
    return this.http.get<Location>(`${environment.apiUrl}/detect`, { params: { ip } }).pipe(tap(val => {
      this.location = val;
    }));
  }

  startVerification(phoneNumber: string): Observable<VerificationResponse> {
    return this.http.post<VerificationResponse>(`${environment.apiUrl}/verification`, { phoneNumber: phoneNumber }).pipe(tap(res => {
      if (res.request_id) {
        this.requestId = res.request_id;
        localStorage.setItem('requestId', this.requestId);
      }
    }));
  }

  checkVerification(requestId: string, code: string): Observable<CheckResponse> {
    return this.http.post<CheckResponse>(`${environment.apiUrl}/verification/check`, {requestId: requestId, code: code})
      .pipe(
        tap(res => {
          if (res.status === '0' || res.status === '17') {
            localStorage.removeItem('requestId');
          }
        })
      );
  }
  cancelVerification(requestId: string): Observable<CheckResponse> {
    const reqId = localStorage.getItem('requestId');
    if (reqId) {
      localStorage.removeItem('requestId');
    }
    return this.http.post<CancelVerificationResponse>(`${environment.apiUrl}/verification/cancel`, {requestId: requestId});
  }

  getSelfIpAddress(): Observable<string> {
    return this.http.get<{ ip: string }>(environment.ipDiscoverApiUrl)
      .pipe(
        map(r => {
          this.ipAddress = r.ip;
          return r.ip;
        })
      );
  }
}
