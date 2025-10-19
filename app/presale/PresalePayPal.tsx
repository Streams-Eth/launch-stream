"use client"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function PresalePayPal({ presaleData }: { presaleData: any }) {
  const [ethAmount, setEthAmount] = useState("")
  const [lstAmount, setLstAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "paypal">("crypto")

  function PayPalButtonsWrapper() {
    // Hook inside the provider-rendered child
    const [{ isPending }] = require('@paypal/react-paypal-js').usePayPalScriptReducer()

    return (
      <>
        {isPending ? (
          <div className="w-full p-4 bg-slate-700 rounded-lg text-center">
            <div className="text-slate-400">Loading PayPal...</div>
          </div>
        ) : (
          <PayPalButtons
            style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
            createOrder={createPayPalOrder}
            onApprove={onPayPalApprove}
            onError={onPayPalError}
            disabled={!ethAmount || Number.parseFloat(ethAmount) < presaleData.minBuy}
          />
        )}
      </>
    )
  }

  useEffect(() => {
    if (ethAmount && !isNaN(Number.parseFloat(ethAmount))) {
      let lstTokens: number
      if (paymentMethod === "crypto") {
        lstTokens = Number.parseFloat(ethAmount) / presaleData.price
      } else {
        lstTokens = Number.parseFloat(ethAmount) / presaleData.lstUsdPrice
      }
      setLstAmount(lstTokens.toLocaleString())
    } else {
      setLstAmount("")
    }
  }, [ethAmount, paymentMethod])

  const createPayPalOrder = (data: any, actions: any) => {
    const usdAmount = Number.parseFloat(ethAmount)
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: usdAmount.toFixed(2),
            currency_code: "USD",
          },
          description: `${lstAmount} LST Tokens - Launch Stream Presale`,
        },
      ],
    })
  }

  const onPayPalApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture()
      alert(`Payment successful! You will receive ${lstAmount} LST tokens. Transaction ID: ${details.id}`)
      setEthAmount("")
      setLstAmount("")
    } catch (error) {
      alert("Payment failed. Please try again.")
    }
  }

  const onPayPalError = (error: any) => {
    alert("PayPal payment failed. Please try again.")
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: "test",
        currency: "USD",
        intent: "capture",
        components: "buttons,messages",
      }}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-white">Payment Method</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={paymentMethod === "crypto" ? "default" : "outline"}
              onClick={() => setPaymentMethod("crypto")}
              className="w-full"
            >
              Crypto
            </Button>
            <Button
              variant={paymentMethod === "paypal" ? "default" : "outline"}
              onClick={() => setPaymentMethod("paypal")}
              className="w-full"
            >
              PayPal
            </Button>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eth-amount" className="text-white">
              {paymentMethod === "crypto" ? "ETH Amount" : "USD Amount"}
            </Label>
            <Input
              id="eth-amount"
              type="number"
              placeholder={paymentMethod === "crypto" ? "0.1" : "100"}
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-400">
              Minimum: {paymentMethod === "crypto" ? "0.1 ETH" : "$4.50"} • Maximum: {paymentMethod === "crypto" ? "10 ETH" : "$450"}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-white">LST Tokens You'll Receive</Label>
            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-600">
              <div className="text-2xl font-bold text-blue-400">{lstAmount || "0"} LST</div>
              <div className="text-xs text-slate-400">@ ${presaleData.lstUsdPrice} per LST</div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          {paymentMethod === "paypal" && (
            <div className="space-y-3">
              <PayPalButtonsWrapper />
              <div className="text-xs text-slate-400 text-center">
                USD Equivalent: $
                {ethAmount ? (Number.parseFloat(ethAmount) * presaleData.ethToUsd).toFixed(2) : "0.00"}
              </div>
            </div>
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  )
}
