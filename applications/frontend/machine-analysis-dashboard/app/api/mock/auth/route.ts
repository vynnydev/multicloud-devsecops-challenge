import { NextResponse } from "next/server"

// Usuários mock para autenticação
const mockUsers = [
  {
    user_id: "usr_001",
    username: "vynnydev",
    email: "vynnydev@cognitiva.com",
    password: "123456",
    name: "Vinicius Prudencio",
    role: "master",
    location_id: "loc_001",
    email_verified: true,
    avatar: "JS",
    department: "Gestão",
    phone: "+55 (11) 99999-0001",
  },
  {
    user_id: "usr_002",
    username: "maria.santos",
    email: "maria.santos@cognitiva.com",
    password: "123456",
    name: "Maria Santos",
    role: "admin",
    location_id: "loc_001",
    email_verified: true,
    avatar: "MS",
    department: "Administração",
    phone: "+55 (11) 99999-0002",
  },
  {
    user_id: "usr_003",
    username: "carlos.oliveira",
    email: "carlos.oliveira@cognitiva.com",
    password: "123456",
    name: "Carlos Oliveira",
    role: "technician",
    location_id: "loc_001",
    email_verified: true,
    avatar: "CO",
    department: "Manutenção",
    phone: "+55 (11) 99999-0003",
  },
  {
    user_id: "usr_004",
    username: "ana.costa",
    email: "ana.costa@cognitiva.com",
    password: "123456",
    name: "Ana Costa",
    role: "operator",
    location_id: "loc_002",
    email_verified: true,
    avatar: "AC",
    department: "Operações",
    phone: "+55 (11) 99999-0004",
  },
  {
    user_id: "usr_005",
    username: "demo",
    email: "demo@cognitiva.com",
    password: "demo",
    name: "Usuário Demo",
    role: "viewer",
    location_id: "loc_001",
    email_verified: true,
    avatar: "UD",
    department: "Visitante",
    phone: "+55 (11) 99999-0000",
  },
]

// Função para gerar token mock
function generateMockToken(prefix: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = prefix + "_"
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, action } = body

    // Simular latência de rede
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Ação de login
    if (action === "login" || !action) {
      if (!username || !password) {
        return NextResponse.json({ error: "Nome de usuário e senha são obrigatórios" }, { status: 400 })
      }

      // Buscar usuário
      const user = mockUsers.find((u) => (u.username === username || u.email === username) && u.password === password)

      if (!user) {
        return NextResponse.json({ error: "Credenciais inválidas. Verifique seu usuário e senha." }, { status: 401 })
      }

      // Gerar resposta de sucesso com tokens
      const response = {
        message: "Login realizado com sucesso",
        access_token: generateMockToken("acc"),
        id_token: generateMockToken("id"),
        refresh_token: generateMockToken("ref"),
        expires_in: 3600,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          location_id: user.location_id,
          email_verified: user.email_verified,
          avatar: user.avatar,
          department: user.department,
          phone: user.phone,
        },
      }

      return NextResponse.json(response)
    }

    // Ação de registro
    if (action === "register") {
      const { email, name, role = "viewer", location_id = "loc_001" } = body

      if (!username || !password || !email || !name) {
        return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
      }

      // Verificar se usuário já existe
      const existingUser = mockUsers.find((u) => u.username === username || u.email === email)

      if (existingUser) {
        return NextResponse.json({ error: "Usuário ou email já cadastrado" }, { status: 409 })
      }

      // Criar novo usuário (em produção, seria salvo no banco)
      const newUser = {
        user_id: `usr_${Date.now()}`,
        username,
        email,
        password,
        name,
        role,
        location_id,
        email_verified: false,
        avatar: name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
        department: "Novo",
        phone: "",
      }

      // Adicionar ao array mock (não persiste após reload)
      mockUsers.push(newUser)

      return NextResponse.json({
        message: "Usuário registrado com sucesso",
        user_id: newUser.user_id,
      })
    }

    // Ação de refresh token
    if (action === "refresh") {
      const { refresh_token } = body

      if (!refresh_token) {
        return NextResponse.json({ error: "Refresh token é obrigatório" }, { status: 400 })
      }

      return NextResponse.json({
        access_token: generateMockToken("acc"),
        id_token: generateMockToken("id"),
        expires_in: 3600,
      })
    }

    return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 })
  } catch (error) {
    console.error("[Mock Auth] Error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// GET para listar usuários disponíveis (apenas para debug/demo)
export async function GET() {
  const usersWithoutPasswords = mockUsers.map(({ password, ...user }) => user)

  return NextResponse.json({
    message: "Usuários disponíveis para login (ambiente de desenvolvimento)",
    hint: "Use qualquer um dos usernames abaixo com a senha '123456' (ou 'demo' para usuário demo)",
    users: usersWithoutPasswords,
  })
}
