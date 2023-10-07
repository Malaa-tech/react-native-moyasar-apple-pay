//
//  PaymentAuthorizationControllerDelegate.swift
//  MoyasarApplePay
//
//  Created by Wadah Esam on 04/10/2023.
//

import Foundation
import PassKit
import MoyasarSdk

class PaymentAuthorizationControllerDelegate: NSObject, PKPaymentAuthorizationViewControllerDelegate {
    var moyasarApplePayModule: MoyasarApplePayModule!
    
    func paymentAuthorizationViewControllerDidFinish(_ controller: PKPaymentAuthorizationViewController) {
        controller.dismiss(animated: true, completion: nil)
        moyasarApplePayModule.onApplePayModalStatusChanged(applePayModalStatus: .close)
    }
    
    func paymentAuthorizationViewController(_ controller: PKPaymentAuthorizationViewController, didAuthorizePayment payment: PKPayment, handler completion: @escaping (PKPaymentAuthorizationResult) -> Void) {
        
        do {
            let moyasarPaymentRequest = PaymentRequest(
                amount: self.moyasarApplePayModule.applePayOptions.amount,
                currency: self.moyasarApplePayModule.applePayOptions.currency,
                description: self.moyasarApplePayModule.applePayOptions.description,
                metadata: self.getMoyasarMetaData()
            )
            let service = ApplePayService()
            try service.authorizePayment(request: moyasarPaymentRequest, token: payment.token) { result in
                switch result {
                case .success(let paymentInfo):
                    switch paymentInfo.status {
                    case "paid":
                        self.moyasarApplePayModule.onApplePayCompleted(applePayPaymentStatus: ApplePayPaymentStatus(paymentStatus: paymentInfo.status, amount: paymentInfo.amount, source: .moyasar, moyasar_payment_id: paymentInfo.id))
                        completion(PKPaymentAuthorizationResult(status: .success, errors: nil))
                        break
                    case "failed":
                        let localSource = self.getMoyasarPaymentSourceObject(source: paymentInfo.source)
                        self.moyasarApplePayModule.onApplePayCompleted(applePayPaymentStatus: ApplePayPaymentStatus(paymentStatus: paymentInfo.status, amount: paymentInfo.amount, source: .moyasar, moyasar_payment_id: paymentInfo.id, errorDescription: localSource?.message ?? "payment failed from moyasar"))
                        self.closePaymentWithError(errorCode: 400, errorDomain: "PaymentError.moyasar", localizedDescription: localSource?.message ?? "payment failed from moyasar", handler: completion, sendEvent: false)
                    default:
                        self.closePaymentWithError(errorCode: 401, errorDomain: "PaymentError.moyasar", localizedDescription: "unkown payment status from moyasar", handler: completion)
                    }
                case .error(_):
                    self.closePaymentWithError(errorCode: 402, errorDomain: "PaymentError.moyasar", localizedDescription: "error happened when checking payment with moyasar", handler: completion)
                @unknown default:
                    self.closePaymentWithError(errorCode: 402, errorDomain: "PaymentError.moyasar", localizedDescription: "something wrong happened when checking payment with moyasar", handler: completion)
                }
            }
        } catch {
            self.closePaymentWithError(errorCode: 404, errorDomain: "PaymentError.moyasar", localizedDescription: "could not verify payment form moyasar", handler: completion)
        }
    }
    
    private func getMoyasarPaymentSourceObject(source: ApiPaymentSource) -> ApiApplePaySourceLocal? {
        var result: ApiApplePaySourceLocal?
        
        switch source {
        case .applePay(let source):
            do {
                let jsonData = try  JSONEncoder().encode(source)
                result = try JSONDecoder().decode(ApiApplePaySourceLocal.self, from: jsonData)
            } catch {
                print("error parsing")
            }
        default:
            print("payment created with different source")
        }
        
        return result;
    }
    
    private func getMoyasarMetaData() -> [String: String] {
        var metaData: [String: String] = [:];
        for metaDataItem in self.moyasarApplePayModule.applePayOptions.metaData {
            metaData[metaDataItem.key] = metaDataItem.value
        }
        return metaData;
    }
    
    private func closePaymentWithError(errorCode: Int, errorDomain: String, localizedDescription: String, handler completion: @escaping (PKPaymentAuthorizationResult) -> Void, sendEvent: Bool = true) {
        if (sendEvent) {
            self.sendGeneralErrorEvent(localizedDescription: localizedDescription)
        }
        
        let errorDomain = errorDomain
        let errorCode = errorCode
        let nsError = NSError(domain: errorDomain, code: errorCode, userInfo: [NSLocalizedDescriptionKey: localizedDescription])
        let result = PKPaymentAuthorizationResult(status: .failure, errors: [nsError])
        completion(result)
    }
    
    private func sendGeneralErrorEvent(localizedDescription: String) {
        self.moyasarApplePayModule.onApplePayCompleted(applePayPaymentStatus: ApplePayPaymentStatus(paymentStatus: "error", amount: self.moyasarApplePayModule.applePayOptions.amount, source: .local, errorDescription: localizedDescription))
    }
}
