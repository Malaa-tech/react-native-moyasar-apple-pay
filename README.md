# react-native-moyasar-apple-pay

iOS native apple pay implementation & integration with Moyasar SDK for React Native

### Installation in managed Expo projects

```
yarn add react-native-moyasar-apple-pay && npx expo prebuild --clean
```

### Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.


### Add the package to your npm dependencies

```
yarn add react-native-moyasar-apple-pay && cd ios && npx pod-install
```



## Usage

This package is devided into 2 parts, ApplePay button & initiating ApplePay payments. you can use one or both as you wish.

Here are some of the options you can implement ApplePay throw this package.



### (Option 1: Recommended) ApplePayButton -> define the ApplePay button, you can refer to `ApplePayButtonProps` type to know what props are supported.
```ts
import * as MoyasarApplePay from "moyasar-apple-pay";

<MoyasarApplePay.ApplePayButton
  buttonStyle="black"
  buttonType="plain" // -> check this to know all the available types. https://developer.apple.com/documentation/apple_pay_on_the_web/applepaybuttontype
  radius={20}
  amount={amount}
  merchantIdentifier={Merchant} // -> This is the ApplePay merchant id, you will have to issue one throw the apple developer account. Moyasar has a guide on how to issue it.  (https://docs.moyasar.com/apple-pay-using-developer-account)
  moyasarPublicKey={MoyasarKeys.TEST} // -> Moyasar API Public Token for ApplePay, you should get this from their dashboard
  summaryItems={[ // -> make sure the total is equal to the sum of the rest of the items.
    {
      itemAmount: amount,
      itemTitle: "Payment",
    },
    {
      itemAmount: amount,
      itemTitle: "Total",
    },
  ]}
  metaData={[ // -> meta data that will be attached to the payment request.
    {
      key: "payment_id",
      value: "test-payment-id-native-button",
    },
  ]}
  countryCode="SA"
  currency="SAR"
  description="Malaa Technologies"
  isMadaSupported={true}
  isAmexSupported={false}
  isMasterCardSupported={false}
  isVisaSupported={false}
  isMerchant3DSEnabled={true}
  onApplePayCompleted={(payload) => { // -> weather payment has finished processing
    console.log("onApplePayCompleted", payload); // -> payload includes status or error description
  }}
  onApplePayModalStatusChanged={(payload) => { // -> weather payment modal is open/close
    console.log("onApplePayModalStatusChanged", payload);
  }}
  width={380}
  height={50}
/>
```

### (Option 2) initiateApplePayPayment -> initiating ApplePay payment directly without the apple pay button. (In case you would like to create your own flow23)

payment params should be very similar to the payment props for the ApplePayButton
```ts
import * as MoyasarApplePay from "moyasar-apple-pay";

<TouchableOpacity
  onPress={async () => {
    MoyasarApplePay.initiateApplePayPayment({
      amount,
      moyasarPublicKey: MoyasarKeys.PROD,
      merchantIdentifier: Merchant,
      countryCode: "SA",
      currency: "SAR",
      isMadaSupported: true,
      isAmexSupported: false,
      isMasterCardSupported: false,
      isVisaSupported: false,
      isMerchant3DSEnabled: true,
      metaData: [
        {
          key: "payment_id",
          value: "test-payment-id-native-button",
        },
      ],
      description: "Malaa Technologies",
      summaryItems: [
        {
          itemAmount: amount,
          itemTitle: "Payment",
        },
        {
          itemAmount: amount,
          itemTitle: "Total",
        },
      ],
    }).catch((e) => {
      setStatus(e.message);
    });
  }}
>
  <Text>Pay With Apple Pay on Production</Text>
</TouchableOpacity>
```

in order to catch payment status or know weather the modal has appeared or not you will have to capture the events in a way similar to this

```ts
import * as MoyasarApplePay from "moyasar-apple-pay";

useEffect(() => {
  const closedListener = MoyasarApplePay.onApplePayModalStatusChanged(
    (payload) => {
      if (payload.value === "open") {
        alert("Apple Pay Modal Opened");
      } else {
        alert("Apple Pay Modal Closed");
      }
    }
  );

  const completedListener = MoyasarApplePay.onApplePayCompleted((payload) => {
    if (payload.status === "paid") {
      alert("Payment Successful");
    } else {
      alert("Payment Declined");
    }
  });

  return () => {
    closedListener.remove();
    completedListener.remove();
  };
}, []);
```

if you would like to know if payments are supported or not on the device, you can use `canMakePayments()` function

```ts
MoyasarApplePay.canMakePayments().then((canMakePayments) => {
  if (canMakePayments) {
    alert("You can make payments");
  } else {
    alert("You can't make payments");
  }
});
```



# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
