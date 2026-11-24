
const API_URL = 'http://localhost:3000'

// Verifica se o usuário está no modo vendedor
export function verificarModoVendedor() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')

  return usuario && (usuario.modoAtivo || usuario.tipoPerfil) === 'vendedor'
}

// Carrega o modo do usuário
export async function carregarModo(usuario) {
  if (!usuario) return null

  const resposta = await fetch(`${API_URL}/usuarios/${usuario.id}`)

  if (resposta.ok) {
    const usuarioAtualizado = await resposta.json()
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado))

    return usuarioAtualizado
  }

  return null
}

// Troca o modo do usuário
export async function trocarModo(usuario, modo) {
  const resposta = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modoAtivo: modo,
    }),
  })

  if (!resposta.ok) return null

  const usuarioAtualizado = await resposta.json()

  localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado))
  window.dispatchEvent(new Event('modoAlterado'))

  return usuarioAtualizado
}
