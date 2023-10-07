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
    var spinner: UIActivityIndicatorView!
    
    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        setupView()
    }
    
    private func setupView() {
        clipsToBounds = true
    }
    
    final func renderButton(paymentButtonType: PKPaymentButtonType, paymentButtonStyle: PKPaymentButtonStyle, cornerRadius: Double, isDisabled: Bool, isLoading: Bool) {
        applePayButton?.removeFromSuperview()
        
        let newButton = PKPaymentButton(paymentButtonType: paymentButtonType, paymentButtonStyle: paymentButtonStyle)
        newButton.translatesAutoresizingMaskIntoConstraints = false
        newButton.cornerRadius = cornerRadius
        newButton.addTarget(self, action: #selector(handleClick), for: .touchUpInside)

        if (isDisabled || isLoading) {
            newButton.isUserInteractionEnabled = false
            newButton.alpha = 0.5
        }
        
        addSubview(newButton)
        
        if (isLoading) {
            attachSpinner(isLoading: isLoading, paymentButtonStyle: paymentButtonStyle)
        }
        
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
    
    private func attachSpinner(isLoading: Bool, paymentButtonStyle: PKPaymentButtonStyle) {
        spinner?.removeFromSuperview()

        spinner = UIActivityIndicatorView()
        switch paymentButtonStyle {
        case .black:
            spinner.color = .white
        case .white:
            spinner.color = .black
        case .whiteOutline:
            spinner.color = .black
        default:
            spinner.color = .white
        }
        spinner.startAnimating()
        spinner.translatesAutoresizingMaskIntoConstraints = false
        addSubview(spinner)
        
        NSLayoutConstraint.activate([
            spinner.centerXAnchor.constraint(equalTo: self.centerXAnchor),
            spinner.centerYAnchor.constraint(equalTo: self.centerYAnchor)
        ])
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
