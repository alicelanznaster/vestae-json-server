<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = 'http://localhost:3000'

const router = useRouter()

const pedidos = ref([])
const carregando = ref(false)
const erro = ref('')

const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')

async function carregarPedidos() {
  carregando.value = true
  erro.value = ''

  const resposta = await fetch(`${API_URL}/pedidos?usuarioEmail=${usuario.email}`)

  if (!resposta.ok) {
    erro.value = 'Não foi possível carregar seus pedidos.'
    carregando.value = false
    return
  }

  pedidos.value = await resposta.json()

  carregando.value = false
}

onMounted(() => {
  if (!usuario) {
    router.push('/login')
    return
  }

  carregarPedidos()
})
</script>

<template>
  <main class="pagina-pedidos">
    <div class="conteudo-pedidos">
      <h1>Meus Pedidos</h1>
      <p class="subtitulo">Acompanhe suas compras realizadas no VESTÆ</p>

      <p v-if="carregando" class="mensagem">Carregando seus pedidos...</p>

      <p v-else-if="erro" class="mensagem erro">
        {{ erro }}
      </p>

      <div v-else-if="pedidos.length === 0" class="vazio">
        <p>Você ainda não realizou nenhum pedido.</p>
        <RouterLink to="/produtos">Explorar produtos</RouterLink>
      </div>

      <div v-else class="lista-pedidos">
        <div v-for="pedido in pedidos" :key="pedido.id" class="card-pedido">
          <div class="cabecalho-pedido">
            <div>
              <h2>Pedido #{{ pedido.id }}</h2>
              <p class="data">
                Realizado em {{ new Date(pedido.data).toLocaleDateString('pt-BR') }}
              </p>
            </div>

            <span class="status">{{ pedido.status }}</span>
          </div>

          <div class="produtos-pedido">
            <div v-for="produto in pedido.produtos" :key="produto.id" class="produto-pedido">
              <img :src="produto.imagem" :alt="produto.titulo" />

              <div class="info-produto">
                <h3>{{ produto.titulo }}</h3>
                <p>R$ {{ produto.preco.toFixed(2).replace('.', ',') }}</p>
              </div>
            </div>
          </div>

          <div class="rodape-pedido">
            <div class="resumo-pedido">
              <p>Pagamento: {{ pedido.metodoPagamento }}</p>
              <strong>Total: R$ {{ pedido.total.toFixed(2).replace('.', ',') }}</strong>
            </div>

            <RouterLink :to="`/pedidos/${pedido.id}`" class="botao-detalhes">
              Ver detalhes
              <span>→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.pagina-pedidos {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 40px 0 50px;
  box-sizing: border-box;
  background-color: #fcf5eb;
  color: black;
  font-family: 'Google Sans Flex', sans-serif;
}

.conteudo-pedidos {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
}

.pagina-pedidos h1 {
  margin: 0 0 8px;
  font-family: 'Marcellus', sans-serif;
  font-size: 2.8rem;
  font-weight: 400;
}

.subtitulo {
  margin: 0 0 38px;
  color: #666;
  font-size: 1.15rem;
}

.lista-pedidos {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.card-pedido {
  padding: 25px;
  border: 1px solid #e5d5dc;
  border-radius: 5px;
  background-color: #fffdf9;
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.08);
}

.cabecalho-pedido {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee4e5;
}

.cabecalho-pedido h2 {
  margin: 0 0 7px;
  font-family: 'Marcellus', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
}

.data {
  margin: 0;
  color: #777;
  font-size: 0.95rem;
}

.status {
  padding: 8px 13px;
  border-radius: 20px;
  background-color: #f8e4ed;
  color: #c00b63;
  font-size: 0.9rem;
  font-weight: 500;
}

.produtos-pedido {
  display: flex;
  flex-direction: column;
}

.produto-pedido {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 0;
  border-bottom: 1px solid #f0e8e8;
}

.produto-pedido img {
  width: 85px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.info-produto h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  font-weight: 500;
}

.info-produto p {
  margin: 0;
  color: #c00b63;
  font-size: 1rem;
}

.rodape-pedido {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 20px;
}

.resumo-pedido p {
  margin: 0 0 9px;
  color: #555;
  font-size: 0.95rem;
}

.resumo-pedido strong {
  color: #c00b63;
  font-size: 1.1rem;
}

.botao-detalhes {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 160px;
  padding: 12px 18px;
  border: 1px solid #c00b63;
  border-radius: 4px;
  background-color: #c00b63;
  color: white;
  font-size: 1rem;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.botao-detalhes:hover {
  background-color: #a80959;
  transform: translateY(-2px);
}

.botao-detalhes span {
  font-size: 1.3rem;
}

.vazio {
  text-align: center;
  padding: 50px 20px;
  color: rgb(68, 68, 68);
}

.vazio a {
  display: inline-block;
  margin-top: 15px;
  color: #c00b63;
}

.botao-explorar {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 4px;
  background-color: #c00b63;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.botao-explorar:hover {
  background-color: #a80959;
}

.mensagem {
  padding: 25px;
  color: #555;
  text-align: center;
  font-size: 1.1rem;
}

.erro {
  color: #b3261e;
}

/* Tablets */
@media (max-width: 768px) {
  .conteudo-pedidos {
    padding: 0 25px;
  }

  .pagina-pedidos h1 {
    font-size: 2.3rem;
  }

  .card-pedido {
    padding: 20px;
  }

  .botao-detalhes {
    min-width: 140px;
  }
}

/* Celulares */
@media (max-width: 480px) {
  .pagina-pedidos {
    padding: 30px 0 40px;
  }

  .conteudo-pedidos {
    padding: 0 18px;
  }

  .pagina-pedidos h1 {
    font-size: 2rem;
  }

  .subtitulo {
    font-size: 1rem;
    margin-bottom: 28px;
  }

  .card-pedido {
    padding: 17px;
  }

  .cabecalho-pedido {
    align-items: flex-start;
    flex-direction: column;
  }

  .produto-pedido {
    gap: 13px;
  }

  .produto-pedido img {
    width: 70px;
    height: 85px;
  }

  .rodape-pedido {
    align-items: stretch;
    flex-direction: column;
  }

  .botao-detalhes {
    width: 100%;
  }

  .vazio {
    padding: 40px 15px;
  }
}
</style>
