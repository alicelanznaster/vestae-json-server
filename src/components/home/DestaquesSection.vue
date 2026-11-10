<script setup>
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import ProductCard from '@/components/products/ProductCard.vue'

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

// filtra apenas os produtos em destaque
const produtosDestaque = computed(() => {
  return produtos.value.filter((produto) => produto.destaque)
})
</script>


<template>
  <section class="destaques">
    <h2>PEÇAS EM DESTAQUE</h2>

    <p class="subtitulo">
      Encontre roupas únicas, estilosas e sustentáveis que estão fazendo sucesso.
    </p>

    <Swiper
      :modules="[Navigation]"
      :slides-per-view="1"
      :space-between="15"
      navigation
      :loop="produtosDestaque.length > 4"
      :breakpoints="{
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      }"
    >
      <SwiperSlide v-for="produto in produtosDestaque" :key="produto.id">
        <ProductCard :produto="produto" />
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style scoped>
.destaques {
  margin: 80px 0;
}

.destaques h2 {
  text-align: center;
  font-size: 55px;
  font-weight: normal;
  color: black;
  cursor: default;
}

.subtitulo {
  text-align: center;
  font-size: 20px;
  color: #000000;
  margin: 10px 0 40px;
  cursor: default;
}

.swiper {
  width: 100%;
  padding: 0 55px;
  box-sizing: border-box;
}

:deep(.swiper-wrapper) {
  align-items: stretch;
}

:deep(.swiper-slide) {
  display: flex;
  justify-content: center;
}

/* SETAS */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  width: 30px;
  height: 30px;
  color: #222;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 20px;
  font-weight: normal;
}

:deep(.swiper-button-prev) {
  left: 5px;
}

:deep(.swiper-button-next) {
  right: 5px;
}

/* NOTEBOOK */
@media (max-width: 1199px) {
  .destaques {
    margin: 60px 0;
  }

  .destaques h2 {
    font-size: 45px;
  }

  .subtitulo {
    font-size: 18px;
    margin-bottom: 30px;
  }

  .swiper {
    padding: 0 50px;
  }
}

/* TABLET */
@media (max-width: 1023px) {
  .destaques h2 {
    font-size: 40px;
  }

  .swiper {
    padding: 0 45px;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 30px;
    height: 30px;
  }

  :deep(.swiper-button-next::after),
  :deep(.swiper-button-prev::after) {
    font-size: 13px;
  }

  :deep(.swiper-button-prev) {
    left: 8px;
  }

  :deep(.swiper-button-next) {
    right: 8px;
  }
}

/* CELULAR */
@media (max-width: 767px) {
  .destaques {
    margin: 45px 0;
  }

  .destaques h2 {
    font-size: 32px;
  }

  .subtitulo {
    font-size: 16px;
    padding: 0 20px;
    margin-bottom: 25px;
  }

  .swiper {
    padding: 0 40px;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 28px;
    height: 28px;
  }

  :deep(.swiper-button-next::after),
  :deep(.swiper-button-prev::after) {
    font-size: 12px;
  }

  :deep(.swiper-button-prev) {
    left: 5px;
  }

  :deep(.swiper-button-next) {
    right: 5px;
  }
}
</style>
