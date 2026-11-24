<script setup></script>

<template>
  <main class="sobre">
    <section class="projeto">
      <h2>Sobre o Projeto</h2>

      <p>
        O VESTÆ é um projeto institucional desenvolvido durante o Hackathon com o objetivo de unir
        tecnologia, moda e sustentabilidade. O site foi criado a partir de problemas recorrentes
        relacionados ao consumo excessivo de roupas e aos impactos ambientais causados pela
        indústria da moda.
      </p>

      <p>
        Nossa proposta é incentivar o consumo consciente por meio da reutilização de peças, dando
        uma nova vida a roupas e acessórios e promovendo uma forma mais sustentável de consumir
        moda.
      </p>
    </section>

    <hr />

    <section class="equipe">
      <h2>Sobre Nós</h2>
      <p>
        Somos estudantes do Instituto Federal Catarinense e desenvolvemos o VESTÆ durante o
        Hackathon com o propósito de unir tecnologia, criatividade e sustentabilidade em uma solução
        que incentive o consumo consciente e a reutilização de peças.
      </p>

      <div class="membros">
        <div class="membro">
          <img src="/sobre/alice.png" alt="Alice" />
          <p>Alice</p>
        </div>

        <div class="membro">
          <img src="/sobre/flavia.png" alt="Flavia" />
          <p>Flavia</p>
        </div>

        <div class="membro">
          <img src="/sobre/sofia.png" alt="Sofia" />
          <p>Sofia</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.sobre {
  max-width: 900px;
  margin: 50px auto;
  padding: 20px;
  cursor: default;
}

.projeto,
.equipe {
  text-align: center;
  cursor: default;
}

h2 {
  margin-bottom: 30px;
  font-size: 3rem;
  color: black;
  cursor: default;
}

p {
  max-width: 700px;
  margin: 0 auto 25px;
  line-height: 1.7;
  font-size: 22px;
  color: black;
  cursor: default;
}

hr {
  margin: 50px 0;
  border: none;
  border-top: 2px solid #a19a9a;
  cursor: default;
}

.membros {
  margin-top: 35px;
  cursor: default;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.membro {
  text-align: center;
  cursor: default;
}

.membro img {
  margin-top: 20px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  transition: 0.3s;
  cursor: default;
}

.membro img:hover {
  transform: scale(1.08);
}

.membro p {
  margin: 0;
  font-size: 25px;
  font-family: 'Marcellus', serif;
  color: black;
  cursor: default;
}

@media (max-width: 1024px) {
  h2 {
    font-size: 2.5rem;
  }

  .membros {
    justify-content: center;
    column-gap: 0;
  }

  .membro img {
    width: 140px;
    height: 140px;
    margin-top: 18px;
  }

  .membro p {
    font-size: 23px;
  }
}

@media (max-width: 768px) {
  h2 {
    margin-bottom: 20px;
    font-size: 2rem;
  }

  p {
    max-width: 600px;
    line-height: 1.5;
    font-size: 18px;
  }

  .membros {
    grid-template-columns: repeat(2, 140px);
    justify-content: center;
    column-gap: 40px;
    row-gap: 25px;
  }

  .membro img {
    width: 140px;
    height: 140px;
  }

  .membro p {
    font-size: 23px;
  }
}

@media (max-width: 490px) {
  .membro img {
    width: 120px;
    height: 120px;
  }

  .membro p {
    font-size: 20px;
  }

  .membros {
    column-gap: 20px;
  }
}
</style>
