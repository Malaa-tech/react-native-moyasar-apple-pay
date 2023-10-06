//
//  ApplePayButtonExpoView.swift
//  MoyasarApplePay
//
//  Created by Wadah Esam on 06/10/2023.
//

import ExpoModulesCore
import PassKit

class ApplePayButtonExpoView: ExpoView {
    var applePayButton: PKPaymentButton?
    var moyasarApplePayModule: MoyasarApplePayModule!
    var applePayOptions: ApplePayOptions!

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        setupView()
    }
    
    private func setupView() {
        clipsToBounds = true
        renderButton(paymentButtonType: .plain, paymentButtonStyle: .black, cornerRadius: 4.0)
    }
    
    final func renderButton(paymentButtonType: PKPaymentButtonType, paymentButtonStyle: PKPaymentButtonStyle, cornerRadius: Double) {
        applePayButton?.removeFromSuperview()
        
        let newButton = PKPaymentButton(paymentButtonType: paymentButtonType, paymentButtonStyle: paymentButtonStyle)
        newButton.translatesAutoresizingMaskIntoConstraints = false
        newButton.cornerRadius = cornerRadius
        newButton.addTarget(self, action: #selector(handleClick), for: .touchUpInside)
        
        addSubview(newButton)
        
        NSLayoutConstraint.activate([
            newButton.topAnchor.constraint(equalTo: self.topAnchor),
            newButton.bottomAnchor.constraint(equalTo: self.bottomAnchor),
            newButton.leadingAnchor.constraint(equalTo: self.leadingAnchor),
            newButton.trailingAnchor.constraint(equalTo: self.trailingAnchor),
        ])
        
        applePayButton = newButton
    }
    
    @objc func handleClick() {
        moyasarApplePayModule.onApplePayButtonClicked()
    }
    
    
    static func getButtonStyleFromString(buttonStyle: String) -> PKPaymentButtonStyle {
        switch buttonStyle {
        case "black":
            return .black
        case "white":
            return .white
        case "whiteOutline":
            return .whiteOutline
        case "automatic":
            if #available(iOS 14.0, *) {
                return .automatic
            }
        default:
            return .black
        }
        return .black
    }
    
    static func getButtonTypeFromString(buttonType: String) -> PKPaymentButtonType {
        switch buttonType {
        case "plain":
            return .plain
        case "donate":
            return .donate
        case "subscribe":
            return .subscribe
        case "inStore":
            return .inStore
        case "checkout":
            return .checkout
        case "buy":
            return .buy
        case "book":
            return .book
        case "topUp":
            if #available(iOS 14.0, *) {
                return .topUp
            }
        case "order":
            if #available(iOS 14.0, *) {
                return .order
            }
        case "continue":
            if #available(iOS 15.0, *) {
                return .continue
            }
        case "reload":
            if #available(iOS 14.0, *) {
                return .reload
            }
        case "addMoney":
            if #available(iOS 14.0, *) {
                return .addMoney
            }
        default:
            return .plain
        }
        
        return .plain
    }
}
