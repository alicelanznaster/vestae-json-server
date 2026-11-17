  <script setup>
  import { ref, watch } from 'vue'

  const emit = defineEmits(['enviar'])
  const props = defineProps({
    publicado: {
      type: Boolean,
      default: false,
    },
  })

  const titulo = ref('')
  const categoria = ref('')
  const tamanho = ref('')
  const condicao = ref('')
  const marca = ref('')
  const descricao = ref('')
  const preco = ref('')
  const status = ref('')
  const anuncioTemporario = JSON.parse(localStorage.getItem('anuncioTemporario') || 'null')

  if (anuncioTemporario) {
    titulo.value = anuncioTemporario.titulo
    categoria.value = anuncioTemporario.categoria
    tamanho.value = anuncioTemporario.tamanho
    condicao.value = anuncioTemporario.condicao
    marca.value = anuncioTemporario.marca
    descricao.value = anuncioTemporario.descricao
    preco.value = anuncioTemporario.preco
    status.value = anuncioTemporario.status
  }

  const limitarPreco = () => {
    if (preco.value > 1000) preco.value = 1000
    if (preco.value < 0) preco.value = 0
  }

  const limparFormulario = () => {
    titulo.value = ''
    categoria.value = ''
    tamanho.value = ''
    condicao.value = ''
    marca.value = ''
    descricao.value = ''
    preco.value = ''
    status.value = ''
  }

  const enviarFormulario = () => {
    emit('enviar', {
      titulo: titulo.value.trim(),
      categoria: categoria.value,
      tamanho: tamanho.value.trim(),
      condicao: condicao.value,
      marca: marca.value.trim(),
      descricao: descricao.value.trim(),
      preco: Number(preco.value),
      status: status.value,
    })
  }

  watch(
    () => props.publicado,
    (valor) => {
      if (valor) {
        limparFormulario()
      }
    },
  )
  </script>

  <template>
    <form class="dados" @submit.prevent="enviarFormulario">
      <div class="campo">
        <label>Descrição</label>
        <textarea v-model="descricao" placeholder="Descreva seu produto..." required></textarea>
      </div>

      <div class="informacoes">
        <h2>Informações</h2>
        <br />
        <div class="campos">
          <input v-model="titulo" type="text" placeholder="Título*" required />
          <select v-model="categoria" required>
            <option disabled value="">Categoria*</option>
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Calçado</option>
            <option>Acessório</option>
          </select>

          <input v-model="tamanho" type="text" placeholder="Tamanho*" required />
          <select v-model="condicao" required>
            <option disabled value="">Condição*</option>
            <option>Novo</option>
            <option>Usado</option>
          </select>

          <input v-model="marca" type="text" placeholder="Marca" />

          <select v-model="status" required>
            <option disabled value="">Status*</option>
            <option>Disponível</option>
          </select>
        </div>
      </div>

      <div class="campo preco">
        <label>Preço</label>
        <input
          v-model="preco"
          type="number"
          placeholder="Preço*"
          min="0"
          max="1000"
          @input="limitarPreco"
          required
        />
      </div>

      <button>ENVIAR ANÚNCIO</button>
    </form>
  </template>

  <style scoped>
  .dados {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  label {
    display: block;
    margin-bottom: 15px;
    font-size: 22px;
    color: #000000;
    font-family: 'Marcellus', serif;
  }

  textarea {
    width: 100%;
    max-width: 700px;
    height: 140px;
    padding: 18px;
    border: none;
    border-radius: 18px;
    resize: none;
    background: white;
    font-size: 15px;
    box-sizing: border-box;
    outline: none;
  }

  .informacoes h2 {
    margin: 0 0 18px;
    font-size: 22px;
    font-weight: 400;
    color: #000000;
  }

  .campos {
    display: grid;
    grid-template-columns: repeat(3, 260px);
    gap: 15px;
    justify-content: start;
  }

  .campos input,
  .campos select {
    width: 100%;
    padding: 20px;
    border: none;
    border-radius: 14px;
    background: white;
    font-size: 14px;
    box-sizing: border-box;
    outline: none;
  }

  .campos select {
    cursor: pointer;
    color: #6d6b6c;
  }

  .campos select:valid {
    cursor: pointer;
    color: #000000;
  }

  .preco input {
    width: 220px;
    padding: 15px;
    border: none;
    border-radius: 14px;
    background: white;
    font-size: 14px;
    outline: none;
  }

  button {
    width: 240px;
    padding: 18px;
    border: none;
    border-radius: 14px;
    background: #c40c6c;
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition: 0.2s;
    font-family: 'Marcellus', serif;
    margin: auto;
  }

  button:hover {
    opacity: 0.9;
  }

  /*responsivo*/
  @media (max-width: 1024px) {
    .dados {
      gap: 35px;
    }

    .campos {
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
      max-width: 820px;
    }

    textarea {
      max-width: 100%;
    }

    .preco input {
      width: 200px;
    }

    button {
      width: 220px;
      font-size: 18px;
    }
  }

  @media (max-width: 768px) {
    .dados {
      width: 100%;
      gap: 28px;
    }

    label {
      font-size: 20px;
    }

    textarea {
      width: 100%;
      max-width: 100%;
      height: 130px;
      box-sizing: border-box;
    }

    .campos {
      grid-template-columns: 1fr;
      width: 100%;
      gap: 14px;
    }

    .campos input,
    .campos select {
      width: 100%;
      padding: 18px;
      box-sizing: border-box;
    }

    .preco input {
      width: 100%;
      box-sizing: border-box;
      padding: 18px;
    }

    button {
      width: 100%;
      max-width: none;
      padding: 18px;
      font-size: 19px;
    }
  }
  </style>
