import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

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
  async handlePayment(@Body() payment: RelarioPayPaymentNotification): Promise<void> {
    return this.payService.handlePaymentNotification(payment);
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
      countryCode: 'RO',
      city: 'Bucharest',
      ispName: 'Vodafone',
      mcc: '226',
      mnc: '01',
      mobileBrand: 'Vodafone',
      domainName: null,
      status: null,
      latitude: null,
      longitude: null,
      region: null,
    }
  }
}
