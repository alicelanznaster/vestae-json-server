import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/masculino',
      name: 'masculino',
      component: () => import('../views/MasculinoView.vue'),
    },
    {
      path: '/feminino',
      name: 'feminino',
      component: () => import('../views/FemininoView.vue'),
    },
    {
      path: '/acessorios',
      name: 'acessorios',
      component: () => import('../views/AcessoriosView.vue'),
    },
    {
      path: '/calcados',
      name: 'calcados',
      component: () => import('../views/CalcadosView.vue'),
    },
    {
      path:'/sobre',
      name:'sobre',
      component: () => import('../views/SobreView.vue'),
    },
    {
      path: '/produtos',
      name: 'products',
      component: () => import('../components/products/ProductList.vue'),
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: () => import('../views/FavoritosView.vue'),
    },
    {
      path: '/produto/:id',
      name: 'produto',
      component: () => import('../components/products/ProductDetail.vue'),
    },
    {
      path: '/anunciar',
      name: 'anunciar',
      component: () => import('../views/AnunciarView.vue'),
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/PerfilView.vue'),
    },
    {
      path: '/pagamento',
      name: 'pagamento',
      component: () => import('../views/PagamentoView.vue'),
    },
    {
      path: '/avaliacao',
      name: 'avaliacao',
      component: () => import('../views/RatingView.vue'),
    },
    {
      path: '/cadastro',
      nome: 'cadastro',
      component: () => import('../views/CadastroView.vue'), 
    }, 
    {
      path: '/login',
      nome: 'login',
      component: () => import('../views/LoginView.vue'), 
      
    }, 
    {
      path: '/pedidos',
      nome: 'pedidos',
      component: () => import('../views/PedidosView.vue'), 
    }, 
    {
      path: '/pedidos/:id',
      name: 'detalhes-pedido',
      component: () => import('../views/DetalhesPedidoView.vue'),
    },
    {
      path: '/configuracoes',
      nome: 'configuracoes',
      component: () => import('../views/ConfiguracoesView.vue'),
    },
  ]
})

export default router
