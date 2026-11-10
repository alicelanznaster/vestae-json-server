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
.configuracoes {
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px;
  font-family: 'Google Sans Flex', sans-serif;
}

.configuracoes h1 {
  font-family: 'Marcellus', sans-serif;
  font-size: 2.5rem;
  font-weight: 400;
  color: #c40c6c;
  margin-bottom: 10px;
}

.configuracoes > p {
  color: #777;
  margin-bottom: 35px;
  font-size: 0.95rem;
}

.configuracoes section {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 25px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
}

.configuracoes h2 {
  font-family: 'Marcellus', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #c40c6c;
  margin-bottom: 22px;
}

.dados-pessoais p {
  color: #555;
  font-size: 0.95rem;
  margin-bottom: 14px;
}

.dados-pessoais button {
  margin-top: 12px;
}

.configuracoes form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.configuracoes input {
  width: 100%;
  padding: 13px 15px;
  border: 1px solid #ddd;
  border-radius: 7px;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.configuracoes input:focus {
  border-color: #c40c6c;
}

.configuracoes button {
  padding: 12px 22px;
  border: none;
  border-radius: 7px;
  background-color: #c40c6c;
  color: white;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.configuracoes button:hover {
  background-color: #a80959;
  transform: translateY(-1px);
}

.dados-pessoais form button:first-of-type {
  background-color: #eee;
  color: #555;
}

.dados-pessoais form button:first-of-type:hover {
  background-color: #ddd;
}

.excluir-conta {
  border: 1px solid #f1c5d7 !important;
  background-color: #fffafa !important;
}

.excluir-conta button {
  background-color: #c40c6c;
}

.excluir-conta button:hover {
  background-color: #a80959;
}

.excluir-conta p {
  margin-top: 12px;
  font-size: 0.85rem;
  color: #999;
}

.aviso {
  position: fixed;
  top: 100px;
  right: 30px;
  max-width: 350px;
  padding: 16px 24px;
  border-radius: 8px;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 0.95rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.sucesso {
  background-color: #f1e4d3;
  color: #b20f63;
  border-left: 4px solid #b20f63;
}

.erro {
  background-color: #f8e0ec;
  color: #c40c6c;
  border-left: 4px solid #c40c6c;
}

@media (max-width: 600px) {
  .configuracoes {
    padding: 30px 18px;
  }

  .configuracoes h1 {
    font-size: 2rem;
  }

  .configuracoes section {
    padding: 20px;
  }

  .configuracoes h2 {
    font-size: 1.3rem;
  }

  .aviso {
    left: 18px;
    right: 18px;
    top: 85px;
    max-width: none;
  }
}
</style>
