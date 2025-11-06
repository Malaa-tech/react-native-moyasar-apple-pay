import ExpoModulesCore
import PassKit
import MoyasarSdk

public class MoyasarApplePayModule: Module {
    var paymentRequest: PKPaymentRequest!
    var paymentAuthorizationControllerDelegate: PaymentAuthorizationControllerDelegate!
    var applePayOptions: ApplePayOptions!
    
    public required init(appContext: AppContext) {
        super.init(appContext: appContext)
        paymentAuthorizationControllerDelegate = PaymentAuthorizationControllerDelegate()
        paymentAuthorizationControllerDelegate.moyasarApplePayModule = self
    }
    
    public func definition() -> ModuleDefinition {
        Name("MoyasarApplePay")
        Events("onApplePayModalStatusChanged", "onApplePayCompleted", "OnApplePayButtonClicked")
        
        AsyncFunction("initiateApplePayPayment") { (applePayOptions: ApplePayOptions) -> Void in
            do {
                try initiatePayment(applePayOptions: applePayOptions)
            } catch {
                throw error
            }
        }
        
        AsyncFunction("canMakePayments") {
            return PKPaymentAuthorizationController.canMakePayments()
        }
        
        View(ApplePayButtonExpoView.self) {
            Prop("options") { (view: ApplePayButtonExpoView, prop: ApplePayButtonOptions) in
                if view.moyasarApplePayModule == nil {
                    view.moyasarApplePayModule = self
                }
                let buttonType = ApplePayButtonExpoView.getButtonTypeFromString(buttonType: prop.buttonType)
                let buttonStyle = ApplePayButtonExpoView.getButtonStyleFromString(buttonStyle: prop.buttonStyle)
                
                view.renderButton(paymentButtonType: buttonType, paymentButtonStyle: buttonStyle, cornerRadius: prop.radius, isDisabled: prop.isDisabled, isLoading: prop.isLoading)
            }
        }
    }
    
    func onApplePayButtonClicked() {
        self.sendEvent("OnApplePayButtonClicked")
    }
    
    func onApplePayModalStatusChanged(applePayModalStatus: ApplePayModalStatus) {
        self.sendEvent("onApplePayModalStatusChanged", [
            "value": applePayModalStatus.rawValue
        ])
    }
    
    func onApplePayCompleted(applePayPaymentStatus: ApplePayPaymentStatus) {
        self.sendEvent("onApplePayCompleted", applePayPaymentStatus.toParsable())
    }
    
    func initiatePayment(applePayOptions: ApplePayOptions) throws {
        self.applePayOptions = applePayOptions
       
        do {
            let paymentRequest = createPaymentRequest()
            
            if let applePayVC = PKPaymentAuthorizationViewController(paymentRequest: paymentRequest) {
                applePayVC.delegate = paymentAuthorizationControllerDelegate!
                
                DispatchQueue.main.async {
                    self.onApplePayModalStatusChanged(applePayModalStatus: .open)
                    self.appContext?.utilities?.currentViewController()?.present(applePayVC, animated: true, completion: nil)
                }
            } else {
                throw CustomError("Unable to initialize PKPaymentAuthorizationViewController, check paymentOptions are correct, (Check Native Logs)")
            }
        } catch {
            throw error
        }
    }
    
    private func createPaymentRequest() -> PKPaymentRequest {
        paymentRequest = PKPaymentRequest()
        paymentRequest.merchantIdentifier = applePayOptions.merchantIdentifier
        paymentRequest.supportedNetworks = []
        
        paymentRequest.supportedNetworks = [
            applePayOptions.isAmexSupported ? .amex : nil,
            applePayOptions.isMadaSupported ? .mada : nil,
            applePayOptions.isVisaSupported ? .visa : nil,
            applePayOptions.isMasterCardSupported ? .masterCard : nil
        ].compactMap { $0 }
        
        if (applePayOptions.isMerchant3DSEnabled) {
            paymentRequest.merchantCapabilities = .capability3DS
        }
        paymentRequest.countryCode = applePayOptions.countryCode
        paymentRequest.currencyCode = applePayOptions.currency
        
        paymentRequest.paymentSummaryItems = createPaymentSummaryItems()
      
        return paymentRequest
    }

    private func createPaymentSummaryItems() -> [PKPaymentSummaryItem] {
        var summaryItems: [PKPaymentSummaryItem] = []
        
        for summaryItem in applePayOptions.summaryItems {
            let item = PKPaymentSummaryItem(label: summaryItem.itemTitle, amount: NSDecimalNumber(value: Double(summaryItem.itemAmount) / 100.0))
            summaryItems.append(item)
        }

        return summaryItems
    }
}
