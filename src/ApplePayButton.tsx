import React, { useCallback, useEffect, useMemo, useRef } from "react";

import {
  onApplePayModalStatusChanged,
  onApplePayCompleted,
  onApplePayButtonClicked,
  initiateApplePayPayment,
} from ".";
import MoyasarApplePayView from "./ApplePayButtonExpoView";
import {
  ApplePayButtonExpoViewProps,
  ApplePayButtonProps,
  ApplePayOptions,
} from "./MoyasarApplePay.types";

const ApplePayButton = (props: ApplePayButtonProps) => {
  const onClickCallback = useCallback(() => {
    if (props.onPress) {
      props.onPress();
    } else {
      initiateApplePayPayment({
        amount: props.amount,
        currency: props.currency,
        merchantIdentifier: props.merchantIdentifier,
        moyasarPublicKey: props.moyasarPublicKey,
        summaryItems: props.summaryItems,
        countryCode: props.countryCode,
        description: props.description,
        isAmexSupported: props.isAmexSupported,
        isMadaSupported: props.isMadaSupported,
        isVisaSupported: props.isVisaSupported,
        isMasterCardSupported: props.isMasterCardSupported,
        isMerchant3DSEnabled: props.isMerchant3DSEnabled,
        metaData: props.metaData,
      }).catch((e) => {
        throw new Error(e);
      });
    }
  }, [props]);

  useEffect(() => {
    const closedListener = onApplePayModalStatusChanged((payload) => {
      if (props.onApplePayModalStatusChanged) {
        props.onApplePayModalStatusChanged(payload);
      }
    });

    const completedListener = onApplePayCompleted((payload) => {
      if (props.onApplePayCompleted) {
        props.onApplePayCompleted(payload);
      }
    });

    const buttonClicked = onApplePayButtonClicked(() => {
      onClickCallback();
    });

    return () => {
      closedListener.remove();
      completedListener.remove();
      buttonClicked.remove();
    };
  }, []);

  const getWidthAndHeight: () => { width: number; height: number } = () => {
    let localWidth, localHeight;

    if (!props.width) {
      localWidth = 350;
    } else {
      localWidth = props.width;
    }
    if (!props.height) {
      localHeight = 50;
    } else {
      localHeight = props.height;
    }

    return {
      width: localWidth,
      height: localHeight,
    };
  };

  return <MoyasarApplePayView {...props} {...getWidthAndHeight()} />;
};

export default ApplePayButton;
