import router from '@/router'

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

  if (!favoritos[usuarioLogado.email]) {
    favoritos[usuarioLogado.email] = []
  }

  const posicao = favoritos[usuarioLogado.email].indexOf(produto.id)

  if (posicao === -1) {
    favoritos[usuarioLogado.email].push(produto.id)
    produto.favorito = true
  } else {
    favoritos[usuarioLogado.email].splice(posicao, 1)
    produto.favorito = false
  }

  localStorage.setItem('favoritos', JSON.stringify(favoritos))
}

export async function carregarFavoritos() {
  const usuarioLogado = JSON.parse(
    localStorage.getItem('usuarioLogado') || 'null'
  )

  try {
    const resposta = await fetch('http://localhost:3000/produtos')
    const produtos = await resposta.json()

    if (!usuarioLogado) return

    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '{}')
    const favoritosUsuario = favoritos[usuarioLogado.email] || []

    produtos.forEach((produto) => {
      produto.favorito = favoritosUsuario.some(
        (id) => String(id) === String(produto.id)
      )
    })

  } catch (erro) {
    console.error('Erro ao carregar favoritos:', erro)
  }
}