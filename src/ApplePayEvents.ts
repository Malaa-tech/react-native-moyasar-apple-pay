import type { EventSubscription } from "expo-modules-core/build/ts-declarations/EventEmitter";
import {
	onApplePayModalStatusChangedPayload,
	OnApplePayCompletedPayload,
	ApplePayOptions,
} from "./MoyasarApplePay.types";
import MoyasarApplePayModule from "./MoyasarApplePayModule";
import { Platform } from "expo-modules-core";

export function onApplePayModalStatusChanged(
	listener: (event: onApplePayModalStatusChangedPayload) => void,
): EventSubscription {
	return MoyasarApplePayModule.addListener(
		"onApplePayModalStatusChanged",
		listener,
	);
}

export function onApplePayCompleted(
	listener: (event: OnApplePayCompletedPayload) => void,
): EventSubscription {
	return MoyasarApplePayModule.addListener("onApplePayCompleted", listener);
}

export function onApplePayButtonClicked(
	listener: (event) => void,
): EventSubscription {
	return MoyasarApplePayModule.addListener("OnApplePayButtonClicked", listener);
}

export async function initiateApplePayPayment(
	applePayOptions: ApplePayOptions,
) {
	return await MoyasarApplePayModule.initiateApplePayPayment(applePayOptions);
}

export async function canMakePayments(): Promise<boolean> {
	if (Platform.OS === "android") {
		return new Promise((resolve, reject) => {
			resolve(false);
		});
	}
	return MoyasarApplePayModule.canMakePayments();
}
