# VESTÆ - Projeto Hackathon

> Vista histórias, compartilhe estilos.


## Links de Acesso

* **Vercel:** [https://vestae-asf.vercel.app/](https://hackathon-vestae.vercel.app/)
* **Surge:** [https://vestae.surge.sh/](https://vestae.surge.sh/)

---

## Tema e Objetivo

O VESTÆ é uma plataforma de compra e venda de roupas, calçados e acessórios, criada com o objetivo de incentivar consumo consciente, moda sustentável, reutilização de peças e economia circular. 

A proposta do projeto é criar um espaço onde os usuários possam encontrar e comprar  peças de segunda mão por diferentes faixas de preço e também publicar seus próprios anúncios para vender produtos. Dessa forma, a plataforma busca tornar o processo de compra e venda mais acessível, prático e sustentável, com foco no município de Joinville.

Além da parte de comércio, o VESTÆ busca proporcionar uma experiência mais completa para os usuários, permitindo favoritar produtos, publicar anúncios, realizar avaliações e interagir com os itens disponíveis.


---

##  Funcionalidades do Projeto

* **Página inicial;**
* **Catálogo de produtos;** 
* **Organização dos produtos por categorias;**
* **Busca e navegação pelos produtos;**
* **Filtros de produtos;**
* **Página de detalhes de cada produto;**
* **Sistema de favoritos;**
* **Publicação de anúncios;**
* **Cadastro de usuários;**
* **Login;**
* **Sistema de sacola;**
* **Adição e remoção de produtos da sacola;**
* **Cálculo do valor total da compra;**
* **Processo de finalização da compra;**
* **Cadastro e validação de endereço;**
* **Seleção do método de pagamento;**
* **Armazenamento das informações do usuário.**

## Funcionalidades desenvolvidas

* **Página Inicial:** A página inicial apresenta a identidade do VESTÆ e sua proposta, permitindo que o usuário conheça a plataforma e tenha acesso às principais áreas do site. A partir dela, o usuário pode navegar pelos produtos em destaque, acessar categorias, avaliar o VESTÆ e encontrar diferentes funcionalidades da plataforma.
* **Categorias:** Os produtos são separados em quatro categorias: 
  * *Feminino*, *Masculino*, *Calçados* e *Acessórios*.

  Cada categoria possui sua própria página, facilitando a navegação e a busca pelos produtos.
* **Catálogo de Produtos:** A plataforma possui um catálogo de produtos com informações como: 
  * *Nome,* *Imagem,* *Descrição,* *Categoria,* *Tamanho,*
*Condição,* *Marca,* *Preço* e
*Disponibilidade.*
* **Filtros:** Além de navegar pela categorias, o usuário pode filtrar os produtos por preços. São eles: 
  * *até R$ 50*, *até R$ 100* e *até R$ 500.*
* **Página de detalhes do produto:** Cada produto possui uma página individual com informações mais completas. Nessa página é possível visualizar: 
  * *Imagem do produto,* *Nome,* *Preço,* *Descrição,* *Tamanho,* *Categoria,* *Status,* *Condição,* *Marca,* *Opção para favoritar e  adicionar à sacola* 
* **Favoritar:** O usuário pode favoritar produtos através do ícone de coração presente nos cards e na página de detalhes. Os produtos favoritados podem ser acessados posteriormente através da página Favoritos. Dessa forma, o usuário pode guardar peças para consultar posteriormente sem precisar procurá-las novamente no catálogo.
* **Sacola:** O sistema de sacola permite que o usuário organize os produtos que deseja comprar. É possível: 
  *  *Adicionar produtos,* *Visualizar os itens selecionados,* *Remover produtos,* *Verificar a quantidade de itens,* *Visualizar o valor total da compra* e *Prosseguir para o pagamento.* 

  Ao adicionar um produto, o sistema também apresenta uma confirmação informando que o item foi adicionado à sacola. O valor total é calculado automaticamente de acordo com os produtos adicionados.

* **Cadastro:** Foi desenvolvida uma página de cadastro para novos usuários. O formulário contém:
  *  *Nome completo,* *E-mail,* *Telefone,* *Senha,* *Confirmação de senha* e *Aceite dos Termos de Uso e Política de Privacidade.* 
  
  O cadastro possui validações para verificar:
  * *Preenchimento dos campos obrigatórios;*
  * *Formato do e-mail;*
  * *Formato do telefone;*
  * *Tamanho mínimo da senha;*
  * *Presença de letra e número na senha;*
  * *Igualdade entre senha e confirmação;*
  * *Existência de um e-mail já cadastrado.*
  
  Após o cadastro, o usuário é automaticamente registrado como usuário logado.

* **Login:** O sistema possui uma página de login com:
  * *E-mail;* *Senha;* e *Validação dos campos.*

  O usuário recebe mensagens de erro caso os dados estejam incorretos e uma confirmação quando o login é realizado com sucesso. Como o projeto foi desenvolvido sem backend, as informações necessárias para o funcionamento do cadastro e login são armazenadas no localStorage

* **Publicação de anúncios:** Uma das funcionalidades do VESTÆ é permitir que o usuário publique seus próprios anúncios. Na página de anúncio, é possível:
  * Selecionar uma imagem da peça;
  * Preencher os dados do produto;
  * Publicar o anúncio.
  
* **Meu Perfil:** A plataforma possui uma página de perfil do usuário. No perfil é possível:
  * *Visualizar o nome do usuário;*
  * *Adicionar ou alterar a foto de perfil;*
  * *Visualizar a quantidade de peças anunciadas;*
  * *Visualizar o impacto relacionado aos produtos anunciados;*
  * *Visualizar os próprios produtos publicados.*

  A foto de perfil também é armazenada no localStorage.

* **Avaliação dos produtos:** Também foi implementado um sistema de avaliação, permitindo que os usuários avaliem a plataforma após a experiência de compra. O usuário pode:
  * *Informar seu nome;*
  * *Escrever um comentário;*
  * *Selecionar uma nota de 1 a 5 estrelas;*
  * *Publicar sua avaliação.*

  O usuário também pode:
  * *Editar ou excluir sua avaliação;*

  Além da avaliação do usuário, a página inicial apresenta avaliações já cadastradas no projeto.

* **Pagamento:** Após selecionar os produtos, o usuário pode avançar para o processo de finalização da compra. O formulário possui campos relacionados à entrega e ao pagamento, incluindo:
  * *CEP;* *Bairro;* *Rua;* *Número;* *Complemento* e *Método de pagamento.* 

  O CEP é consultado através da API ViaCEP, permitindo preencher os dados do endereço.O campo de bairro também apresenta sugestões para facilitar o preenchimento.
O sistema verifica se os campos obrigatórios foram preenchidos e se o bairro selecionado é válido.

## Dificuldades encontradas

Durante o desenvolvimento do VESTÆ, o grupo encontrou dificuldades em diferentes etapas do projeto. Entre os principais desafios estiveram:
* Organizar as páginas e componentes;
* Implementar o sistema de filtros;
* Criar o sistema de publicação de anúncios;
* Implementar as avaliações;
* Criar o cadastro e login;
* Trabalhar com o localStorage;
* Criar a página de pagamento;
* Integrar as diferentes funcionalidades;
* Dificuldade para implementar APIs.

  As principais dificuldades foram relacionadas à integração dos códigos desenvolvidos por diferentes integrantes, principalmente durante a junção das páginas e componentes.

  Outro desafio foi adaptar partes do projeto para diferentes tamanhos de tela, como a responsividade do swiper e do menu hambúrguer

---

## Divisão das atividades

O projeto, no geral, foi dividido de uma forma colaborativa. As atividades foram divididas da seguinte forma:

| Integrante | Principais Responsabilidades / Componentes |
| :--- | :--- |
| **Alice** | Sacola (`CartItem`, `CartSummary`, `CartPanel`), ProdutoDetail, Login, Cadastro, Pagamento e Footer. |
| **Flavia** | Produtos (`ProductCard`, `ProductList`), Favoritos, Categorias (Masculino, Feminino, Acessórios, Calçados), Header e Perfil. |
| **Sofia** | Product.js, Home (`HomeView`, `AvaliacaoSection`, `BannerSection`, `CategoriasSection`, `DestaquesSection`, `StarRating`), Anunciar e Avaliações. |

---

## Como executar o projeto
### Aplicação

Para executar a aplicação, clone o repositório e instale as dependências:

```bash
git clone https://github.com/alicelanznaster/vestae-json-server.git
cd vestae
npm install
npm run dev
```

Caso o projeto já esteja clonado no computador, atualize os arquivos com `git pull` antes de executar.

### API

Em outro terminal, dentro da pasta do projeto, execute:

```bash
npm run api
```

### Versão do JSON Server

O projeto utiliza a versão `json-server@1.0.0-beta.15`.

### Divisão dos CRUDs

Cada integrante ficou responsável pelo desenvolvimento completo do CRUD de uma entidade do sistema, incluindo as operações de cadastro, consulta, atualização e exclusão.

- **Alice:** CRUD de usuários.
- **Sofia:** CRUD de produtos.
- **Flavia:** CRUD de pedidos.

