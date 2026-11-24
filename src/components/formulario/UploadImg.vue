<script setup>
import { ref } from 'vue'

const props = defineProps({
  imagemInicial: {
    type: String,
    default: '',
  },
})

const imagem = ref(props.imagemInicial)
const nomeImagem = ref('')
const inputFile = ref(null)

const emit = defineEmits(['imagemSelecionada'])

function selecionarArquivo(evento) {
  const arquivo = evento.target.files[0]

  if (!arquivo) return

  nomeImagem.value = arquivo.name

  const leitor = new FileReader()

  leitor.onload = () => {
    const foto = new Image()

    foto.onload = () => {
      const canvas = document.createElement('canvas')
      const contexto = canvas.getContext('2d')

      const largura = 300
      const altura = (foto.height / foto.width) * largura

      canvas.width = largura
      canvas.height = altura

      contexto.drawImage(foto, 0, 0, largura, altura)

      imagem.value = canvas.toDataURL('image/jpeg', 0.6)

      emit('imagemSelecionada', {
        arquivo: arquivo,
        preview: imagem.value,
      })
    }

    foto.src = leitor.result
  }

  leitor.readAsDataURL(arquivo)
}
</script>

<template>
  <div class="upload">
    <h2>Foto do Produto</h2>

    <div class="input-group">
      <input
        type="file"
        @change="selecionarArquivo"
        ref="inputFile"
        accept="image/png, image/jpeg, image/webp"
      />

      <div class="area-upload" @click="inputFile.click()">
        <div v-if="!imagem" class="placeholder">
          <img src="/form/upload.png" alt="" />
          <p>Carregar Fotos (Formato 3:4)</p>
        </div>

        <img v-else :src="imagem" class="preview" alt="Prévia do produto" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start;
}

.upload h2 {
  margin: 0;
  font-size: 25px;
  font-weight: 400;
  color: #000000;
}

.input-group {
  width: 100%;
}

input[type='file'] {
  display: none;
}

.area-upload {
  width: min(370px, 100%);
  aspect-ratio: 3 / 4;
  margin: 0;
  background: #fff;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  transition: 0.2s;
}

.area-upload:hover {
  border-color: #bcbcbc;
  background: #fafafa;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.placeholder img {
  width: 30px;
}

.placeholder p {
  margin: 0;
  font-size: 15px;
  color: #555;
}

.preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/*responsividade*/
@media (max-width: 1024px) {
  .area-upload {
    width: 330px;
  }
}

@media (max-width: 768px) {
  .upload {
    width: 100%;
  }

  .upload h2 {
    font-size: 22px;
  }

  .input-group {
    width: 100%;
  }

  .area-upload {
    width: 100%;
    max-width: 360px;
  }
}
</style>
