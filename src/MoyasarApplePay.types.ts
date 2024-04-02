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

export type MetaDataItem = {
  key: string;
  value: string;
};

export type ApplePayOptions = {
  moyasarPublicKey: string;
  amount: number;
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
  metaData?: MetaDataItem[];
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
  isDisabled?: boolean;
  isLoading?: boolean;
};

type ApplePayButtonBaseProps = ApplePayButtonExpoViewProps & {
  onApplePayModalStatusChanged?: (
    event: onApplePayModalStatusChangedPayload
  ) => void;
  onApplePayCompleted?: (event: OnApplePayCompletedPayload) => void;
  width?: number | string;
  height?: number | string;
};

type WithOnPress = {
  onPress: () => void;
};

type WithoutOnPress = {
  onPress?: never;
} & ApplePayOptions;

export type ApplePayButtonProps = ApplePayButtonBaseProps &
  (WithOnPress | WithoutOnPress);
