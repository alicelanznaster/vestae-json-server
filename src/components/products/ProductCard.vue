<script setup>
import { formataPreco } from '@/utils/currencyUtils'
import { favoritarProduto } from '@/utils/favoritesUtils'
import { RouterLink } from 'vue-router'

// receber os dados do produto
const props = defineProps({
  produto: Object,
  mostrarFavorito: {
    type: Boolean,
    default: true
  }
})

// favoritar o produto
function favoritar() {
  favoritarProduto(props.produto)
}
</script>

<template>
    <div class="card">

        <button v-if="mostrarFavorito" class="favorito" @click="favoritar">
            <img :src="produto.favorito ? '/icons/coracao-preenchido.svg' : '/icons/coracao.svg'" alt="Favoritar" />
        </button>
        <RouterLink :to="{ name: 'produto', params: { id: produto.id } }">
            <img :src="produto.imagem" :alt="produto.titulo" class="imagem">
        </RouterLink>


        <div class="informacoes">
            <h3>{{ produto.titulo }}</h3>

            <p class="preco">
                {{ formataPreco(produto.preco) }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.card {
    width: 100%;
    background: #FEF6EC;
    border-radius: 8px;
    padding: 18px;
    border: 2px solid #7c7c7c75;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .15);
    transition: .3s;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 40px;
}

.card:hover {
    transform: translateY(-5px);
}

.favorito {
    position: absolute;
    top: 6%;
    right: 10%;
    background: rgba(255, 255, 255, 0.67);
    border: none;
    cursor: pointer;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.favorito img {
    width: 27px;
    height: 27px;
}

.imagem {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 8px;
}

h3 {
    font-size: 1.5rem;
    font-weight: 400;
    color: #444;
}

.preco {
    font-size: 1.6rem;
    font-weight: 500;
    color: #000;
}

/* ---------- Tablet ---------- */
@media (max-width:1024px) {

    .card {
        padding: 16px;
    }

    h3 {
        font-size: 1.45rem;
    }

    .preco {
        font-size: 1.7rem;
    }

    .favorito {
        width: 38px;
        height: 38px;
    }

    .favorito img {
        width: 1.8rem;
        height: 1.8rem;
    }

}

/* ---------- Celular ---------- */
@media (max-width:768px) {

    .card {
        padding: 10px;
    }

    .informacoes {
        margin-top: 8px;
    }

    h3 {
        font-size: 1rem;
    }

    .preco {
        font-size: 1.2rem;
    }

    .favorito {
        width: 35px;
        height: 35px;
    }

    .favorito img {
        width: 1.5rem;
        height: 1.5rem;
    }

}

@media (max-width: 480px) {
    .favorito img {
        width: 1.6rem;
        height: 1.6rem;
    }
}
</style>
