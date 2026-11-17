<script setup>
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  produtos: Array,
})

const preco = ref('')

// filtrar os produtos pela faixa de preço
const produtosFiltrados = computed(() => {
  if (preco.value === 'ate50') {
    return props.produtos.filter((produto) => produto.preco <= 50)
  }

  if (preco.value === 'ate100') {
    return props.produtos.filter((produto) => produto.preco <= 100)
  }

  if (preco.value === 'ate500') {
    return props.produtos.filter((produto) => produto.preco <= 500)
  }

  return props.produtos
})
</script>

<template>
  <select v-model="preco" class="filtro">
    <option value="">Todos os preços</option>
    <option value="ate50">Até R$ 50,00</option>
    <option value="ate100">Até R$ 100,00</option>
    <option value="ate500">Até R$ 500,00</option>
  </select>

  <div v-if="produtosFiltrados.length === 0" class="sem-produtos">
    Nenhum produto encontrado nessa faixa de preço!
  </div>

  <div v-else class="lista-produtos">
    <ProductCard v-for="produto in produtosFiltrados" :key="produto.id" :produto="produto" />
  </div>
</template>

<style scoped>
.filtro {
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #7c7c7c75;
  background-color: #FEF6EC;
  font-size: 1.15rem;
  color: #524f4f;
  margin-bottom: 40px;
}

.lista-produtos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.sem-produtos {
  text-align: center;
  font-size: 1.3rem;
  color: #666;
  padding: 30px;
}

@media (max-width: 1024px) {
  .lista-produtos {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .sem-produtos {
    text-align: center;
    font-size: 1.3rem;
    color: #666;
    padding: 30px;
  }
}

@media (max-width: 768px) {

  .lista-produtos {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
</style>
