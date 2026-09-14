import { requireNativeViewManager } from "expo-modules-core";
import type * as React from "react";
import type { DimensionValue, ViewProps } from "react-native";
import { Platform } from "react-native";

import type { ApplePayButtonExpoViewProps } from "./MoyasarApplePay.types";

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
	props: ApplePayButtonExpoViewProps & {
		width: number | string;
		height: number | string;
	},
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
				height: props.height as DimensionValue,
				width: props.width as DimensionValue,
			}}
		/>
	);
}
