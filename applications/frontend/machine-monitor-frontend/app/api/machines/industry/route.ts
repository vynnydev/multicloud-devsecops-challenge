import { NextResponse } from "next/server"

const API_ENDPOINT = "https://7n8nhqvpqd.execute-api.us-east-1.amazonaws.com/prod/machines/industry"

export async function GET() {
  try {
    console.log("[v0] Listando máquinas da API AWS...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const contentType = response.headers.get("content-type")

    if (!response.ok) {
      let errorDetails = `Status ${response.status}`

      // Only try to parse JSON if content-type indicates JSON
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json()
          errorDetails = JSON.stringify(errorData)
        } catch {
          errorDetails = await response.text()
        }
      } else {
        errorDetails = await response.text()
      }

      console.error("[v0] Erro na API AWS:", errorDetails)
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao listar máquinas da API",
          details: errorDetails.substring(0, 500),
        },
        { status: 500 },
      )
    }

    if (!contentType || !contentType.includes("application/json")) {
      console.error("[v0] AWS API returned non-JSON:", contentType)
      const textResponse = await response.text()
      return NextResponse.json(
        {
          success: false,
          error: "API retornou formato inválido",
          details: `Expected JSON, got ${contentType}. Response: ${textResponse.substring(0, 200)}`,
        },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("[v0] Máquinas obtidas da API AWS:", result)

    const machines = Array.isArray(result) ? result : result.machines || []

    return NextResponse.json({ success: true, data: machines }, { status: 200 })
  } catch (error) {
    console.error("[v0] Erro ao processar requisição:", error)

    let errorMessage = "Erro desconhecido"
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Timeout: A requisição demorou muito tempo"
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar requisição",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
