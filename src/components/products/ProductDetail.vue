<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addCarrinho, mostrarAviso } from '@/utils/cartUtils'
import { formataPreco } from '@/utils/currencyUtils'
import { favoritarProduto } from '@/utils/favoritesUtils'
import UploadImg from '../formulario/UploadImg.vue'

const route = useRoute()
const router = useRouter()

const produtos = ref([])
const carregando = ref(true)

const editando = ref(false)

const tituloEditado = ref('')
const descricaoEditada = ref('')
const condicaoEditada = ref('')
const categoriaEditada = ref('')
const marcaEditada = ref('')
const tamanhoEditado = ref('')
const statusEditado = ref('')
const precoEditado = ref('')
const imagemEditada = ref('')

// busca os produtos na API
onMounted(async () => {
  try {
    const resposta = await fetch('http://localhost:3000/produtos')
    produtos.value = await resposta.json()
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro)
  } finally {
    carregando.value = false
  }
})

const voltarPagina = () => {
  if (window.history.state && window.history.state.back) {
    router.back()
  } else {
    router.push('/produtos')
  }
}

// procura primeiro na API e depois nos anúncios do usuário
const produto = computed(() => {
  const produtoApi = produtos.value.find(
  (p) => String(p.id) === String(route.params.id)
  )

  if (produtoApi) {
    return produtoApi
  }

  const anuncios = JSON.parse(localStorage.getItem('vestae-anuncios') || '[]')

  return anuncios.find((p) => p.id === Number(route.params.id))
})

// verifica se o produto pertence ao usuário logado
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')

const meuProduto = computed(() => {
  if (!usuarioLogado || !produto.value) {
    return false
  }

  return produto.value.email === usuarioLogado.email
})

function editarAnuncio() {
  tituloEditado.value = produto.value.titulo
  descricaoEditada.value = produto.value.descricao
  condicaoEditada.value = produto.value.condicao
  categoriaEditada.value = produto.value.categoria
  marcaEditada.value = produto.value.marca
  tamanhoEditado.value = produto.value.tamanho
  statusEditado.value = produto.value.status
  precoEditado.value = produto.value.preco
  imagemEditada.value = produto.value.imagem
  editando.value = true
}

function salvarAlteracoes() {
  const anuncios = JSON.parse(localStorage.getItem('vestae-anuncios') || '[]')
  const anuncio = anuncios.find((p) => p.id === Number(route.params.id))

  anuncio.titulo = tituloEditado.value.trim()
  anuncio.descricao = descricaoEditada.value.trim()
  anuncio.condicao = condicaoEditada.value
  anuncio.categoria = categoriaEditada.value
  anuncio.marca = marcaEditada.value.trim()
  anuncio.tamanho = tamanhoEditado.value.trim()
  anuncio.status = statusEditado.value
  anuncio.preco = Number(precoEditado.value)
  anuncio.imagem = imagemEditada.value

  localStorage.setItem('vestae-anuncios', JSON.stringify(anuncios))
  editando.value = false
  alert('Anúncio atualizado com sucesso!')
}

function excluirAnuncio() {
  const confirmar = confirm('Tem certeza que deseja excluir este anúncio?')

  if (!confirmar) {
    return
  }

  const anuncios = JSON.parse(localStorage.getItem('vestae-anuncios') || '[]')
  const novosAnuncios = anuncios.filter((p) => p.id !== Number(route.params.id))
  localStorage.setItem('vestae-anuncios', JSON.stringify(novosAnuncios))

  alert('Anúncio excluído com sucesso!')
  router.push('/perfil')
}

function alterarImagem(dados) {
  imagemEditada.value = dados.preview
}

function limitarPreco() {
  if (precoEditado.value > 1000) {
    precoEditado.value = 1000
  }

  if (precoEditado.value < 0) {
    precoEditado.value = 0
  }
}
</script>


<template>
  <div class="pagina">
    <div v-if="mostrarAviso" class="aviso">
      <p>{{ produto.titulo }} adicionado(a) à sacola!</p>
    </div>

    <button class="voltar" @click="voltarPagina">
      <img src="/voltar.svg" alt="Voltar" />
    </button>

    <div v-if="produto" class="detalhe">
      <!-- EDIÇÃO -->
      <div v-if="editando" class="dados formulario-edicao">
        <h1>Editar anúncio</h1>

        <UploadImg :imagemInicial="imagemEditada" @imagemSelecionada="alterarImagem" />

        <div class="campo">
          <label>Descrição</label>

          <textarea
            v-model="descricaoEditada"
            placeholder="Descreva seu produto..."
            required
          ></textarea>
        </div>

        <div class="informacoes-edicao">
          <h2>Informações</h2>

          <div class="campos">
            <input v-model="tituloEditado" type="text" placeholder="Título*" required />

            <select v-model="categoriaEditada" required>
              <option disabled value="">Categoria*</option>

              <option>Masculino</option>
              <option>Feminino</option>
              <option>Calçado</option>
              <option>Acessório</option>
            </select>

            <input v-model="tamanhoEditado" type="text" placeholder="Tamanho*" required />

            <select v-model="condicaoEditada" required>
              <option disabled value="">Condição*</option>

              <option>Novo</option>
              <option>Usado</option>
            </select>

            <input v-model="marcaEditada" type="text" placeholder="Marca" />

            <select v-model="statusEditado" required>
              <option disabled value="">Status*</option>

              <option>Disponível</option>
            </select>
          </div>
        </div>

        <div class="campo preco-edicao">
          <label>Preço</label>

          <input
            v-model="precoEditado"
            type="number"
            placeholder="Preço*"
            min="0"
            max="1000"
            @input="limitarPreco"
            required
          />
        </div>

        <div class="botoes-edicao">
          <button @click="salvarAlteracoes">SALVAR ALTERAÇÕES</button>

          <button @click="editando = false">CANCELAR</button>
        </div>
      </div>

      <!-- VISUALIZAÇÃO NORMAL -->
      <template v-else>
        <div class="detalhe-img">
          <img :src="produto.imagem" :alt="produto.titulo" class="imagem-produto" />

          <button class="favoritar" @click="favoritarProduto(produto)">
            <img v-if="produto.favorito" src="/icons/coracao-preenchido.svg" alt="Desfavoritar" />

            <img v-else src="/icons/coracao.svg" alt="Favoritar" />
          </button>
        </div>

        <div class="dados">
          <h1>{{ produto.titulo }}</h1>

          <p class="preco">
            {{ formataPreco(produto.preco) }}
          </p>

          <button v-if="!meuProduto" class="carrinho" @click="addCarrinho(produto.id)">
            ADICIONAR À SACOLA
          </button>

          <div v-else class="acoes-anuncio">
            <button class="editar" @click="editarAnuncio">
              <img src="/editar.svg" alt="Editar" />
              EDITAR
            </button>

            <button class="excluir" @click="excluirAnuncio">
              <img src="/icons/lixeira-branca.svg" alt="" />
              EXCLUIR
            </button>
          </div>

          <div class="protegido">
            <img src="/icons/protegida.svg" alt="Compra protegida" />

            <span>Compra protegida</span>
          </div>

          <h3>Descrição</h3>

          <p class="descricao">
            {{ produto.descricao }}
          </p>

          <div class="informacoes">
            <span class="info">
              {{ produto.condicao }}
            </span>

            <span class="info">
              {{ produto.categoria }}
            </span>

            <span class="info">
              {{ produto.marca }}
            </span>

            <span v-if="produto.tamanho" class="info">
              {{ produto.tamanho }}
            </span>

            <span v-if="produto.status" class="info">
              {{ produto.status }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <div v-else class="nao-encontrado">
      <p>Produto não encontrado.</p>
    </div>
  </div>
</template>

<style scoped>
.aviso {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f8e0ec;
  border: 2px solid #c00b63;
  border-radius: 18px;
  padding: 35px;
  width: 500px;
  text-align: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 99999;
  color: black;
}

.pagina {
  background-color: #fef6ec;
  padding: 35px 80px 60px 80px;
  min-height: 85vh;
  box-sizing: border-box;
}

.voltar {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 20px;
  margin-bottom: 20px;
}

.detalhe {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  max-width: 1400px;
}

.detalhe-img {
  position: relative;
  width: 450px;
  height: 600px;
  border-radius: 18px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
  margin-left: 100px;
}

.imagem-produto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favoritar {
  position: absolute;
  top: 28px;
  right: 28px;
  background: rgba(255, 255, 255, 0.67);
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.favoritar:hover {
  transform: scale(1.15);
}

.favoritar img {
  width: 28px;
  height: 28px;
}

.dados {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dados h1 {
  font-size: 2.7rem;
  color: black;
  margin-bottom: 15px;
  font-family: 'Marcellus', serif;
}

.preco {
  font-size: 1.65rem;
  color: black;
  margin-top: 10px;
  font-family: 'Marcellus', serif;
  margin: 20px 0 40px 0;
}

.carrinho {
  background-color: #c00b63;
  color: white;
  border: none;
  padding: 10px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.55rem;
  font-family: 'Marcellus', serif;
  width: 62%;
  margin-bottom: 10px;
  text-align: center;
}

.carrinho:hover {
  background-color: #a00851e0;
}

.acoes-anuncio {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.acoes-anuncio button {
  padding: 12px 15px;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-family: 'Marcellus', serif;
  transition: 0.2s;
  background-color: #c40c6c;
}

.acoes-anuncio button:hover {
  opacity: 0.85;
}

.editar {
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
}

.editar img {
  width: 18px;
  height: 18px;
}

.excluir {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.protegido {
  display: flex;
  align-items: center;
  gap: 5px;
  color: black;
  font-size: 0.98rem;
  margin-bottom: 30px;
}

.protegido img {
  width: 15px;
  height: 15px;
}

.dados h3 {
  color: #3f3f3f;
  font-size: 1.4rem;
  margin-bottom: 8px;
}

.descricao {
  font-size: 1.2rem;
  color: rgba(0, 0, 0, 0.65);
  max-width: 570px;
  margin-bottom: 25px;
  line-height: 1.5;
}

.informacoes {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.info {
  background-color: #c00b62ae;
  color: white;
  padding: 6px 20px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  font-family: 'Marcellus', serif;
  text-transform: uppercase;
}

.nao-encontrado {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
}

/* FORMULÁRIO DE EDIÇÃO */

.formulario-edicao {
  gap: 40px;
  width: 100%;
  max-width: 900px;
}

.formulario-edicao h1 {
  font-size: 40px;
  font-weight: 400;
  color: #000;
  margin: 0 0 10px;
  font-family: 'Marcellus', serif;
}

.formulario-edicao label {
  display: block;
  margin-bottom: 15px;
  font-size: 22px;
  color: #000;
  font-family: 'Marcellus', serif;
}

.formulario-edicao textarea {
  width: 100%;
  max-width: 700px;
  height: 140px;
  padding: 18px;
  border: none;
  border-radius: 18px;
  resize: none;
  background: white;
  font-size: 15px;
  box-sizing: border-box;
  outline: none;
}

.informacoes-edicao h2 {
  margin: 0 0 18px;
  font-size: 22px;
  font-weight: 400;
  color: #000;
}

.campos {
  display: grid;
  grid-template-columns: repeat(3, 260px);
  gap: 15px;
  justify-content: start;
}

.campos input,
.campos select {
  width: 100%;
  padding: 20px;
  border: none;
  border-radius: 14px;
  background: white;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
}

.campos select {
  cursor: pointer;
  color: #6d6b6c;
}

.campos select:valid {
  color: #000000;
}

.preco-edicao input {
  width: 220px;
  padding: 15px;
  border: none;
  border-radius: 14px;
  background: white;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.botoes-edicao {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.botoes-edicao button {
  width: 240px;
  padding: 18px;
  border: none;
  border-radius: 14px;
  background: #c40c6c;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: 0.2s;
  font-family: 'Marcellus', serif;
}

.botoes-edicao button:hover {
  opacity: 0.9;
}

/* RESPONSIVO */

@media (max-width: 1024px) and (min-width: 769px) {
  .pagina {
    padding: 20px 30px 40px;
    min-height: 85vh;
  }

  .detalhe {
    gap: 30px;
  }

  .detalhe-img {
    width: 340px;
    height: 450px;
    margin-left: 15px;
  }

  .favoritar {
    height: 45px;
    width: 45px;
  }

  .favoritar img {
    width: 27px;
    height: 27px;
  }

  .dados h1 {
    font-size: 1.9rem;
  }

  .preco {
    font-size: 1.35rem;
  }

  .carrinho {
    width: fit-content;
    max-width: 100%;
    padding: 12px 24px;
    font-size: 1.15rem;
    white-space: nowrap;
  }

  .campos {
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    max-width: 820px;
  }
}

@media (max-width: 768px) {
  .pagina {
    padding: 10px 20px 40px;
    min-height: 100vh;
  }

  .voltar {
    padding: 10px;
    margin-bottom: 15px;
  }

  .voltar img {
    width: 20px;
    height: 20px;
  }

  .detalhe {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
  }

  .detalhe-img {
    width: 100%;
    max-width: 340px;
    height: auto;
    aspect-ratio: 1 / 1.3;
    margin: 0;
    border-radius: 16px;
  }

  .favoritar {
    top: 18px;
    right: 18px;
    width: 40px;
    height: 40px;
  }

  .favoritar img {
    width: 24px;
    height: 24px;
  }

  .dados {
    width: 100%;
    align-items: flex-start;
  }

  .dados h1 {
    font-size: 1.5rem;
    margin-bottom: 5px;
  }

  .preco {
    font-size: 1.2rem;
    margin: 5px 0 15px;
  }

  .acoes-anuncio {
    width: 100%;
  }

  .acoes-anuncio button {
    width: 100%;
  }

  .carrinho {
    width: 100%;
    padding: 14px;
    font-size: 1.1rem;
    text-align: center;
  }

  .protegido {
    font-size: 0.85rem;
    margin-bottom: 20px;
  }

  .dados h3 {
    font-size: 1.2rem;
  }

  .descricao {
    font-size: 0.95rem;
    max-width: 100%;
    margin-bottom: 20px;
    line-height: 1.4;
  }

  .informacoes {
    gap: 6px;
  }

  .info {
    font-size: 0.75rem;
    padding: 5px 10px;
  }

  .aviso {
    width: 80%;
    max-width: 350px;
    padding: 25px 20px;
    font-size: 16px;
    box-sizing: border-box;
  }

  /* edição */

  .formulario-edicao {
    width: 100%;
    gap: 28px;
  }

  .formulario-edicao h1 {
    font-size: 30px;
  }

  .formulario-edicao label {
    font-size: 20px;
  }

  .formulario-edicao textarea {
    width: 100%;
    max-width: 100%;
    height: 130px;
  }

  .campos {
    grid-template-columns: 1fr;
    width: 100%;
    gap: 14px;
  }

  .campos input,
  .campos select {
    width: 100%;
    padding: 18px;
  }

  .preco-edicao input {
    width: 100%;
    padding: 18px;
  }

  .botoes-edicao {
    flex-direction: column;
    width: 100%;
  }

  .botoes-edicao button {
    width: 100%;
    max-width: none;
    padding: 18px;
    font-size: 19px;
  }
}

@media (max-width: 400px) {
  .pagina {
    padding-left: 15px;
    padding-right: 15px;
  }

  .detalhe-img {
    max-width: 300px;
  }

  .dados h1 {
    font-size: 1.35rem;
  }

  .carrinho {
    font-size: 1rem;
  }

  .descricao {
    font-size: 0.9rem;
  }

  .info {
    font-size: 0.7rem;
    padding: 5px 8px;
  }

  .aviso {
    width: 88%;
    font-size: 15px;
  }

  .formulario-edicao {
    gap: 20px;
  }

  .formulario-edicao h1 {
    font-size: 26px;
  }

  .formulario-edicao label {
    font-size: 18px;
  }

  .formulario-edicao textarea {
    height: 120px;
  }

  .campos {
    gap: 10px;
  }

  .campos input,
  .campos select {
    padding: 15px;
  }

  .preco-edicao input {
    padding: 15px;
  }

  .botoes-edicao button {
    padding: 15px;
    font-size: 17px;
  }
}
</style>
