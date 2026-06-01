import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";
import { Platform, ViewProps } from "react-native";

import { ApplePayButtonExpoViewProps } from "./MoyasarApplePay.types";

type NativeViewProps = { options: ApplePayButtonExpoViewProps } & ViewProps;

let NativeView: React.ComponentType<NativeViewProps> | null = null;

function getNativeView(): React.ComponentType<NativeViewProps> | null {
	if (Platform.OS !== "ios") {
		return null;
	}
	if (!NativeView) {
		NativeView = requireNativeViewManager("MoyasarApplePay");
	}
	return NativeView;
}

export default function MoyasarApplePayView(
	props: ApplePayButtonExpoViewProps & { width: number; height: number },
) {
	const ViewComponent = getNativeView();
	if (!ViewComponent) {
		return null;
	}
	return (
		<ViewComponent
			options={{
				buttonType: props.buttonType,
				buttonStyle: props.buttonStyle,
				radius: props.radius,
				isLoading: props.isLoading,
				isDisabled: props.isDisabled,
			}}
			style={{
				height: props.height,
				width: props.width,
			}}
		/>
	);
}
