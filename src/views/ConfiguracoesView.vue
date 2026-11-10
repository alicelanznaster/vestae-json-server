<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = 'http://localhost:3000'

const usuario = ref({})
const carregando = ref(false)
const mensagem = ref('')
const editando = ref(false)
const dadosEditados = ref({})
const senhaAtual = ref('')
const novaSenha = ref('')
const confirmarSenha = ref('')
const tipoMensagem = ref('sucesso')

function mostrarMensagem(texto, tipo) {
  mensagem.value = texto
  tipoMensagem.value = tipo

  setTimeout(() => {
    mensagem.value = ''
  }, 3000)
}

async function carregarUsuario() {
  carregando.value = true
  mensagem.value = ''

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
  const resposta = await fetch(`${API_URL}/usuarios/${usuarioLogado.id}`)

  if (!resposta.ok) {
    mensagem.value = 'Erro ao carregar os dados do usuário!'
    carregando.value = false
    return
  }

  usuario.value = await resposta.json()
  carregando.value = false
}

function editarUsuario() {
  dadosEditados.value = {
    nome: usuario.value.nome,
    email: usuario.value.email,
    telefone: usuario.value.telefone,
  }

  editando.value = true
}

async function salvarUsuario() {
  const resposta = await fetch(`${API_URL}/usuarios/${usuario.value.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosEditados.value),
  })

  if (!resposta.ok) {
    mostrarMensagem('Erro ao atualizar as informações!', 'erro')
    return
  }

  usuario.value = await resposta.json()

  localStorage.setItem('usuarioLogado', JSON.stringify(usuario.value))

  editando.value = false
  mostrarMensagem('Informações atualizadas com sucesso!', 'sucesso')
}

async function alterarSenha() {
  if (senhaAtual.value !== usuario.value.senha) {
    mostrarMensagem('A senha atual está incorreta!', 'erro')
    return
  }

  if (novaSenha.value !== confirmarSenha.value) {
    mostrarMensagem('As senhas não coincidem!', 'erro')
    return
  }

  const resposta = await fetch(`${API_URL}/usuarios/${usuario.value.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      senha: novaSenha.value,
    }),
  })

  usuario.value = await resposta.json()

  localStorage.setItem('usuarioLogado', JSON.stringify(usuario.value))

  senhaAtual.value = ''
  novaSenha.value = ''
  confirmarSenha.value = ''
  mostrarMensagem('Senha alterada com sucesso!', 'sucesso')
}

async function excluirConta() {
  const confirmar = confirm(
    'Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.',
  )

  if (!confirmar) {
    return
  }

  const resposta = await fetch(`${API_URL}/usuarios/${usuario.value.id}`, {
    method: 'DELETE',
  })

  if (!resposta.ok) {
    mostrarMensagem('Erro ao excluir a conta!', 'erro')
    return
  }

  const email = usuario.value.email
  const id = usuario.value.id

  // remove os favoritos dessa conta
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '{}')
  delete favoritos[id]
  localStorage.setItem('favoritos', JSON.stringify(favoritos))

  // remove os anúncios dessa conta
  const anuncios = JSON.parse(localStorage.getItem('vestae-anuncios') || '[]')
  const anunciosAtualizados = anuncios.filter((produto) => produto.email !== email)
  localStorage.setItem('vestae-anuncios', JSON.stringify(anunciosAtualizados))

  // remove os outros dados locais
  localStorage.removeItem('carrinho')
  localStorage.removeItem(`vestae-foto-${email}`)
  localStorage.removeItem('usuarioLogado')
  localStorage.removeItem('produtoParaFavoritar')
  localStorage.removeItem('voltarDepoisDoLogin')

  mostrarMensagem('Sua conta foi excluída com sucesso!', 'sucesso')
  setTimeout(() => {
    router.push('/')
  }, 2000)
}

onMounted(() => {
  carregarUsuario()
})
</script>

<template>
  <main class="configuracoes">
    <div v-if="mensagem" class="aviso" :class="tipoMensagem">
      {{ mensagem }}
    </div>
    <h1>Configurações da conta</h1>
    <p>Gerencie suas informações pessoais e os dados da sua conta.</p>

    <p v-if="carregando">Carregando informações...</p>

    <section v-if="usuario.id" class="dados-pessoais">
      <h2>Dados pessoais</h2>

      <div v-if="!editando">
        <p>Nome: {{ usuario.nome }}</p>
        <p>E-mail: {{ usuario.email }}</p>
        <p>Telefone: {{ usuario.telefone }}</p>

        <button @click="editarUsuario">Editar informações</button>
      </div>

      <form v-else>
        <input type="text" placeholder="Nome" v-model="dadosEditados.nome" />
        <input type="email" placeholder="E-mail" v-model="dadosEditados.email" />
        <input type="tel" placeholder="Telefone" v-model="dadosEditados.telefone" />

        <button type="button" @click="editando = false">Cancelar</button>
        <button type="button" @click="salvarUsuario">Salvar alterações</button>
      </form>
    </section>
    <section class="alterar-senha">
      <h2>Alterar senha</h2>

      <form @submit.prevent="alterarSenha">
        <input type="password" placeholder="Senha atual" v-model="senhaAtual" required />

        <input type="password" placeholder="Nova senha" v-model="novaSenha" required />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          v-model="confirmarSenha"
          required
        />

        <button type="submit">Alterar senha</button>
      </form>
    </section>
    <section class="excluir-conta">
      <button type="button" @click="excluirConta">Excluir minha conta</button>
      <p>Essa ação é permanente e não poderá ser desfeita.</p>
    </section>
  </main>
</template>

<style scoped>
.aviso {
  position: fixed;
  top: 100px;
  right: 30px;
  padding: 16px 24px;
  border-radius: 8px;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 0.95rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.sucesso {
  background-color: #f1e4d3;
  color: #b20f63b4;
  border-left: 4px solid #b20f63b4;
}

.erro {
  background-color: #f8e0ec;
  color: #c40c6c;
  border-left: 4px solid #c40c6c;
}

.configuracoes {
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px;
}

.configuracoes h1 {
  font-family: 'Marcellus', sans-serif;
  font-size: 2.5rem;
  font-weight: 400;
  color: #c40c6c;
}

.configuracoes p {
  font-family: 'Google Sans Flex', sans-serif;
  color: #555;
}
</style>
