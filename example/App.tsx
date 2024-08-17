import * as MoyasarApplePay from "moyasar-apple-pay";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Merchant, MoyasarKeys } from "./configs";

// 100 <-> 10000 -> APPROVED
// 10100 <-> 60000 -> UNSPECIFIED_FAILURE
// 60100 <-> 100000 -> DECLINED
// 110000 <-> 170000 -> INSUFFICIENT_FUNDS
// Other -> APPROVED

export default function App() {
  const [amount, setAmount] = useState(100); // 400 SAR // for failure
  const [status, setStatus] = useState("");

  useEffect(() => {
    const closedListener = MoyasarApplePay.onApplePayModalStatusChanged(
      (payload) => {
        if (payload.value === "open") {
          setStatus("Apple Pay Modal Opened");
        } else {
          setStatus("Apple Pay Modal Closed");
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

  return (
    <View style={styles.container}>
      <Text
        style={{
          paddingBottom: 60,
          color: "green",
          fontWeight: "800",
        }}
      >
        {status}
      </Text>
      <TextInput
        style={{
          backgroundColor: "#C4D5D4",
          width: "60%",
          borderRadius: 20,
          padding: 10,
          fontSize: 20,
        }}
        returnKeyType="done"
        keyboardType="number-pad"
        value={`${amount}`}
        onChangeText={(text) => {
          if (text === "") {
            setAmount(0);
            return;
          }
          setAmount(Number(text));
        }}
      />
      <TouchableOpacity
        onPress={() => {
          MoyasarApplePay.initiateApplePayPayment({
            amount,
            moyasarPublicKey: MoyasarKeys.TEST,
            merchantIdentifier: Merchant,
            countryCode: "SA",
            currency: "SAR",
            isMadaSupported: true,
            isAmexSupported: false,
            isMasterCardSupported: true,
            isVisaSupported: true,
            isMerchant3DSEnabled: true,
            description: "Malaa Technologies",
            metaData: [
              {
                key: "payment_id",
                value: "test-payment-id-native-button",
              },
              {
                key: "sequence_id",
                value: "test-sequence_id-id-native-button",
              },
            ],
            summaryItems: [
              {
                itemAmount: amount,
                itemTitle: "Investment Fund",
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
        style={{
          paddingTop: 40,
        }}
      >
        <Text>Pay With Apple Pay on Sandbox</Text>
      </TouchableOpacity>

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
              {
                key: "sequence_id",
                value: "test-sequence_id-id-native-button",
              },
            ],
            description: "Malaa Technologies",
            summaryItems: [
              {
                itemAmount: amount,
                itemTitle: "Maarif Payment",
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
        style={{
          paddingTop: 30,
        }}
      >
        <Text>Pay With Apple Pay on Production</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          MoyasarApplePay.canMakePayments().then((canMakePayments) => {
            if (canMakePayments) {
              alert("You can make payments");
            } else {
              alert("You can't make payments");
            }
          });
        }}
        style={{
          paddingTop: 30,
        }}
      >
        <Text>Check Apple Pay Status</Text>
      </TouchableOpacity>

      <View
        style={{
          marginTop: 40,
        }}
      >
        <MoyasarApplePay.ApplePayButton
          buttonStyle="black"
          buttonType="plain"
          radius={20}
          amount={amount}
          merchantIdentifier={Merchant}
          moyasarPublicKey={MoyasarKeys.TEST}
          summaryItems={[
            {
              itemAmount: amount,
              itemTitle: "Maarif Payment",
            },
            {
              itemAmount: amount,
              itemTitle: "Total",
            },
          ]}
          metaData={[
            {
              key: "payment_id",
              value: "test-payment-id-native-button",
            },
            {
              key: "sequence_id",
              value: "test-sequence_id-id-native-button",
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
          onApplePayCompleted={(payload) => {
            console.log("onApplePayCompleted", payload);
          }}
          onApplePayModalStatusChanged={(payload) => {
            console.log("onApplePayModalStatusChanged", payload);
          }}
          width={380}
          height={50}
          isDisabled={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
