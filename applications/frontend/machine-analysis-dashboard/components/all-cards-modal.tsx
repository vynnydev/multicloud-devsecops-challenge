"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, CreditCard, Trash2, Star } from "lucide-react"

interface Card {
  id: string
  cardholderName: string
  last4: string
  expiryMonth: string
  expiryYear: string
  cardType: string
  isDefault: boolean
}

interface AllCardsModalProps {
  isOpen: boolean
  onClose: () => void
  cards: Card[]
  onSetDefault: (cardId: string) => void
  onDeleteCard: (cardId: string) => void
}

export function AllCardsModal({ isOpen, onClose, cards, onSetDefault, onDeleteCard }: AllCardsModalProps) {
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

  const getCardColor = (cardType: string, index: number) => {
    const colors = [
      "from-blue-500 to-blue-700",
      "from-purple-500 to-purple-700",
      "from-green-500 to-green-700",
      "from-orange-500 to-orange-700",
      "from-pink-500 to-pink-700",
      "from-indigo-500 to-indigo-700",
    ]
    return colors[index % colors.length]
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
          width: "95vw",
          maxWidth: "64rem",
          maxHeight: "90vh",
          borderRadius: "0.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        className="bg-background dark:bg-gray-900 border border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-2xl font-semibold">Meus Cartões</h2>
            <p className="text-sm text-muted-foreground mt-1">Gerencie seus métodos de pagamento cadastrados</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cartão cadastrado</h3>
              <p className="text-sm text-muted-foreground">Adicione um cartão para começar a usar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div key={card.id} className="relative group">
                  {/* Card Design */}
                  <div
                    className={`relative bg-gradient-to-br ${getCardColor(card.cardType, index)} rounded-2xl p-6 h-52 flex flex-col justify-between text-white shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-8 h-8 opacity-80" />
                        {card.isDefault && (
                          <Badge className="bg-yellow-500 text-black border-0">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Padrão
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        {!card.isDefault && (
                          <button
                            onClick={() => onSetDefault(card.id)}
                            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                            title="Definir como padrão"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteCard(card.id)}
                          className="p-2 rounded-lg hover:bg-white/20 transition-colors text-red-300 hover:text-red-200"
                          title="Remover cartão"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-lg font-mono tracking-wider">
                        <span>••••</span>
                        <span>••••</span>
                        <span>••••</span>
                        <span className="font-semibold">{card.last4}</span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs opacity-80 mb-1">Nome do Titular</p>
                        <p className="font-semibold text-sm">{card.cardholderName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-80 mb-1">Validade</p>
                        <p className="font-mono text-sm">
                          {card.expiryMonth}/{card.expiryYear}
                        </p>
                      </div>
                    </div>

                    {/* Card Brand */}
                    <div className="absolute top-6 right-16">
                      <span className="text-2xl font-bold uppercase opacity-90">
                        {card.cardType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border flex-shrink-0 bg-muted/30 dark:bg-gray-800/30">
          <p className="text-sm text-muted-foreground">
            Total de {cards.length} {cards.length === 1 ? "cartão" : "cartões"} cadastrado
            {cards.length !== 1 ? "s" : ""}
          </p>
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  )
}
