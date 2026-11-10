<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <footer>
        <div class="conteudo">
            <div class="marca">
                <h1>
                    VESTÆ
                </h1>
                <p>
                    Vista histórias, compartilhe estilos
                </p>
            </div>
            
              <div class="rotas">
                <h2>
                    Explorar
                </h2>
                <ul>
                    <li><RouterLink to="/">Home</RouterLink></li>
                    <li><RouterLink to="/calcados">Calçados</RouterLink></li>
                    <li><RouterLink to="/masculino">Masculino</RouterLink></li>
                    <li><RouterLink to="/feminino">Feminino</RouterLink></li>
                    <li><RouterLink to="/acessorios">Acessórios</RouterLink></li>
                    <li><RouterLink to="/favoritos">Favoritos</RouterLink></li>
                    <li><RouterLink to="/anunciar">Quero Vender</RouterLink></li>
                    <li><RouterLink to="/perfil">Meu Perfil</RouterLink></li>
                    <li><RouterLink to="/sobre">Sobre Nós</RouterLink></li>
                </ul>
            </div>
                <div class="contato">
                    <h2>Contatos</h2>
                        <a href="https://wa.me/5547996259734" target="_blank">
                        <img src="/icons/whatsapp.svg" alt="WhatsApp">
                        <span>+55 (47) 99625-9734</span>
                        </a>

                        <a href="mailto:vestae.desapego@gmail.com">
                        <img src="/icons/mail.svg" alt="E-mail">
                        <span>vestae.desapego@gmail.com</span>
                        </a>
                        
                        <div class="icones">
                            <a href="https://www.instagram.com/vestae.desapego/?utm_source=ig_web_button_share_sheet"><img src="/icons/instagram.svg" alt="Instagram"></a>
                            <a href="#"><img src="/icons/x.svg" alt="Facebook"></a>
                        </div>
                </div>
            </div>
            
        <div class="direitos">
            <p>
                © 2026 VESTÆ. Todos os direitos reservados.
                Este site foi desenvolvido exclusivamente para fins educacionais
            </p>
        </div>
    </footer>
</template>

<style scoped>
footer{
  background-color: #C00B63;
  color: white;
  padding: 30px 35px;
  padding-bottom: 15px;
}

.conteudo{
  display: flex;
  justify-content: space-between;
  gap: 120px;
  align-items: flex-start;
}

.marca{
  margin-top: 100px;
}

.marca h1 {
  font-size: 2.2rem;
}

.marca p {
  font-size: 1.1rem;
}

.rotas h2{
  margin-bottom: 18px;
}

.rotas ul {
  list-style: none;
}

.rotas li {
  margin-bottom: 5px;
}

.rotas a {
  color: white;
  text-decoration: none;
}

.rotas a:hover {
  text-decoration: underline;
} 

.contato {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contato a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
}

.contato a:hover {
  text-decoration: underline;
}

.contato img {
  width: 28px;
  height: 28px;
}

.icones {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.icones img {
  width: 37px;
  height: 37px;
  object-fit: contain;
  transition: 0.2s;
}

.icones img:hover {
  transform: scale(1.1);
}

.direitos {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
}

.direitos p{
  font-size: 15px;
}

@media (max-width: 768px) {
  .conteudo {
    flex-direction: column;
    gap: 10px;
    padding: 0;
  }

  .resposivo{
    display: flex;
    gap: 80px;
  }
  .marca{
    margin-top: 8px;
  }

  .marca h1{
    font-size: 1.75rem;
  }

  .marca p{
    font-size: 1rem;
  }

  .rotas h2{
    font-size: 21px;
    margin-bottom: 8px;
  }

  .rotas li{
    margin-bottom: 5px;
  }

  .contato h2 {
    font-size: 21px;
    margin-bottom: 8px;
  }

  .contato img{
    width: 24px;
    height: 24px;
  }

  .direitos p{
    font-size: 12px;
  }

  .icones{
    margin-top: 0;
  }

  .icones img{
    width: 35px;
    height: 35px;
  }

  .direitos {
    margin-top: 15px;
    padding-top: 10px;
    line-height: 1.5;
  }
  
  .direitos p{
    font-size: 12px;
  }
}
</style>
