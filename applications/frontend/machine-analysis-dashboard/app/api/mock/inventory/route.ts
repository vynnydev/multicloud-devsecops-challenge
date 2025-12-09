import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return NextResponse.json({
    parts: mockData.inventory.parts,
    categories: mockData.inventory.categories,
    lowStockAlerts: mockData.inventory.parts.filter((p) => p.quantity <= p.minQuantity),
  })
}
