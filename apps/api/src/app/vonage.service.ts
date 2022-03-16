import Vonage, { CheckResponse, ControlResponse, RequestResponse } from '@vonage/server-sdk';
import { environment } from '../environments/environment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VonageService {

  private vonage: Vonage;

  constructor() {
    this.vonage = new Vonage({
      apiKey: environment.vonageApiKey,
      apiSecret: environment.vonageApiSecret
    });
  }

  startVerification(phoneNumber: string): Promise<RequestResponse> {
    return new Promise((resolve, reject) => {

      this.vonage.verify.request({
        brand: 'Relario',
        number: phoneNumber,
      }, function (err, data) {
        console.log(err, data);
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }

  checkVerification(requestId: string, code: string): Promise<CheckResponse> {
    return new Promise((resolve, reject) => {
      this.vonage.verify.check({
        request_id: requestId,
        code,
      }, function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }

  cancelVerification(requestId: string): Promise<ControlResponse> {
    return new Promise((resolve, reject) => {
      this.vonage.verify.control({
        request_id: requestId,
        cmd: 'cancel'
      }, function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }
}
