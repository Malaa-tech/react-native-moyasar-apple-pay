import type { EventSubscription } from "expo-modules-core/build/ts-declarations/EventEmitter";
import { Platform } from "expo-modules-core";
import {
	onApplePayModalStatusChangedPayload,
	OnApplePayCompletedPayload,
	ApplePayOptions,
} from "./MoyasarApplePay.types";
import MoyasarApplePayModule from "./MoyasarApplePayModule";

const noopSubscription: EventSubscription = { remove: () => {} };

const IOS_ONLY_ERROR =
	"Moyasar Apple Pay is only available on iOS";

function isIosModuleAvailable(): boolean {
	return Platform.OS === "ios" && MoyasarApplePayModule != null;
}

export function onApplePayModalStatusChanged(
	listener: (event: onApplePayModalStatusChangedPayload) => void,
): EventSubscription {
	if (!isIosModuleAvailable()) {
		return noopSubscription;
	}
	return MoyasarApplePayModule.addListener(
		"onApplePayModalStatusChanged",
		listener,
	);
}

export function onApplePayCompleted(
	listener: (event: OnApplePayCompletedPayload) => void,
): EventSubscription {
	if (!isIosModuleAvailable()) {
		return noopSubscription;
	}
	return MoyasarApplePayModule.addListener("onApplePayCompleted", listener);
}

export function onApplePayButtonClicked(
	listener: (event) => void,
): EventSubscription {
	if (!isIosModuleAvailable()) {
		return noopSubscription;
	}
	return MoyasarApplePayModule.addListener("OnApplePayButtonClicked", listener);
}

export async function initiateApplePayPayment(
	applePayOptions: ApplePayOptions,
) {
	if (!isIosModuleAvailable()) {
		throw new Error(IOS_ONLY_ERROR);
	}
	return await MoyasarApplePayModule.initiateApplePayPayment(applePayOptions);
}

export async function canMakePayments(): Promise<boolean> {
	if (!isIosModuleAvailable()) {
		return false;
	}
	return MoyasarApplePayModule.canMakePayments();
}
