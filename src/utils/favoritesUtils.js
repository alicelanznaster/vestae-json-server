import router from '@/router'

// favoritar ou desfavoritar um produto
export function favoritarProduto(produto) {
  const usuarioLogado = JSON.parse(
    localStorage.getItem('usuarioLogado') || 'null'
  )

  if (!usuarioLogado) {
    localStorage.setItem('produtoParaFavoritar', JSON.stringify(produto.id))
    localStorage.setItem('voltarDepoisDoLogin', '/favoritos')
    router.push('/login')
    return
  }

  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '{}')

  if (!favoritos[usuarioLogado.id]) {
    favoritos[usuarioLogado.id] = []
  }

  const posicao = favoritos[usuarioLogado.id].indexOf(produto.id)

  if (posicao === -1) {
    favoritos[usuarioLogado.id].push(produto.id)
    produto.favorito = true
  } else {
    favoritos[usuarioLogado.id].splice(posicao, 1)
    produto.favorito = false
  }

  localStorage.setItem('favoritos', JSON.stringify(favoritos))
}

// carregar os favoritos
export async function carregarFavoritos() {
  const usuarioLogado = JSON.parse(
    localStorage.getItem('usuarioLogado') || 'null'
  )

  const resposta = await fetch('http://localhost:3000/produtos')
  const produtos = await resposta.json()

  if (!usuarioLogado) return

  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '{}')
  const favoritosUsuario = favoritos[usuarioLogado.id] || []

  produtos.forEach((produto) => {
    produto.favorito = favoritosUsuario.some(
      (id) => String(id) === String(produto.id)
    )
  })
}