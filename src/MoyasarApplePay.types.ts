export type onApplePayModalStatusChangedPayload = {
  value: "open" | "close";
};

export type OnApplePayCompletedPayload = {
  status: "paid" | "failed" | "error";
  source: "moyasar" | "local";
  moyasarPaymentID: string;
  amount: number;
  errorDescription?: string;
};

export type SummaryItem = {
  itemTitle: string;
  itemAmount: number;
};

export type ApplePayOptions = {
  moyasarPublicKey: string;
  amount: number;
  paymentID?: string;
  description?: string;
  currency?: string;
  merchantIdentifier: string;
  isMadaSupported?: boolean;
  isVisaSupported?: boolean;
  isMasterCardSupported?: boolean;
  isAmexSupported?: boolean;
  countryCode?: string;
  isMerchant3DSEnabled?: boolean;
  summaryItems: SummaryItem[];
};

export type ApplePayButtonExpoViewProps = {
  buttonType?:
    | "plain"
    | "donate"
    | "subscribe"
    | "inStore"
    | "checkout"
    | "buy"
    | "book"
    | "topUp"
    | "order"
    | "continue"
    | "reload"
    | "addMoney";
  buttonStyle?: "white" | "whiteOutline" | "black" | "automatic";
  radius?: number;
};

export type ApplePayButtonProps = ApplePayButtonExpoViewProps & ApplePayOptions & {
  onApplePayModalStatusChanged?: (event: onApplePayModalStatusChangedPayload) => void;
  onApplePayCompleted?: (event: OnApplePayCompletedPayload) => void; 
} & {
  width?: number;
  height?: number;
};
