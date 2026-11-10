<script setup>
import { ref, computed, onMounted } from 'vue'  
import ProductCard from '@/components/products/ProductCard.vue'
import produtos from '@/data/product'
import { carregarFavoritos } from '@/utils/favoritesUtils'

const produtos = ref([])
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
const favoritosSalvos = JSON.parse(localStorage.getItem('favoritos') || '{}')

// busca os produtos na API
onMounted(async () => {
  try {
    const resposta = await fetch('http://localhost:3000/produtos')
    produtos.value = await resposta.json()
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro)
  }
})

// filtra os produtos favoritados pelo usuário
const favoritos = computed(() => {
  if (!usuarioLogado) {
    return []
  }

  const idsFavoritos = favoritosSalvos[usuarioLogado.id] || []

  return produtos.value.filter((produto) =>
    idsFavoritos.some((id) => String(id) === String(produto.id))
  )
})

onMounted(() => {
  carregarFavoritos()
})
</script>

<template>
  <div class="pagina">
    <h1>Favoritos</h1>

    <div v-if="favoritos.length > 0" class="lista-produtos">
      <ProductCard v-for="produto in favoritos" :key="produto.id" :produto="produto" />
    </div>

    <div v-else class="vazio">
      <p>Você ainda não favoritou nenhum produto.</p>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 30px;
}

h1 {
  font-family: 'Marcellus', sans-serif;
  font-size: 3rem;
  font-weight: 400;
  color: black;
  margin-bottom: 40px;
}

.vazio {
  color: rgb(56, 56, 56);
  font-family: 'Google Sans Flex', sans-serif;
  text-align: center;
  font-size: 1.3rem;
}

.lista-produtos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

@media (max-width: 1024px) {
  .pagina {
    padding: 30px 20px;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 30px;
  }

  .lista-produtos {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .pagina {
    padding: 24px 16px;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 24px;
  }

  .lista-produtos {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
</style>
