<script setup>
import { ref, computed, onMounted } from 'vue'
import FiltroPreco from '@/components/products/FiltroPreco.vue'

const produtos = ref([])

onMounted(async () => {
  try {
    const resposta = await fetch('http://localhost:3000/produtos')
    produtos.value = await resposta.json()
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro)
  }
})

const feminino = computed(() => {
  return produtos.value.filter(
    (produto) => produto.categoria === 'Feminino'
  )
})
</script>

<template>
  <div class="pagina">
    <h1>Feminino</h1>
    
    <div class="filtro-preco">
      <FiltroPreco :produtos="feminino" />
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
  margin-bottom: 10px;
}

@media (max-width: 1024px) {
  .pagina {
    padding: 30px 20px;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 30px;
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
}
</style>
