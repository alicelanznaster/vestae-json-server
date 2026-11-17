<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import ProductCard from '@/components/products/ProductCard.vue'
import { carregarFavoritos } from '@/utils/favoritesUtils'
import { carregarModo, trocarModo } from '@/utils/modoUtils'
import { formataPreco } from '@/utils/currencyUtils'

const router = useRouter()
const usuario = ref(null)
const fotoPerfil = ref(null)
const inputFile = ref(null)
const produtos = ref([])
const editandoNome = ref(false)
const novoNome = ref('')

const modoAtivo = ref('comprador')
const produtosFavoritos = ref([])
const produtosPedidos = ref([])
const compradores = ref([])
const API_URL = 'http://localhost:3000'

// pega o usuário que ta logado
function carregarUsuario() {
  const salvo = localStorage.getItem('usuarioLogado')

  if (salvo) {
    usuario.value = JSON.parse(salvo)
  } else {
    usuario.value = null
  }
}

function sair() {
  localStorage.removeItem('usuarioLogado')
  router.push('/login')
}

function editarNome() {
  novoNome.value = usuario.value?.nome || ''
  editandoNome.value = true
}

function cancelarEdicaoNome() {
  editandoNome.value = false
}

async function salvarNome() {
  const nome = novoNome.value.trim()

  if (!nome) {
    alert('O nome não pode ficar vazio.')
    return
  }

  const resposta = await fetch(`${API_URL}/usuarios/${usuario.value.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: nome }),
  })

  if (!resposta.ok) {
    alert('Erro ao atualizar o nome!')
    return
  }

  const usuarioAtualizado = await resposta.json()

  usuario.value = usuarioAtualizado
  localStorage.setItem('usuarioLogado', JSON.stringify(usuario.value))
  editandoNome.value = false
}

// pega o modo ativo do usuário no JSON Server
async function atualizarModo() {
  const usuarioAtualizado = await carregarModo(usuario.value)

  if (usuarioAtualizado) {
    usuario.value = usuarioAtualizado
    modoAtivo.value = usuarioAtualizado.modoAtivo || usuarioAtualizado.tipoPerfil
  }
}

async function alterarModo(modo) {
  const usuarioAtualizado = await trocarModo(usuario.value, modo)

  if (!usuarioAtualizado) {
    alert('Erro ao trocar o modo!')
    return
  }

  usuario.value = usuarioAtualizado
  modoAtivo.value = usuarioAtualizado.modoAtivo
}

async function carregarProdutos() {
  if (!usuario.value) {
    produtos.value = []
    return
  }

  try {
    const resposta = await fetch(`${API_URL}/produtos`)

    if (!resposta.ok) {
      throw new Error('Erro ao buscar produtos.')
    }

    const todosProdutos = await resposta.json()

    produtos.value = todosProdutos.filter((produto) => produto.email === usuario.value.email)
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro)
  }
}

// carrega os produtos dos pedidos do usuário
async function carregarProdutosPedidos() {
  if (!usuario.value) return

  const resposta = await fetch(`${API_URL}/pedidos`)
  const pedidos = await resposta.json()

  produtosPedidos.value = []

  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].usuarioEmail === usuario.value.email) {
      for (let j = 0; j < pedidos[i].produtos.length; j++) {
        produtosPedidos.value.push(pedidos[i].produtos[j])
      }
    }
  }
}

// carrega quem comprou os produtos do vendedor
async function carregarCompradores() {
  if (!usuario.value) return

  const resposta = await fetch(`${API_URL}/pedidos`)
  const pedidos = await resposta.json()

  compradores.value = []

  for (let i = 0; i < pedidos.length; i++) {
    for (let j = 0; j < pedidos[i].produtos.length; j++) {
      const produto = pedidos[i].produtos[j]

      if (produto.email === usuario.value.email) {
        let comprador = null

        for (let k = 0; k < compradores.value.length; k++) {
          if (compradores.value[k].email === pedidos[i].usuarioEmail) {
            comprador = compradores.value[k]
          }
        }

        if (comprador) {
          comprador.quantidade++
          comprador.total += produto.preco
        } else {
          compradores.value.push({
            email: pedidos[i].usuarioEmail,
            nome: pedidos[i].usuarioNome,
            quantidade: 1,
            total: produto.preco,
          })
        }
      }
    }
  }
}

// carrega os produtos favoritos do usuário
async function carregarFavoritosPerfil() {
  if (!usuario.value) {
    produtosFavoritos.value = []
    return
  }

  try {
    const resposta = await fetch(`${API_URL}/produtos`)
    const todosProdutos = await resposta.json()

    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || {}
    const favoritosUsuario = favoritos[usuario.value.id] || []
    produtosFavoritos.value = []

    for (let i = 0; i < todosProdutos.length; i++) {
      for (let j = 0; j < favoritosUsuario.length; j++) {
        if (String(todosProdutos[i].id) === String(favoritosUsuario[j])) {
          todosProdutos[i].favorito = true
          produtosFavoritos.value.push(todosProdutos[i])
        }
      }
    }
  } catch (erro) {
    console.error('Erro ao carregar favoritos do perfil:', erro)
  }
}

// pega a foto de perfil salva
function carregarFoto() {
  if (!usuario.value) return
  const salva = localStorage.getItem(`vestae-foto-${usuario.value.email}`)
  if (salva) fotoPerfil.value = salva
}

// pega a inicial do nome do usuário
const inicial = computed(() => {
  return usuario.value?.nome?.trim().charAt(0).toUpperCase() || ''
})

// conta quantos produtos foram anunciados
const quantidadeProdutos = computed(() => produtos.value.length)

// abre o seletor de arquivos quando clica no avatar
function abrirSeletorDeArquivo() {
  inputFile.value.click()
}

// le a imagem e salva no localStorage
function selecionarFoto(evento) {
  const arquivo = evento.target.files?.[0]
  if (!arquivo) return

  const leitor = new FileReader()
  leitor.onload = () => {
    fotoPerfil.value = String(leitor.result)
    localStorage.setItem(`vestae-foto-${usuario.value.email}`, fotoPerfil.value)
  }
  leitor.readAsDataURL(arquivo)
}

// carrega os dados do perfil quando a página abre
onMounted(() => {
  carregarUsuario()
  atualizarModo()
  carregarProdutos()
  carregarProdutosPedidos()
  carregarCompradores()
  carregarFavoritosPerfil()
  carregarFavoritos()
  carregarFoto()
})
</script>

<template>
  <main class="perfil">
    <div class="conteudo-perfil">
      <section class="cabecalho">
        <button class="avatar" type="button" @click="abrirSeletorDeArquivo">
          <img v-if="fotoPerfil" :src="fotoPerfil" alt="Foto de perfil" class="foto" />

          <span v-else-if="inicial" class="inicial">
            {{ inicial }}
          </span>

          <img v-else src="/icons/user-circle.svg" alt="Usuário" class="icone-usuario" />
        </button>

        <input
          type="file"
          ref="inputFile"
          @change="selecionarFoto"
          accept="image/png, image/jpeg, image/webp"
          class="input-oculto"
        />

        <div class="info">
          <div v-if="!editandoNome" class="nome-perfil">
            <button class="nome" type="button" @click="editarNome">
              {{ usuario?.nome || 'Meu Perfil' }}
            </button>
          </div>
          <div v-else class="edicao-nome">
            <input v-model="novoNome" type="text" maxlength="50" @keyup.enter="salvarNome" />

            <div class="botoes-edicao">
              <button type="button" @click="salvarNome">Salvar</button>

              <button type="button" class="botao-cancelar" @click="cancelarEdicaoNome">
                Cancelar
              </button>
            </div>
          </div>

          <p class="quantidade">
            {{ quantidadeProdutos }}
            {{ quantidadeProdutos === 1 ? 'peça anunciada' : 'peças anunciadas' }}
          </p>
        </div>
        <div class="botoes-perfil">
          <button class="botao-sair" type="button" @click="sair">
            <img src="/icons/exit.svg" alt="Sair" class="sair" />
          </button>
          <RouterLink to="/configuracoes" class="botao-config">
            <img src="/icons/configuracoes.svg" alt="configuracoes" class="configuracoes" />
          </RouterLink>
        </div>
      </section>
      <section class="alternancia-modo">
        <p>Como deseja utilizar o Vestæ?</p>

        <div class="barra-modos">
          <button
            type="button"
            :class="{ ativo: modoAtivo === 'comprador' }"
            @click="alterarModo('comprador')"
          >
            Comprar
          </button>

          <button
            type="button"
            :class="{ ativo: modoAtivo === 'vendedor' }"
            @click="alterarModo('vendedor')"
          >
            Vender
          </button>
        </div>
      </section>
      <hr class="divisoria" />

      <section v-if="modoAtivo === 'vendedor'" class="impacto">
        <h2>
          <img src="/icons/reciclagem.svg" alt="" class="icone-reciclagem" />
          Seu Impacto
        </h2>

        <p class="destaque">
          <span class="numero">
            {{ quantidadeProdutos }}
            {{ quantidadeProdutos === 1 ? 'peça anunciada' : 'peças anunciadas' }}
          </span>
          no VESTÆ
        </p>

        <p v-if="quantidadeProdutos > 0" class="texto">
          Você está contribuindo para que roupas continuem circulando em vez de serem descartadas.
        </p>

        <p v-else class="texto">
          Comece a anunciar suas peças e ajude roupas a continuarem circulando em vez de serem
          descartadas.
        </p>
      </section>

      <section v-if="modoAtivo === 'vendedor'" class="produtos">
        <h2>Meus produtos</h2>

        <div v-if="produtos.length > 0" class="lista-produtos">
          <ProductCard
            v-for="produto in produtos"
            :key="produto.id"
            :produto="produto"
            :mostrarFavorito="false"
          />
        </div>

        <div v-else class="pedidos-vazios">
          <p>Você ainda não anunciou nenhum produto.</p>
          <RouterLink :to="'/anunciar'" class="anunciar"> Anunciar agora </RouterLink>
        </div>
      </section>

      <section v-if="modoAtivo === 'vendedor'" class="compradores">
        <h2>Meus compradores</h2>

        <div v-if="compradores.length > 0" class="lista-compradores">
          <div v-for="comprador in compradores" :key="comprador.email" class="item-comprador">
            <div class="dados-comprador">
              <div class="avatar-comprador">
                <img src="/icons/user-circle.svg" alt="Usuário" />
              </div>

              <div>
                <h3>{{ comprador.nome }}</h3>
                <p>Compradora</p>
              </div>
            </div>

            <div class="informacoes-comprador">
              <div>
                <span>Peças compradas</span>
                <strong>
                  {{ comprador.quantidade }}
                  {{ comprador.quantidade === 1 ? 'peça' : 'peças' }}
                </strong>
              </div>

              <div>
                <span>Valor total</span>
                <strong>{{ formataPreco(comprador.total) }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="pedidos-vazios">
          <p>Você ainda não vendeu nenhuma peça.</p>
        </div>
      </section>

      <section v-if="modoAtivo === 'comprador'" class="comprador">
        <div class="pedidos">
          <div class="info-pedidos">
            <h2>Meus Pedidos</h2>
            <p>Acompanhe suas compras, consulte os detalhes e veja o andamento dos seus pedidos.</p>
            <div class="lista-pedidos">
              <ProductCard
                v-for="produto in produtosPedidos"
                :key="produto.id"
                :produto="produto"
                :mostrarFavorito="false"
              />
            </div>
          </div>

          <RouterLink to="/pedidos" class="botao-pedidos">
            Ver meus pedidos <span>→</span>
          </RouterLink>
        </div>

        <div class="favoritos">
          <h2>Meus favoritos</h2>

          <div v-if="produtosFavoritos.length > 0" class="lista-produtos">
            <ProductCard
              v-for="produto in produtosFavoritos"
              :key="produto.id"
              :produto="produto"
            />
          </div>

          <div v-else class="pedidos-vazios">
            <p>Você ainda não tem produtos favoritos.</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.perfil {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 35px 0 45px;
  box-sizing: border-box;
  background-color: #fcf5eb;
  color: black;
}

.conteudo-perfil {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 50px;
  box-sizing: border-box;
}

.cabecalho {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 0 15px 52px;
}

.avatar {
  width: 180px;
  height: 180px;
  min-width: 140px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: #78033285;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar:hover {
  opacity: 0.9;
}

.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inicial {
  color: #fcf5eb;
  font-family: 'Marcellus', sans-serif;
  font-size: 4.5rem;
}

.icone-usuario {
  width: 110%;
  height: 110%;
  object-fit: contain;
  background-color: #f6c3d885;
}

.nome {
  margin: 0 0 7px;
  padding: 0;
  border: none;
  background: none;
  color: black;
  font-family: 'Marcellus', sans-serif;
  font-size: 3rem;
  font-weight: 400;
  cursor: pointer;
  text-align: left;
}

.nome:hover {
  opacity: 0.6;
}

.edicao-nome {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 7px;
}

.edicao-nome input {
  width: 280px;
  padding: 8px 10px;
  border: 1px solid #d3cec8;
  border-radius: 6px;
  background-color: white;
  font-family: 'Marcellus', sans-serif;
  font-size: 2rem;
  outline: none;
}

.edicao-nome input:focus {
  border-color: #c40c6c;
}

.botoes-edicao {
  display: flex;
  gap: 10px;
}

.edicao-nome button {
  padding: 9px 14px;
  border: none;
  border-radius: 6px;
  background-color: #c40c6c;
  color: white;
  font-family: 'Marcellus', sans-serif;
  font-size: 1.4rem;
  cursor: pointer;
}

.botao-cancelar {
  background-color: transparent !important /* important serve para o botão cancelar não ficar com o css do edicao-nome, e sim do botao-cancelar como prioridade*/;
  color: #c40c6c !important;
  border: 1px solid #c40c6c !important;
}

.edicao-nome button:hover {
  opacity: 0.8;
}

.quantidade {
  margin: 0;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.4rem;
  color: #555;
}

.botoes-perfil {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
  align-self: flex-start;
}

.botao-sair,
.botao-config {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.sair,
.configuracoes {
  width: 32px;
  height: 32px;
}

.botao-sair:hover,
.botao-config:hover {
  opacity: 0.6;
}

.input-oculto {
  display: none;
}

.alternancia-modo {
  margin: 0 auto 45px;
  text-align: center;
}

.alternancia-modo p {
  margin-bottom: 15px;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.3rem;
  color: #555;
}

.barra-modos {
  display: flex;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 5px;
  border: 1px solid #d3cec8;
  border-radius: 30px;
  background-color: #f1e4d3;
}

.barra-modos button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 25px;
  background-color: transparent;
  color: #555;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.2s;
}

.barra-modos button.ativo {
  background-color: #c40c6c;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
}

.barra-modos button:hover {
  opacity: 0.85;
}

.divisoria {
  border: none;
  border-top: 2px solid #f1e4d3;
  margin: 0 0 50px;
}

.impacto {
  width: 100%;
  max-width: 640px;
  margin-bottom: 60px;
  padding: 24px 22px;
  box-sizing: border-box;
  border: 1px solid #d3cec8;
  border-radius: 4px;
  box-shadow: 2px 3px 4px rgba(0, 0, 0, 0.12);
  background-color: #fcf5eb;
}

.pedidos {
  width: 100%;
  max-width: 640px;
  margin: 0 auto 58px;
  padding: 24px 22px;
  box-sizing: border-box;
  border: 1px solid #d3cec8;
  border-radius: 4px;
  box-shadow: 2px 3px 4px rgba(0, 0, 0, 0.12);
  background-color: #fcf5eb;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.info-pedidos h2 {
  font-family: 'Marcellus', sans-serif;
  font-size: 2rem;
  font-weight: 400;
}

.info-pedidos p {
  margin-bottom: 15px;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.1rem;
  line-height: 1.25;
  color: #555;
}

.lista-pedidos {
  display: flex;
  gap: 15px;
  pointer-events: none;
}

.lista-pedidos .card {
  width: 160px;
}

.lista-pedidos :deep(h3) {
  font-size: 14px;
}

.lista-pedidos :deep(.preco) {
  font-size: 16px;
}

.lista-pedidos :deep(.card:hover) {
  transform: none;
}

.botao-pedidos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 175px;
  padding: 10px 17px;
  box-sizing: border-box;
  border: 1px solid #c40c6c;
  border-radius: 4px;
  background-color: #c40c6c;
  color: white;
  font-family: 'Google Sans Flex', sans-serif;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.botao-pedidos:hover {
  background-color: #a80959;
}

.botao-pedidos span {
  font-size: 1.3rem;
}

.impacto h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 23px;
  font-family: 'Marcellus', sans-serif;
  font-size: 2rem;
  font-weight: 400;
}

.icone-reciclagem {
  width: 30px;
  height: 30px;
}

.destaque {
  margin: 0 0 19px;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.45rem;
  line-height: 1.4;
}

.numero {
  color: #d41462;
}

.texto {
  margin: 0;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.4rem;
  line-height: 1.45;
}

.produtos h2 {
  margin: 0 0 30px 8px;
  font-family: 'Marcellus', sans-serif;
  font-size: 2.4rem;
  font-weight: 400;
}

.lista-produtos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.lista-produtos :deep(.card) {
  width: 100%;
  min-width: 0;
}

.comprador h2 {
  margin: 0 0 25px 8px;
  font-family: 'Marcellus', sans-serif;
  font-size: 2.4rem;
  font-weight: 400;
}

.pedidos-vazios {
  display: flex;
  gap: 10px;
  padding: 30px 20px;
  margin-bottom: 55px;
  border: 1px solid #d3cec8;
  box-shadow: 2px 3px 4px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  text-align: center;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.2rem;
  color: #555;
  max-width: 640px;
}

.anunciar {
  color: #a80959;
}

.favoritos h2 {
  margin-bottom: 30px;
}

.compradores {
  width: 100%;
  max-width: 640px;
}

.compradores h2 {
  margin-bottom: 30px;
  font-family: 'Marcellus', sans-serif;
  font-size: 2.4rem;
  font-weight: 400;
}

.lista-compradores {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.item-comprador {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border: 1px solid #d3cec8;
  border-radius: 5px;
  background-color: #fcf5eb;
  box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.08);
}

.dados-comprador {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5ded5;
}

.avatar-comprador {
  width: 50px;
  height: 50px;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f1e4d3;
}

.avatar-comprador img {
  width: 32px;
  height: 32px;
}

.dados-comprador h3 {
  margin: 0;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
}

.dados-comprador p {
  margin: 0;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 0.95rem;
  color: #777;
}

.informacoes-comprador {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.informacoes-comprador div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.informacoes-comprador span {
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1rem;
  color: #555;
}

.informacoes-comprador strong {
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .perfil {
    padding: 32px 0 40px;
  }

  .conteudo-perfil {
    max-width: 650px;
    padding: 0 45px;
  }

  .cabecalho {
    gap: 28px;
    padding-bottom: 48px;
  }

  .avatar {
    width: 135px;
    height: 135px;
    min-width: 135px;
  }

  .inicial {
    font-size: 4.3rem;
  }

  .nome {
    font-size: 2.3rem;
  }
  .edicao-nome input {
    width: 220px;
    font-size: 1.8rem;
  }

  .edicao-nome button {
    font-size: 1.4rem;
  }

  .quantidade {
    font-size: 1.15rem;
  }

  .sair {
    width: 28px;
    height: 28px;
  }

  .impacto {
    max-width: 500px;
  }

  .impacto h2 {
    font-size: 1.9rem;
  }

  .destaque {
    font-size: 1.15rem;
  }

  .texto {
    font-size: 1.1rem;
  }

  .produtos h2 {
    font-size: 2rem;
  }

  .lista-produtos {
    gap: 17px;
  }
}

@media (max-width: 768px) {
  .perfil {
    padding: 30px 0 38px;
  }

  .conteudo-perfil {
    max-width: 620px;
    padding: 0 35px;
  }

  .cabecalho {
    gap: 25px;
    padding: 0 10px 42px;
  }

  .avatar {
    width: 125px;
    height: 125px;
    min-width: 125px;
  }

  .inicial {
    font-size: 4rem;
  }

  .nome {
    font-size: 2.1rem;
  }

  .edicao-nome input {
    width: 190px;
    font-size: 1.6rem;
  }

  .edicao-nome button {
    font-size: 1.2rem;
  }

  .quantidade {
    font-size: 1.1rem;
  }

  .botao-sair {
    margin-top: 5px;
  }

  .sair {
    width: 28px;
    height: 28px;
  }

  .divisoria {
    margin-bottom: 42px;
  }

  .impacto {
    max-width: 100%;
    padding: 22px;
    margin-bottom: 48px;
  }

  .impacto h2 {
    font-size: 1.8rem;
  }

  .destaque {
    font-size: 1.1rem;
  }

  .texto {
    font-size: 1rem;
  }

  .produtos h2 {
    margin-left: 5px;
    margin-bottom: 32px;
    font-size: 1.9rem;
  }

  .pedidos {
    padding: 22px;
    gap: 15px;
  }

  .info-pedidos h2 {
    font-size: 1.8rem;
  }

  .info-pedidos p {
    font-size: 1rem;
  }

  .botao-pedidos {
    min-width: 145px;
    padding: 11px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .perfil {
    padding: 25px 0 32px;
  }

  .conteudo-perfil {
    max-width: 100%;
    padding: 0 20px;
  }

  .cabecalho {
    gap: 18px;
    padding: 0 5px 34px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    min-width: 100px;
  }

  .inicial {
    font-size: 3.3rem;
  }

  .nome {
    font-size: 1.8rem;
  }

  .edicao-nome {
    flex-wrap: wrap;
  }

  .edicao-nome input {
    width: 160px;
    font-size: 1.4rem;
  }

  .edicao-nome button {
    font-size: 1rem;
    padding: 5px 10px;
  }

  .quantidade {
    font-size: 1rem;
  }

  .botao-sair {
    margin-top: 5px;
  }

  .sair {
    width: 24px;
    height: 24px;
  }

  .botao-excluir {
    margin-top: 5px;
    margin-left: 0;
    align-self: flex-start;
  }

  .excluir {
    width: 24px;
    height: 24px;
  }

  .divisoria {
    margin-bottom: 34px;
  }

  .impacto {
    padding: 20px;
    margin-bottom: 40px;
  }

  .impacto h2 {
    font-size: 1.6rem;
    margin-bottom: 19px;
  }

  .icone-reciclagem {
    width: 24px;
    height: 24px;
  }

  .destaque {
    font-size: 1.05rem;
    margin-bottom: 16px;
  }

  .texto {
    font-size: 0.98rem;
  }

  .produtos h2 {
    margin-left: 3px;
    margin-bottom: 26px;
    font-size: 1.7rem;
  }

  .pedidos {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 18px;
    margin-bottom: 40px;
  }

  .info-pedidos h2 {
    font-size: 1.6rem;
  }

  .botao-pedidos {
    width: 100%;
  }
}
</style>
