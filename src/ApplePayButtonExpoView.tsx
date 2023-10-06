import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";
// @ts-ignore
import { ViewProps } from "react-native";

import { ApplePayButtonExpoViewProps } from "./MoyasarApplePay.types";

const NativeView: React.ComponentType<
  { options: ApplePayButtonExpoViewProps } & ViewProps
> = requireNativeViewManager("MoyasarApplePay");

export default function MoyasarApplePayView(
  props: ApplePayButtonExpoViewProps & { width: number; height: number },
) {
  return (
    <NativeView
      options={{
        buttonType: props.buttonType,
        buttonStyle: props.buttonStyle,
        radius: props.radius,
      }}
      style={{
        height: props.height,
        width: props.width
      }}
    />
  );
}
