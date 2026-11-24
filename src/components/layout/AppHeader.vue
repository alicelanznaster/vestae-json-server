<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { verificarModoVendedor } from '@/utils/modoUtils'

const emit = defineEmits(['abrir-sacola'])
const busca = ref('')
const menuAberto = ref(false)
const router = useRouter()
const mostrarTopBar = ref(false)

function carregarModo() {
  mostrarTopBar.value = verificarModoVendedor()
}

onMounted(() => {
  carregarModo()
  window.addEventListener('modoAlterado', carregarModo)
})

onUnmounted(() => {
  window.removeEventListener('modoAlterado', carregarModo)
})

watch(busca, (valor) => {
  router.push({
    path: '/produtos',
    query: valor ? { busca: valor } : {},
  })
})

function alternarMenu() {
  menuAberto.value = !menuAberto.value
}

function abrirPerfil() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')

  if (!usuarioLogado) {
    localStorage.setItem('voltarDepoisDoLogin', '/perfil')
    router.push('/login')
    return
  }

  router.push('/perfil')
}
</script>

<template>
  <header>
    <!-- topBar -->
    <div v-if="mostrarTopBar" class="top-bar">
      <p>
        Dê um novo destino às suas roupas |
        <RouterLink to="/anunciar" class="top-link-vender"> Quero vender </RouterLink>
      </p>
    </div>

    <div class="header-main">
      <button class="menu-mobile" type="button" @click="alternarMenu">
        <img src="/icons/menu.png" alt="menu" class="icone-menu" />
      </button>

      <RouterLink to="/" class="logo">
        <span>VESTÆ</span>
      </RouterLink>

      <div class="pesquisa">
        <input v-model="busca" type="text" placeholder="Pesquisar produtos..." />
        <button type="button">
          <img src="/icons/pesquisar.svg" alt="Pesquisar" class="icone-pesquisa" />
        </button>
      </div>

      <nav class="acoes">
        <RouterLink v-if="mostrarTopBar" to="/anunciar" class="link-vender">Quero vender</RouterLink>
        <button class="icones" @click="abrirPerfil">
          <img src="/icons/perfil.svg" alt="Perfil" class="icone-perfil" />
        </button>
        <RouterLink to="/favoritos" class="icones">
          <img src="/icons/coracao.svg" alt="Favoritos" class="icone-coracao" />
        </RouterLink>
        <button class="icones" @click="emit('abrir-sacola')">
          <img src="/icons/sacola1.svg" alt="Sacola" class="icone-sacola1" />
        </button>
      </nav>
    </div>

    <!-- navbar -->
    <nav class="categorias">
      <RouterLink to="/calcados" class="link">Calçados</RouterLink>
      <RouterLink to="/masculino" class="link">Masculino</RouterLink>
      <RouterLink to="/feminino" class="link">Feminino</RouterLink>
      <RouterLink to="/acessorios" class="link">Acessórios</RouterLink>
    </nav>

    <!-- navBar responsivo -->
    <div v-show="menuAberto" class="overlay" @click="alternarMenu"></div>

    <div v-show="menuAberto" class="menu-celular">
      <button class="fechar-menu" type="button" @click="alternarMenu">
        <img src="/icons/fechar.png" alt="fechar" class="icone-fechar" />
      </button>

      <RouterLink to="/" class="link-mobile" @click="menuAberto = false">Home</RouterLink>
      <RouterLink to="/calcados" class="link-mobile" @click="menuAberto = false"
        >Calçados</RouterLink
      >
      <RouterLink to="/masculino" class="link-mobile" @click="menuAberto = false"
        >Masculino</RouterLink
      >
      <RouterLink to="/feminino" class="link-mobile" @click="menuAberto = false"
        >Feminino</RouterLink
      >
      <RouterLink to="/acessorios" class="link-mobile" @click="menuAberto = false"
        >Acessórios</RouterLink
      >
    </div>
  </header>
</template>

<style scoped>
/* --- header --- */
header {
  width: 100%;
  position: relative;
}

/* --- top bar --- */
.top-bar {
  background-color: #c00b63;
  padding: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-bar p {
  margin: 0;
  color: white;
  font-size: 14px;
  font-weight: 400;
  text-decoration: underline;
}

.top-link-vender {
  color: white;
  font-weight: 700;
  text-decoration: underline;
}

.top-link-vender:hover {
  opacity: 0.8;
}

/* --- header principal --- */
.header-main {
  background: #fef6ec;
  min-height: 95px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  flex-wrap: wrap;
}

.menu-mobile {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.icone-menu {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.logo span {
  font-size: 2.8rem;
  font-family: 'Tenor Sans', sans-serif;
  color: #000;
  letter-spacing: 1px;
}

.pesquisa {
  flex: 1;
  display: flex;
  align-items: center;
  max-width: 500px;
  margin: 0 50px;
  background: #fff;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.2s;
}

.pesquisa:focus-within {
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.22);
}

.pesquisa input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 15px 20px;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1rem;
  color: #000;
}

.pesquisa input::placeholder {
  color: #999;
}

.pesquisa button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icone-pesquisa {
  width: 24px;
  height: 24px;
}

.acoes {
  display: flex;
  align-items: center;
  gap: 16px;
}

.link-vender {
  text-decoration: none;
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #303030;
  transition: color 0.2s;
}

.link-vender:hover {
  color: #c00b63;
}

.link-vender.router-link-active {
  color: #c00b63;
}

.icones {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.icone-perfil,
.icone-coracao {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: invert(20%);
}

.icone-sacola1 {
  width: 30px;
  height: 30px;
  object-fit: contain;
  filter: invert(20%);
}

.icones:hover .icone-perfil,
.icones:hover .icone-coracao,
.icones:hover .icone-sacola1,
.icones.router-link-active .icone-perfil,
.icones.router-link-active .icone-coracao,
.icones.router-link-active .icone-sacola1 {
  filter: invert(11%) sepia(96%) saturate(3500%) hue-rotate(320deg);
}

/* --- nav bar --- */
.categorias {
  padding: 15px 40px;
  background: #c00b6288;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
}

.link {
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  color: black;
  transition: 0.2s;
  white-space: nowrap;
  color: #dfdfdfad;
}

.link:hover,
.link.router-link-active {
  color: rgb(255, 255, 255);
  font-weight: 600;
}
.menu-celular {
  display: none;
}

/* --- overlay --- */
.overlay {
  display: none;
}

@media (max-width: 1024px) {
  /* --- top bar --- */
  .top-bar {
    padding: 8px 16px;
  }

  .top-bar p {
    font-size: 13px;
    text-align: center;
  }

  /* --- header principal --- */
  .header-main {
    padding: 0 24px;
  }

  .menu-mobile {
    display: none;
  }

  .logo span {
    font-size: 2.3rem;
  }

  .pesquisa {
    margin: 0 24px;
    max-width: 420px;
  }

  .acoes {
    gap: 12px;
  }

  .link-vender {
    display: none;
  }

  .icone-perfil,
  .icone-coracao {
    width: 26px;
    height: 26px;
  }

  .icone-sacola1 {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 768px) {
  /* --- top bar --- */
  .top-bar {
    padding: 10px 16px;
  }

  .top-bar p {
    font-size: 12px;
    text-align: center;
    line-height: 1.4;
  }

  /* --- header principal --- */
  .header-main {
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    position: relative;
  }

  .menu-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    order: 1;
    flex-shrink: 0;
  }

  .icone-menu {
    height: 32px;
    width: 32px;
    margin: 0;
  }

  .logo {
    order: 2;
    margin-left: 0;
    flex-shrink: 0;
  }

  .logo span {
    margin-left: 0;
    font-size: 1.8rem;
  }

  .acoes {
    order: 3;
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .link-vender {
    display: none;
  }

  .icone-perfil,
  .icone-coracao {
    width: 24px;
    height: 24px;
  }

  .icone-sacola1 {
    width: 26px;
    height: 26px;
  }

  .pesquisa {
    order: 4;
    width: 100%;
    max-width: 100%;
    flex: none;
    margin: 0;
  }

  .pesquisa input {
    padding: 14px 16px;
    font-size: 0.95rem;
  }

  .pesquisa button {
    padding: 0 16px;
  }

  /* --- navBar --- */
  .categorias {
    display: none;
  }

  .menu-celular {
    position: absolute;
    top: 48px;
    left: 12px;
    width: 210px;
    background: #c76494;
    border-radius: 10px;
    padding: 15px 20px 15px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 15px 30px rgba(97, 97, 97, 0.22);
    z-index: 9999;
  }

  .fechar-menu {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    align-self: flex-start;
    margin-bottom: 14px;
  }

  .icone-fechar {
    width: 30px;
    height: 30px;
    margin: 0;
  }

  .link-mobile {
    text-decoration: none;
    color: black;
    font-size: 1.2rem;
    font-weight: 500;
    padding: 8px 0;
    transition: 0.2s;
  }

  .overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 9998;
    animation: aparecerFundo 0.25s ease;
  }

  .menu-celular {
    animation: abrirMenu 0.25s ease;
  }
}

/* animações — tocam sozinhas toda vez que o elemento aparece */
@keyframes abrirMenu {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes aparecerFundo {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
