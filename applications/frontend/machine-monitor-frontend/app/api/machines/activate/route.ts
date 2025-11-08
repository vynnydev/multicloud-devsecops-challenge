import { NextResponse } from "next/server"

const API_ENDPOINT = "https://7n8nhqvpqd.execute-api.us-east-1.amazonaws.com/prod/machines/activate"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] Enviando máquina para análise/manutenção na API AWS:", body)

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const contentType = response.headers.get("content-type")

    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } else {
        const errorText = await response.text()
        errorMessage = errorText.substring(0, 300) // Limit error length
      }

      console.error("[v0] Erro na API AWS:", errorMessage)
      return NextResponse.json(
        { error: "Erro ao enviar máquina para análise/manutenção", details: errorMessage },
        { status: response.status },
      )
    }

    // Verify response is JSON before parsing
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text()
      console.error("[v0] API retornou formato não-JSON:", contentType, responseText.substring(0, 200))
      return NextResponse.json(
        { error: "API retornou formato inválido", details: "Esperado JSON, recebido " + contentType },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("[v0] Máquina enviada para análise/manutenção com sucesso:", result)

    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error) {
    console.error("[v0] Erro ao processar requisição:", error)
    return NextResponse.json(
      { error: "Erro ao processar requisição", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
