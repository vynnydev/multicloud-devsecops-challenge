import { NextResponse } from "next/server"

const API_ENDPOINT = "https://7n8nhqvpqd.execute-api.us-east-1.amazonaws.com/prod/machines"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Mapear dados do formato interno para o formato da API
    const apiPayload = {
      machine_id: body.id,
      machine_name: body.name,
      model: body.type, // Tipo da máquina (Rebitadeira, Montadora, etc)
      location: body.corridor || body.zoneId, // Usa corredor se disponível, senão usa zona
      manufacturer: "Indústria Central", // Valor padrão
    }

    console.log("[v0] Enviando máquina para API AWS:", apiPayload)

    // Fazer requisição para a API AWS
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Erro na API AWS:", errorText)
      return NextResponse.json(
        { error: "Erro ao cadastrar máquina na API", details: errorText },
        { status: response.status },
      )
    }

    const result = await response.json()
    console.log("[v0] Máquina cadastrada com sucesso na API AWS:", result)

    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error) {
    console.error("[v0] Erro ao processar requisição:", error)
    return NextResponse.json(
      { error: "Erro ao processar requisição", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
