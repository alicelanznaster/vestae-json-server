import { ref } from 'vue'

const ultimoProdAdd = ref('')
const mostrarAviso = ref(false)
const carrinho = ref([])
const selecionados = ref([])

function pegarUsuario() {
  return JSON.parse(
    localStorage.getItem('usuarioLogado') || 'null'
  )
}

function carregarCarrinho() {
  const usuario = pegarUsuario()

  if (usuario) {
    const carrinhos = JSON.parse(
      localStorage.getItem('carrinhos') || '{}'
    )

    carrinho.value = carrinhos[usuario.email] || []
    return
  }

  const carrinhoVisitante = JSON.parse(localStorage.getItem('carrinho') || '[]')
  carrinho.value = carrinhoVisitante
}

function salvarCarrinho() {
  const usuario = pegarUsuario()

  if (usuario) {
    const carrinhos = JSON.parse(
      localStorage.getItem('carrinhos') || '{}'
    )

    carrinhos[usuario.email] = carrinho.value
    localStorage.setItem(
      'carrinhos',
      JSON.stringify(carrinhos)
    )
    return
  }

  localStorage.setItem(
    'carrinho',
    JSON.stringify(carrinho.value)
  )
}

carregarCarrinho()

async function addCarrinho(idItem) {
  try {
    const resposta = await fetch('http://localhost:3000/produtos')
    const produtos = await resposta.json()

    const item = produtos.find(
      (p) => String(p.id) === String(idItem)
    )

    if (item) {
      ultimoProdAdd.value = item.titulo

      const itemExistente = carrinho.value.find(
        (produto) => String(produto.id) === String(idItem)
      )

      if (!itemExistente) {
        carrinho.value.push(item)
      }

      salvarCarrinho()
      mostrarAviso.value = true

      setTimeout(() => {
        mostrarAviso.value = false
      }, 2000)
    }
  } catch (erro) {
    console.error('Erro ao adicionar produto ao carrinho:', erro)
  }
}

function removerCarrinho(idItem) {
  const posicao = carrinho.value.findIndex(
    (item) => item.id === idItem
  )

  if (posicao !== -1) {
    carrinho.value.splice(posicao, 1)
    salvarCarrinho()
  }
}

function totalCarrinho() {
  let total = 0

  for (let i = 0; i < carrinho.value.length; i++) {
    total = total + carrinho.value[i].preco
  }

  return total
}

function limparCarrinho() {
  carrinho.value = []
  selecionados.value = []
  salvarCarrinho()
}

function selecionarProduto(idItem) {
  const posicao = selecionados.value.indexOf(idItem)

  if (posicao === -1) {
    selecionados.value.push(idItem)
  } else {
    selecionados.value.splice(posicao, 1)
  }
}

export { ultimoProdAdd, mostrarAviso, carrinho, addCarrinho, removerCarrinho, totalCarrinho, limparCarrinho, selecionarProduto, selecionados, carregarCarrinho, salvarCarrinho }

