export {};

declare global {
  function getErrorMessage(error: unknown, fallbackMessage?: string): string;

  interface ApiError {
    response?: {
      status?: number;
      data?: {
        message?: string;
        creditsAvailable?: number;
        creditsRequired?: number;
        [key: string]: unknown;
      };
    };
    request?: unknown;
    code?: string;
    message?: string;
  }

  interface RazorpayErrorResponse {
    error: {
      code: string;
      description: string;
      source: string;
      step: string;
      reason: string;
      metadata: {
        order_id: string;
        payment_id: string;
      };
    };
  }
  interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: { name: string; email: string };
    theme: { color: string };
    handler: (response: RazorpayResponse) => void;
  }

  interface RazorpayInstance {
    open: () => void;
    on: (event: string, handler: (res: unknown) => void) => void;
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    google: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
        }
      }
    };
  }
}
