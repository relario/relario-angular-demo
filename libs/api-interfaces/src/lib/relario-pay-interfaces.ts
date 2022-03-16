export type RelarioPayPaymentType = 'sms' | 'voice';

export interface RelarioPayTransactionRequest {
  paymentType: RelarioPayPaymentType;
  customerId: string;
  productId: string;
  productName: string;
  smsCount?: number;
  callDuration?: number;
  customerIpAddress?: string;
  customerMsisdn?: string;
  customerMccmnc?: string;
}

export interface RelarioPayTransactionResponse {
  transactionId: string;
  merchantId: number;
  customerId: string;
  productId: string;
  productName: string;
  smsBody: string;
  iosClickToSmsUrl: string;
  androidClickToSmsUrl: string;
  clickToCallUrl: string;
  phoneNumbersList: string[];
  phoneNumber: string;
}

export interface RelarioPayPaymentNotification {
  paymentType: RelarioPayPaymentType;
  transactionId: string;
  paymentId: number;
  customerId: string;
  productId: string;
  productName: string;
  callDuration?: number;
  sourcePhoneNumber: string;
  destinationPhoneNumber: string;
  initiatedAt: Date;
}

export interface RelarioPayTransactionDetails {
  paymentType: RelarioPayPaymentType;
  transactionId: string;
  merchantId: number;
  customerId: string;
  productId: string;
  productName: string;
  smsCount: number;
  callDuration: number;
  smsBody: string;
  iosClickToSmsUrl: string;
  androidClickToSmsUrl: string;
  clickToCallUrl: string;
  phoneNumbersList: string[];
  phoneNumber: string;
  payments: RelarioPayPayment[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RelarioPayPayment {
  id: string;
  transactionId: string;
  callDuration?: number;
  smsBody: string;
  cli: string;
  ddi: string;
  initiatedAt: Date;
  billable: boolean;
}

