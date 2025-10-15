"use client"

import { useState } from "react"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { Loader2 } from "lucide-react"

interface PayPalPaymentProps {
  amount: string
  tokenAmount: string
  ethToUsdRate: number
  onSuccess: (details: any) => void
  onError: (error: any) => void
  disabled?: boolean
}

export function PayPalPayment({
  amount,
  tokenAmount,
  ethToUsdRate,
  onSuccess,
  onError,
  disabled = false,
}: PayPalPaymentProps) {
  const [{ isPending }] = usePayPalScriptReducer()
  const [isProcessing, setIsProcessing] = useState(false)

  const usdAmount = Number.parseFloat(amount) * ethToUsdRate

  const createOrder = (data: any, actions: any) => {
    console.log("[v0] Creating PayPal order for $", usdAmount.toFixed(2))

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: usdAmount.toFixed(2),
            currency_code: "USD",
          },
          description: `${tokenAmount} LST Tokens - Launch Stream Presale`,
          custom_id: `presale_${Date.now()}`,
        },
      ],
      application_context: {
        brand_name: "Launch Stream",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
      },
    })
  }

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true)
    console.log("[v0] PayPal payment approved:", data)

    try {
      const details = await actions.order.capture()
      console.log("[v0] PayPal payment captured:", details)
      onSuccess(details)
    } catch (error) {
      console.error("[v0] PayPal capture error:", error)
      onError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleError = (error: any) => {
    console.error("[v0] PayPal error:", error)
    onError(error)
  }

  if (isPending) {
    return (
      <div className="w-full p-4 bg-slate-700 rounded-lg flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-slate-400">Loading PayPal...</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay",
          height: 45,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={handleError}
        disabled={disabled || isProcessing}
        forceReRender={[usdAmount, tokenAmount]}
      />
      <div className="text-xs text-slate-400 text-center">
        USD Amount: ${usdAmount.toFixed(2)} • {tokenAmount} LST Tokens
      </div>
      {isProcessing && (
        <div className="text-xs text-blue-400 text-center flex items-center justify-center">
          <Loader2 className="w-3 h-3 animate-spin mr-1" />
          Processing payment...
        </div>
      )}
    </div>
  )
}
