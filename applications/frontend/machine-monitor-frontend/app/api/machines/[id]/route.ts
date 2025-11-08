import { NextResponse } from "next/server"

const API_BASE_URL = "https://7n8nhqvpqd.execute-api.us-east-1.amazonaws.com/prod/machines"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const machineId = params.id

    console.log("[v0] Deletando máquina da API AWS:", machineId)

    // Fazer requisição DELETE para a API AWS
    const response = await fetch(`${API_BASE_URL}/${machineId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Erro ao deletar máquina da API AWS:", errorText)
      return NextResponse.json(
        { error: "Erro ao deletar máquina da API", details: errorText },
        { status: response.status },
      )
    }

    const result = await response.json()
    console.log("[v0] Máquina deletada com sucesso da API AWS:", result)

    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error) {
    console.error("[v0] Erro ao processar requisição de delete:", error)
    return NextResponse.json(
      { error: "Erro ao processar requisição", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
