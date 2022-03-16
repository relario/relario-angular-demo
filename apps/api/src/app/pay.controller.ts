import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';

import {
  CancelVerificationRequest, CancelVerificationResponse,
  CheckRequest,
  CheckResponse,
  CreateTransaction, Location, RelarioPayPaymentNotification,
  RelarioPayTransactionDetails,
  RelarioPayTransactionResponse, VerificationRequest, VerificationResponse
} from '@relario-pay/api-interfaces';

import { PayService } from './pay.service';
import { VonageService } from './vonage.service';
import { environment } from '../environments/environment';
import { Request } from 'express';
import { createHmac } from 'crypto';

@Controller()
export class PayController {
  constructor(private readonly payService: PayService,
              private readonly vonageService: VonageService) {
  }

  @Post('transactions')
  async createTransaction(@Body() newTransaction: CreateTransaction): Promise<RelarioPayTransactionResponse> {
    return this.payService.createTransaction(newTransaction.ipAddress);
  }

  @Get('transactions/:id')
  async getTransaction(@Param('id') id: string): Promise<RelarioPayTransactionDetails> {
    return this.payService.getTransactionDetails(id);
  }

  @Post('transactions/webhook')
  async handlePayment(@Body() payment: RelarioPayPaymentNotification, @Req() request: Request): Promise<void> {
    // Fist we check HMAC

    // depending on the framework you use, extract the "Payment-Signature" HTTP header // #TODO change the next line accordingly
    const signature = request.header("Payment-Signature");
    // get your Merchant API key from your relario PAY account
    // #TODO change the next line accordingly
    const merchantApiKey = environment.relarioApikey;
    // depending on the framework you use, get the HTTP request body
    // #TODO change the next line accordingly
    const data = request.body;
    // generate the HMAC signature of the HTTP request body to authorize the request
    const generatedHmac = this.generateHmac(data, merchantApiKey);
    // check if the Payment Signature and the generated HMAC match
    if (signature === generatedHmac) {
      // the request is OK; this is a successful payment
      console.log(`Payment info: ${JSON.stringify(data)}`);
      // do what you need with the payment info (data)
      this.payService.handlePaymentNotification(payment);

      // ...
    } else {
      // the request is BAD
      // it may be an attempted fraud, so you should ignore it
      console.log("Attempted fraud!");
      throw new BadRequestException("Payment invalid");
    }
  }

  @Post('verification')
  async startVonageVerification(@Body() request: VerificationRequest): Promise<VerificationResponse> {
    if (!environment.vonageEnabled || !request.phoneNumber) {
      return Promise.resolve({
        status: '-1',
        error_text: 'Verification disabled',
        request_id: null
      });
    }
    return this.vonageService.startVerification(request.phoneNumber)
  }

  @Post('verification/check')
  async checkVonageVerification(@Body() request: CheckRequest): Promise<CheckResponse> {
    if (!environment.vonageEnabled) {
      return Promise.resolve({
        status: '-1',
        error_text: 'Verification disabled',
        request_id: null
      });
    }
    if (!request.request_id || request.code) {
      throw new BadRequestException("Invalid Request");
    }
    return this.vonageService.checkVerification(request.request_id, request.code);
  }

  @Post('verification/cancel')
  async cancelVonageVerification(@Body() request: CancelVerificationRequest): Promise<CancelVerificationResponse> {
    if (!environment.vonageEnabled) {
      return Promise.resolve({
        status: '-1',
        error_text: 'Verification disabled',
        request_id: null
      });
    }
    if (!request.request_id) {
      throw new BadRequestException("Invalid Request");
    }
    const result = await this.vonageService.cancelVerification(request.request_id);
    return {
      ...result,
      request_id: request.request_id
    }
  }

  @Get('detect')
  detectCountryAndCarrier(@Query('ip') ipAddress: string): Location {
    // You can use a service which detects the MCCMNC based on IP Address, for example Ip2Location.
    // Not required, this is just to showcase the full demo application.
    return {
      status: "found",
      countryCode: "RO",
      region: "Bucuresti",
      city: "Bucharest",
      latitude: 44.43225,
      longitude: 26.10626,
      ispName: "RCS & RDS S.A.",
      domainName: "rcs-rds.ro",
      mcc: "226",
      mnc: "05",
      mobileBrand: "Digi.Mobil"
    }
  }


  generateHmac(requestData, merchantApiKey) {
    const hmac = createHmac("sha256", merchantApiKey);
    // remove undefined properties
    let hmacInput = JSON.parse(JSON.stringify(requestData));
    // convert object to array ordered by keys
    hmacInput = Object.entries(hmacInput).sort((a, b) => {
      return a[0] < b[0] ? -1 : 1;
    });
    hmac.update(JSON.stringify(hmacInput));
    return hmac.digest("base64");
  }

}
