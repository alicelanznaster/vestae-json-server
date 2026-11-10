<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UploadImg from '@/components/formulario/UploadImg.vue'
import DadosForm from '@/components/formulario/DadosForm.vue'

const router = useRouter()

const anuncioTemporario = JSON.parse(localStorage.getItem('anuncioTemporario') || 'null')
const imagem = ref(anuncioTemporario ? { preview: anuncioTemporario.imagem } : null)
const publicado = ref(false)

const salvarImagem = (dados) => {
  imagem.value = dados
}

const publicar = async (produto) => {
  publicado.value = false

  if (!imagem.value) {
    alert('Por favor, selecione uma imagem.')
    return
  }

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')

  if (!usuarioLogado) {
    const anuncio = {
      ...produto,
      imagem: imagem.value.preview,
    }

    localStorage.setItem('anuncioTemporario', JSON.stringify(anuncio))
    localStorage.setItem('voltarDepoisDoLogin', '/anunciar')
    router.push('/login')
    return
  }

  const novoAnuncio = {
    ...produto,
    imagem: imagem.value.preview,
    email: usuarioLogado.email,
  }

  try {
    const resposta = await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoAnuncio),
    })

    if (!resposta.ok) {
      throw new Error('Erro ao publicar anúncio.')
    }

    localStorage.removeItem('anuncioTemporario')

    alert('Anúncio publicado! Agradecemos a preferência!')

    publicado.value = true
    imagem.value = null
  } catch (erro) {
    console.error('Erro ao publicar anúncio:', erro)
    alert('Não foi possível publicar o anúncio. Tente novamente.')
  }
}
</script>


<template>
  <main class="anunciar">
    <h2>ANUNCIAR</h2>

    <UploadImg :imagemInicial="imagem ? imagem.preview : ''" @imagemSelecionada="salvarImagem" />
    <DadosForm :publicado="publicado" @enviar="publicar" />
  </main>
</template>

<style scoped>
.anunciar {
  max-width: 1200px;
  margin: 35px auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.anunciar h2 {
  margin: 0;
  font-size: 40px;
  color: #000;
  font-weight: 400;
  font-family: 'Marcellus', serif;
}

/*responsivo*/

@media (max-width: 1024px) {
  .anunciar {
    max-width: 900px;
    gap: 35px;
    padding: 0 25px;
  }

  .anunciar h2 {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .anunciar {
    width: 100%;
    padding: 0 18px;
    gap: 28px;
    box-sizing: border-box;
  }

  .anunciar h2 {
    font-size: 30px;
  }
}
</style>
