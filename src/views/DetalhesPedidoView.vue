<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_URL = 'http://localhost:3000'

const route = useRoute()
const router = useRouter()

const pedido = ref(null)
const carregando = ref(false)

const editandoEndereco = ref(false)
const enderecoEditado = ref({
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  complemento: '',
})

async function carregarPedido() {
  carregando.value = true
  const erro = ref('')

  const idPedido = route.params.id
  const resposta = await fetch(`${API_URL}/pedidos/${idPedido}`)

  if (!resposta.ok) {
    erro.value = 'Não foi possível encontrar este pedido.'
    carregando.value = false
    return
  }

  pedido.value = await resposta.json()
  carregando.value = false
}

function editarEndereco() {
  enderecoEditado.value = {
    cep: pedido.value.endereco.cep,
    rua: pedido.value.endereco.rua,
    numero: pedido.value.endereco.numero,
    bairro: pedido.value.endereco.bairro,
    complemento: pedido.value.endereco.complemento || '',
  }

  editandoEndereco.value = true
}

async function atualizarPedido() {
  const idPedido = route.params.id
  carregando.value = true

  const resposta = await fetch(`${API_URL}/pedidos/${idPedido}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endereco: enderecoEditado.value,
    }),
  })

  if (!resposta.ok) {
    alert('Não foi possível atualizar o endereço. Tente novamente.')
    carregando.value = false
    return
  }

  pedido.value = await resposta.json()
  editandoEndereco.value = false

  carregando.value = false
  alert('Endereço atualizado com sucesso!')
}

async function excluirPedido() {
  const confirmar = window.confirm('Tem certeza de que deseja excluir este pedido?')

  if (!confirmar) {
    return
  }

  const idPedido = route.params.id
  carregando.value = true

  const resposta = await fetch(`${API_URL}/pedidos/${idPedido}`, {
    method: 'DELETE',
  })

  if (!resposta.ok) {
    alert('Não foi possível excluir o pedido. Tente novamente.')
    carregando.value = false
    return
  }

  carregando.value = false
  alert('Pedido excluído com sucesso!')

  if (resposta.ok) {
    router.push('/pedidos')
  }
}

onMounted(() => {
  carregarPedido()
})
</script>

<template>
  <main class="detalhes-pedido">
    <div class="conteudo-detalhes">
      <RouterLink to="/pedidos" class="voltar"> ← Meus pedidos </RouterLink>

      <h1>Detalhes do Pedido</h1>

      <p v-if="carregando" class="mensagem">Carregando pedido...</p>

      <p v-else-if="erro" class="mensagem erro">
        {{ erro }}
      </p>

      <div v-else-if="pedido" class="conteudo-pedido">
        <section class="resumo-cabecalho">
          <div>
            <p class="identificacao">PEDIDO #{{ pedido.id }}</p>
            <h2>Seu pedido</h2>
            <p class="data">Realizado em {{ new Date(pedido.data).toLocaleDateString('pt-BR') }}</p>
          </div>

          <span class="status">{{ pedido.status }}</span>
        </section>

        <section class="secao">
          <h3>Produtos do pedido</h3>

          <div class="lista-produtos">
            <div v-for="produto in pedido.produtos" :key="produto.id" class="produto">
              <img :src="produto.imagem" :alt="produto.titulo" />

              <div class="info-produto">
                <h4>{{ produto.titulo }}</h4>
                <p>R$ {{ produto.preco.toFixed(2).replace('.', ',') }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="secao">
          <div class="titulo-secao">
            <h3>Endereço de entrega</h3>

            <button
              v-if="!editandoEndereco"
              class="botao-editar"
              type="button"
              @click="editarEndereco"
            >
              Editar endereço
            </button>
          </div>

          <div v-if="!editandoEndereco" class="informacoes-endereco">
            <p>{{ pedido.endereco.rua }}, {{ pedido.endereco.numero }}</p>
            <p>{{ pedido.endereco.bairro }} - CEP: {{ pedido.endereco.cep }}</p>

            <p v-if="pedido.endereco.complemento">Complemento: {{ pedido.endereco.complemento }}</p>
          </div>

          <div v-else class="formulario-endereco">
            <div class="campo">
              <label>CEP</label>
              <input v-model="enderecoEditado.cep" type="text" />
            </div>

            <div class="campo">
              <label>Rua</label>
              <input v-model="enderecoEditado.rua" type="text" />
            </div>

            <div class="campos-duplos">
              <div class="campo">
                <label>Número</label>
                <input v-model="enderecoEditado.numero" type="text" />
              </div>

              <div class="campo">
                <label>Bairro</label>
                <input v-model="enderecoEditado.bairro" type="text" />
              </div>
            </div>

            <div class="campo">
              <label>Complemento</label>
              <input v-model="enderecoEditado.complemento" type="text" />
            </div>

            <div class="botoes-endereco">
              <button class="botao-principal" type="button" @click="atualizarPedido">
                Salvar alterações
              </button>

              <button class="botao-cancelar" type="button" @click="editandoEndereco = false">
                Cancelar
              </button>
            </div>
          </div>
        </section>

        <section class="secao pagamento">
          <h3>Pagamento</h3>

          <div class="linha-pagamento">
            <p>Forma de pagamento</p>
            <span>{{ pedido.metodoPagamento }}</span>
          </div>

          <div class="linha-total">
            <span>Total do pedido</span>
            <strong>R$ {{ pedido.total.toFixed(2).replace('.', ',') }}</strong>
          </div>
        </section>

        <div class="acoes-pedido">
          <button class="botao-excluir" type="button" @click="excluirPedido">Cancelar pedido</button>

          <RouterLink to="/pedidos" class="botao-voltar"> Voltar aos pedidos </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.detalhes-pedido {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 40px 0 55px;
  box-sizing: border-box;
  background-color: #fcf5eb;
  color: black;
  font-family: 'Google Sans Flex', sans-serif;
}

.conteudo-detalhes {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
}

/* Voltar */

.voltar {
  display: inline-block;
  margin-bottom: 25px;
  color: #c00b63;
  font-size: 1rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.voltar:hover {
  opacity: 0.65;
}

/* Título */

.detalhes-pedido h1 {
  margin: 0 0 32px;
  font-family: 'Marcellus', sans-serif;
  font-size: 2.7rem;
  font-weight: 400;
}

/* Conteúdo do pedido */

.conteudo-pedido {
  border: 1px solid #e5d5dc;
  border-radius: 5px;
  background-color: #fffdf9;
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.07);
}

/* Cabeçalho */

.resumo-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 27px 30px;
  border-bottom: 1px solid #eee4e5;
}

.identificacao {
  margin: 0 0 8px;
  color: #c00b63;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.resumo-cabecalho h2 {
  margin: 0 0 7px;
  font-family: 'Marcellus', sans-serif;
  font-size: 1.8rem;
  font-weight: 400;
}

.data {
  margin: 0;
  color: #777;
  font-size: 0.95rem;
}

.status {
  padding: 8px 14px;
  border-radius: 20px;
  background-color: #f8e4ed;
  color: #c00b63;
  font-size: 0.9rem;
}

/* Seções */

.secao {
  padding: 28px 30px;
  border-bottom: 1px solid #eee4e5;
}

.secao h3 {
  margin: 0 0 22px;
  font-family: 'Marcellus', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
}

.titulo-secao {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.titulo-secao h3 {
  margin-bottom: 20px;
}

/* Produtos */

.lista-produtos {
  display: flex;
  flex-direction: column;
}

.produto {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #f0e8e8;
}

.produto:first-child {
  padding-top: 0;
}

.produto:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.produto img {
  width: 95px;
  height: 110px;
  object-fit: cover;
  border-radius: 4px;
}

.info-produto h4 {
  margin: 0 0 10px;
  font-size: 1.05rem;
  font-weight: 500;
}

.info-produto p {
  margin: 0;
  color: #c00b63;
  font-size: 1rem;
}

/* Endereço */

.informacoes-endereco p {
  margin: 0 0 10px;
  color: #555;
  font-size: 1rem;
  line-height: 1.5;
}

.informacoes-endereco p:last-child {
  margin-bottom: 0;
}

/* Botão editar */

.botao-editar {
  padding: 8px 13px;
  border: 1px solid #c00b63;
  border-radius: 4px;
  background-color: transparent;
  color: #c00b63;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.botao-editar:hover {
  background-color: #c00b63;
  color: white;
}

/* Formulário de endereço */

.formulario-endereco {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.campo label {
  color: #555;
  font-size: 0.95rem;
}

.campo input {
  width: 100%;
  padding: 11px 12px;
  box-sizing: border-box;
  border: 1px solid #d8cdd0;
  border-radius: 4px;
  background-color: white;
  color: #333;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.campo input:focus {
  border-color: #c00b63;
}

.campos-duplos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.botoes-endereco {
  display: flex;
  gap: 12px;
  margin-top: 5px;
}

.botao-principal,
.botao-cancelar {
  padding: 11px 17px;
  border: 1px solid #c00b63;
  border-radius: 4px;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.botao-principal {
  background-color: #c00b63;
  color: white;
}

.botao-principal:hover {
  background-color: #a80959;
}

.botao-cancelar {
  background-color: transparent;
  color: #c00b63;
}

.botao-cancelar:hover {
  background-color: #f8e4ed;
}

/* Pagamento e total */

.pagamento h3 {
  margin-bottom: 20px;
}

.linha-pagamento,
.linha-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.linha-pagamento p {
  margin: 0;
  color: #666;
}

.linha-pagamento span {
  color: #333;
}

.linha-total {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #eee4e5;
}

.linha-total span {
  font-size: 1.1rem;
}

.linha-total strong {
  color: #c00b63;
  font-size: 1.35rem;
}

/* Ações */

.acoes-pedido {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 23px 30px;
}

.botao-excluir {
  padding: 10px 14px;
  border: 1px solid #c00b63;
  border-radius: 4px;
  background-color: transparent;
  color: #c00b63;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.botao-excluir:hover {
  background-color: #c00b63;
  color: white;
}

.botao-voltar {
  padding: 11px 16px;
  border-radius: 4px;
  background-color: #c00b63;
  color: white;
  font-size: 0.95rem;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.botao-voltar:hover {
  background-color: #a80959;
}

/* Mensagens */

.mensagem {
  padding: 35px 15px;
  color: #555;
  text-align: center;
  font-size: 1.1rem;
}

.erro {
  color: #b3261e;
}

/* Tablets */

@media (max-width: 768px) {
  .conteudo-detalhes {
    padding: 0 25px;
  }

  .detalhes-pedido h1 {
    font-size: 2.3rem;
  }

  .resumo-cabecalho,
  .secao {
    padding: 23px;
  }

  .acoes-pedido {
    padding: 20px 23px;
  }
}

/* Celulares */

@media (max-width: 480px) {
  .detalhes-pedido {
    padding: 28px 0 40px;
  }

  .conteudo-detalhes {
    padding: 0 16px;
  }

  .detalhes-pedido h1 {
    font-size: 2rem;
    margin-bottom: 25px;
  }

  .resumo-cabecalho {
    align-items: flex-start;
    flex-direction: column;
    padding: 22px 18px;
  }

  .resumo-cabecalho h2 {
    font-size: 1.6rem;
  }

  .secao {
    padding: 22px 18px;
  }

  .secao h3 {
    font-size: 1.35rem;
  }

  .produto {
    gap: 13px;
  }

  .produto img {
    width: 75px;
    height: 90px;
  }

  .titulo-secao {
    align-items: flex-start;
    flex-direction: column;
  }

  .campos-duplos {
    grid-template-columns: 1fr;
  }

  .linha-pagamento,
  .linha-total {
    align-items: flex-start;
  }

  .acoes-pedido {
    align-items: stretch;
    flex-direction: column-reverse;
    padding: 20px 18px;
  }

  .botao-excluir,
  .botao-voltar {
    width: 100%;
    box-sizing: border-box;
  }

  .botoes-endereco {
    flex-direction: column;
  }
}
</style>
