<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

let nome = ref('')
let email = ref('')
let telefone = ref('')
let senha = ref('')
let confirmarSenha = ref('')
let termos = ref(false)
let tipoPerfil = ref('')

let mostrarSenha = ref(false)
let mostrarConfirmarSenha = ref(false)

const API_URL = 'http://localhost:3000'
const router = useRouter()

async function cadastrar() {
  if (
    nome.value === '' ||
    email.value === '' ||
    telefone.value === '' ||
    tipoPerfil.value === '' ||
    senha.value === '' ||
    confirmarSenha.value === '' ||
    termos.value === false
  ) {
    alert('Preencha todos os campos!')
    return
  }

  if (!email.value.includes('@') || !email.value.includes('.')) {
    alert('Digite um e-mail válido!')
    return
  }

  if (telefone.value.length < 14 || telefone.value.length > 15) {
    alert('Digite um telefone válido!')
    return
  }

  if (senha.value.length < 8) {
    alert('A senha deve ter pelo menos 8 caracteres!')
    return
  }

  if (!/[A-Za-z]/.test(senha.value) || !/[0-9]/.test(senha.value)) {
    alert('A senha deve conter pelo menos uma letra e um número!')
    return
  }

  if (senha.value !== confirmarSenha.value) {
    alert('As senhas não são iguais!')
    return
  }

  const respostaUsuarios = await fetch(`${API_URL}/usuarios`)
  const usuarios = await respostaUsuarios.json()

  let emailExiste = usuarios.some(
    (usuario) => usuario.email.toLowerCase() === email.value.toLowerCase(),
  )

  if (emailExiste) {
    alert('Este e-mail já está cadastrado!')
    return
  }

  const novoUsuario = {
    nome: nome.value,
    email: email.value.toLowerCase(),
    telefone: telefone.value,
    senha: senha.value,
    termos: termos.value,
    tipoPerfil: tipoPerfil.value,
  }

  const resposta = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(novoUsuario),
  })

  if (!resposta.ok) {
    alert('Erro ao realizar cadastro!')
    return
  }

  const usuarioSalvo = await resposta.json()

  localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSalvo))

  nome.value = ''
  email.value = ''
  telefone.value = ''
  senha.value = ''
  confirmarSenha.value = ''
  termos.value = false

  alert('Cadastro realizado com sucesso!')
  router.push('/')
}

function formatarTelefone() {
  telefone.value = telefone.value.replace(/\D/g, '')

  if (telefone.value.length <= 10) {
    telefone.value = telefone.value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    telefone.value = telefone.value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }
}
</script>

<template>
  <main class="pagina">
    <RouterLink to="/" class="voltar">
      <img src="/voltar.svg" alt="Voltar" />
    </RouterLink>

    <div class="cadastro">
      <h1 class="logo">VESTÆ</h1>

      <section class="card">
        <h2>Comece agora</h2>

        <p class="subtitulo">Crie sua conta e entre no VESTÆ.</p>

        <form>
          <input
            type="text"
            v-model="nome"
            @input="nome = nome.replace(/[^A-Za-zÀ-ÿ\s]/g, '')"
            placeholder="Nome Completo *"
          />

          <input
            type="email"
            v-model="email"
            @input="email = email.replace(/\s/g, '')"
            placeholder="E-mail *"
          />

          <input
            type="text"
            v-model="telefone"
            @input="formatarTelefone"
            placeholder="Telefone *"
            maxlength="15"
          />

          <div class="perfil">
            <div class="fundo-perfil">
              <p>Qual será seu perfil principal? *</p>

              <div class="opcoes-perfil">
                <label>
                  <input type="radio" v-model="tipoPerfil" value="comprador" />
                  Comprador
                </label>

                <label>
                  <input type="radio" v-model="tipoPerfil" value="vendedor" />
                  Vendedor
                </label>
              </div>
            </div>
            <span>Você poderá comprar e vender independentemente da escolha.</span>
          </div>

          <div class="senha">
            <input
              :type="mostrarSenha ? 'text' : 'password'"
              v-model="senha"
              @input="senha = senha.replace(/\s/g, '')"
              placeholder="Digite sua senha"
            />

            <button type="button" @click="mostrarSenha = !mostrarSenha">
              <img
                :src="mostrarSenha ? '/icons/fechado.svg' : '/icons/aberto.svg'"
                alt="Mostrar senha"
              />
            </button>
          </div>

          <div class="senha">
            <input
              :type="mostrarConfirmarSenha ? 'text' : 'password'"
              v-model="confirmarSenha"
              @input="confirmarSenha = confirmarSenha.replace(/\s/g, '')"
              placeholder="Confirme sua senha *"
            />
            <button type="button" @click="mostrarConfirmarSenha = !mostrarConfirmarSenha">
              <img
                :src="mostrarConfirmarSenha ? '/icons/fechado.svg' : '/icons/aberto.svg'"
                alt="Mostrar senha"
              />
            </button>
          </div>
          <div class="termos">
            <input type="checkbox" v-model="termos" />

            <span> Aceito os Termos de Uso e a Política de Privacidade </span>
          </div>
        </form>
        <button @click="cadastrar()" class="botao">CADASTRAR</button>
        <div class="possui">
          <p>Já possui uma conta?</p>
          <RouterLink to="/login">Entre agora!</RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.pagina {
  background-color: #efe4d6;
  padding: 20px 40px 55px;
  min-height: 80vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.voltar {
  padding: 20px;
  display: inline-block;
}

.cadastro {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  width: 100%;
  align-items: center;
}

.logo {
  font-size: 30px;
  margin-bottom: 25px;
  text-align: center;
  color: black;
}

.card {
  background-color: #fef6ec;
  max-width: 440px;
  width: 100%;
  padding: 35px 30px;
  border-radius: 18px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3f3f3f;
}

h2 {
  color: #c00b63;
  font-size: 30px;
  margin-bottom: 8px;
}

.subtitulo {
  font-size: 20px;
  line-height: 1.15;
  margin-bottom: 35px;
  color: black;
}

form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 15px;
  align-items: center;
}

input {
  background-color: #f5ece0;
  border: none;
  padding: 14px 16px;
  max-width: 500px;
  width: 100%;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 16px;
  font-family: 'Google Sans Flex', sans-serif;
}

input::placeholder {
  color: #3f3f3f;
}

.telefone {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #f5ece0;
  border-radius: 8px;
}

.ddd {
  padding-left: 16px;
  font-size: 16px;
  color: #3f3f3f;
}

.telefone input {
  background-color: transparent;
  border: none;
  border-radius: 0;
  padding-left: 8px;
}

.telefone input:focus {
  border: none;
  outline: none;
}

.perfil {
  width: 100%;
  text-align: left;
  margin: 8px 0;
}

.perfil p {
  font-size: 15px;
  margin-bottom: 12px;
}

.fundo-perfil {
  background-color: #f5ece0;
  padding: 14px 16px;
  border-radius: 8px;
}

.opcoes-perfil {
  display: flex;
  gap: 25px;
  margin-bottom: 8px;
  font-family: 'Google Sans Flex', sans-serif;
}

.opcoes-perfil label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  cursor: pointer;
}

.opcoes-perfil input {
  width: 17px;
  height: 17px;
  padding: 0;
  margin: 0;
  accent-color: #c00b63;
  cursor: pointer;
}

.perfil span {
  font-size: 12px;
  color: #666;
}

.senha {
  display: flex;
  width: 100%;
}

.senha input {
  border-radius: 9px 0 0 9px;
}

.senha button {
  background: #f5ece0;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  padding-right: 10px;
}

.senha button img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.termos {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 5px;
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
}

.termos input {
  width: 17px;
  height: 17px;
  margin: 1px 0 0;
  accent-color: #c00b63;
  cursor: pointer;
  flex-shrink: 0;
  /*quer dizer q o checkbox não pode encolher*/
}

.botao {
  background-color: #c00b63;
  color: white;
  font-family: 'Marcellus', serif;
  border: none;
  padding: 15px 20px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  width: 90%;
  margin-top: 20px;
}

.possui {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 5px;
  margin-top: 10px;
}

.possui p {
  font-size: 14px;
}

.possui a {
  text-decoration: none;
  color: #c00b63;
  font-weight: 500;
}

@media (max-width: 768px) {
  .pagina {
    padding: 10px 18px 35px;
    min-height: 100vh;
  }

  .voltar {
    padding: 10px;
  }

  .voltar img {
    width: 20px;
    height: 20px;
  }

  .logo {
    font-size: 25px;
    margin-bottom: 18px;
  }

  .card {
    width: 100%;
    max-width: 440px;
    padding: 25px 20px;
    border-radius: 15px;
    max-height: none;
  }

  h2 {
    font-size: 24px;
    line-height: 1.2;
  }

  .subtitulo {
    font-size: 16px;
    margin-bottom: 25px;
  }

  form {
    gap: 8px;
  }

  input,
  select {
    font-size: 15px;
    padding: 13px 14px;
  }
}
</style>
