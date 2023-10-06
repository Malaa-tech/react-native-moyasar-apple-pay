import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
  Platform,
} from "expo-modules-core";
// Import the native module. On web, it will be resolved to MoyasarApplePay.web.ts
// and on native platforms to MoyasarApplePay.ts
import ApplePayButton from "./ApplePayButton";
import {
  ApplePayOptions,
  onApplePayModalStatusChangedPayload,
  OnApplePayCompletedPayload,
} from "./MoyasarApplePay.types";
import MoyasarApplePayModule from "./MoyasarApplePayModule";

const emitter = new EventEmitter(
  MoyasarApplePayModule ?? NativeModulesProxy.MoyasarApplePay,
);

export function onApplePayModalStatusChanged(
  listener: (event: onApplePayModalStatusChangedPayload) => void,
): Subscription {
  return emitter.addListener<onApplePayModalStatusChangedPayload>(
    "onApplePayModalStatusChanged",
    listener,
  );
}

export function onApplePayCompleted(
  listener: (event: OnApplePayCompletedPayload) => void,
): Subscription {
  return emitter.addListener<OnApplePayCompletedPayload>(
    "onApplePayCompleted",
    listener,
  );
}

export function onApplePayButtonClicked(
  listener: (event: void) => void,
): Subscription {
  return emitter.addListener<void>("OnApplePayButtonClicked", listener);
}

export async function initiateApplePayPayment(
  applePayOptions: ApplePayOptions,
) {
  return await MoyasarApplePayModule.initiateApplePayPayment(applePayOptions);
}

export async function canMakePayments(): Promise<boolean> {
  if (Platform.OS === 'android') {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }
  return MoyasarApplePayModule.canMakePayments();
}

export { onApplePayModalStatusChangedPayload, ApplePayOptions, ApplePayButton };
