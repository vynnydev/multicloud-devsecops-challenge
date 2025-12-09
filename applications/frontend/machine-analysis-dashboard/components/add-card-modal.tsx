"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, CreditCard, Lock } from "lucide-react"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCard: (card: any) => void
}

export function AddCardModal({ isOpen, onClose, onAddCard }: AddCardModalProps) {
  const [cardData, setCardData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardType: "visa",
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const last4 = cardData.cardNumber.slice(-4)

    const newCard = {
      id: Date.now().toString(),
      cardholderName: cardData.cardholderName,
      last4,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cardType: cardData.cardType,
      isDefault: false,
    }

    onAddCard(newCard)
    onClose()

    setCardData({
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardType: "visa",
    })
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, "")
    const groups = numbers.match(/.{1,4}/g)
    return groups ? groups.join(" ") : numbers
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "")
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardData({ ...cardData, cardNumber: value })
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    if (value.length <= 5) {
      const [month, year] = value.split("/")
      setCardData({ ...cardData, expiryMonth: month || "", expiryYear: year || "" })
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          borderRadius: "0.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: "28rem",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        className="bg-background dark:bg-gray-900 border border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Adicionar Novo Cartão</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardType">Tipo de Cartão</Label>
            <select
              value={cardData.cardType}
              onChange={(e) => setCardData({ ...cardData, cardType: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="visa">VISA</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">American Express</option>
              <option value="elo">Elo</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Nome do Titular</Label>
            <Input
              id="cardholderName"
              placeholder="Como está no cartão"
              value={cardData.cardholderName}
              onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(cardData.cardNumber)}
                onChange={handleCardNumberChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Data de Validade</Label>
              <Input
                id="expiry"
                placeholder="MM/AA"
                value={
                  cardData.expiryMonth
                    ? `${cardData.expiryMonth}${cardData.expiryYear ? "/" + cardData.expiryYear : ""}`
                    : ""
                }
                onChange={handleExpiryChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Lock className="w-3 h-3 text-muted-foreground" />
              </div>
              <Input
                id="cvv"
                type="password"
                placeholder="•••"
                maxLength={4}
                value={cardData.cvv}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^\d*$/.test(value)) {
                    setCardData({ ...cardData, cvv: value })
                  }
                }}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar Cartão
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
