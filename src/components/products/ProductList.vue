<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const produtos = ref([])

// busca os produtos na API
onMounted(async () => {
  try {
    const resposta = await fetch('http://localhost:3000/produtos')
    produtos.value = await resposta.json()
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro)
  }
})

const produtosFiltrados = computed(() => {
  const busca = route.query.busca?.toLowerCase() || ''

  if (!busca) {
    return produtos.value
  }

  return produtos.value.filter(
    (produto) =>
      produto.titulo.toLowerCase().includes(busca) ||
      produto.categoria.toLowerCase().includes(busca) ||
      produto.condicao.toLowerCase().includes(busca) ||
      produto.tamanho.toLowerCase().includes(busca),
  )
})
</script>


<template>
  <div class="product-list">
    <ProductCard v-for="produto in produtosFiltrados" :key="produto.id" :produto="produto" />
  </div>
</template>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .product-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .product-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 20px;
  }
}
</style>
