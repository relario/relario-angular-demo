import { Injectable } from '@nestjs/common';
import { HttpService} from '@nestjs/axios'
import {
  RelarioPayPaymentNotification,
  RelarioPayTransactionDetails,
  RelarioPayTransactionRequest,
  RelarioPayTransactionResponse
} from '@relario-pay/api-interfaces';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PayService {

  private transactions = {};

  constructor(private readonly http: HttpService) {

  }


  handlePaymentNotification(payment: RelarioPayPaymentNotification): void {
    console.log(payment);
  }

  async createTransaction(ipAddress: string): Promise<RelarioPayTransactionResponse> {
    const transaction: RelarioPayTransactionRequest = {
      customerId: 'randomId',
      productId: 'Auth OTP',
      productName: 'Auth OTP',
      smsCount: 1,
      paymentType: 'sms',
      customerIpAddress: ipAddress
    }
    const transactionResult = await lastValueFrom(this.http.post<RelarioPayTransactionResponse>(`${environment.relarioApiUrl}/transactions`, transaction))

    this.transactions[transactionResult.data.transactionId] = transactionResult.data;
    return transactionResult.data;
  }

  async getTransactionDetails(transactionId: string): Promise<RelarioPayTransactionDetails> {
    const result = await lastValueFrom(this.http.get<RelarioPayTransactionDetails>(`${environment.relarioApiUrl}/transactions/${transactionId}`));
    return result.data;
  }
}
