export interface VerificationRequest {
  phoneNumber: string;
}

export interface VerificationResponse {
  request_id: string;
  status: string;
  error_text?: string;
}

export interface CancelVerificationRequest {
  request_id: string;
}

export type CancelVerificationResponse = VerificationResponse

export interface CheckRequest {
  request_id: string;
  code: string;
}

export type CheckResponse = VerificationResponse

export interface VonageError {
  status: string;
  error_text: string;
}



