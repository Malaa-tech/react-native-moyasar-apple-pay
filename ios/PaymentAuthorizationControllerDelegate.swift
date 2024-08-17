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
    let encoder = JSONEncoder()
    let decoder = JSONDecoder()
    
    func paymentAuthorizationViewControllerDidFinish(_ controller: PKPaymentAuthorizationViewController) {
        controller.dismiss(animated: true, completion: nil)
        moyasarApplePayModule.onApplePayModalStatusChanged(applePayModalStatus: .close)
    }
    
    func paymentAuthorizationViewController(_ controller: PKPaymentAuthorizationViewController, didAuthorizePayment payment: PKPayment, handler completion: @escaping (PKPaymentAuthorizationResult) -> Void) {
        do {
            let moyasarPaymentRequest = PaymentRequest(
                apiKey: self.moyasarApplePayModule.applePayOptions.moyasarPublicKey,
                amount: self.moyasarApplePayModule.applePayOptions.amount,
                currency: self.moyasarApplePayModule.applePayOptions.currency,
                description: self.moyasarApplePayModule.applePayOptions.description,
                metadata: self.getMoyasarMetaData()
            )
            let service = try ApplePayService(apiKey: self.moyasarApplePayModule.applePayOptions.moyasarPublicKey)
            
            
            if (payment.token.transactionIdentifier == "Simulated Identifier") {
                self.closePaymentWithError(errorCode: 406, errorDomain: "PaymentError.moyasar", localizedDescription:  "Simulator payments not supported", handler: completion)
                return;
            }
            
            Task {
                do {
                    let paymentResult = try await service.authorizePayment(request: moyasarPaymentRequest, token: payment.token)
                    
                    switch (paymentResult.status) {
                    case .paid:
                        self.moyasarApplePayModule.onApplePayCompleted(applePayPaymentStatus: ApplePayPaymentStatus(paymentStatus: paymentResult.status.rawValue, amount: paymentResult.amount, source: .moyasar, moyasar_payment_id: paymentResult.id))
                        completion(PKPaymentAuthorizationResult(status: .success, errors: nil))
                        break
                    case .failed:
                        let localSource = self.getMoyasarPaymentSourceObject(source: paymentResult.source)
                        self.moyasarApplePayModule.onApplePayCompleted(applePayPaymentStatus: ApplePayPaymentStatus(paymentStatus: paymentResult.status.rawValue, amount: paymentResult.amount, source: .moyasar, moyasar_payment_id: paymentResult.id, errorDescription: localSource?.message ?? "payment failed from moyasar"))
                        self.closePaymentWithError(errorCode: 400, errorDomain: "PaymentError.moyasar", localizedDescription: localSource?.message ?? "payment failed from moyasar", handler: completion, sendEvent: false)
                        break
                    case .initiated, .authorized, .captured, .refunded, .voided, .verified:
                        self.closePaymentWithError(errorCode: 401, errorDomain: "PaymentError.moyasar", localizedDescription: "something wrong happened when checking payment with moyasar (uncaptured status) \(paymentResult.status)", handler: completion)
                        break
                    @unknown default:
                        self.closePaymentWithError(errorCode: 402, errorDomain: "PaymentError.moyasar", localizedDescription: "something wrong happened when checking payment with moyasar (unknown status)", handler: completion)
                        break
                    }
                } catch {
                    self.closePaymentWithError(errorCode: 411, errorDomain: "PaymentError.moyasar", localizedDescription: "something wrong happened when checking (final catch) \(error)", handler: completion)
                }
            }
        } catch {
            self.closePaymentWithError(errorCode: 404, errorDomain: "PaymentError.moyasar", localizedDescription: "could not verify payment form moyasar \(error)", handler: completion)
        }
    }
    
    private func getMoyasarPaymentSourceObject(source: ApiPaymentSource) -> ApiApplePaySourceLocal? {
        var result: ApiApplePaySourceLocal?
        
        switch source {
        case .applePay(let source):
            do {
                let jsonData = try encoder.encode(source)
                result = try decoder.decode(ApiApplePaySourceLocal.self, from: jsonData)
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
