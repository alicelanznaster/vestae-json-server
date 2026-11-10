import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductList from '@/components/products/ProductList.vue'
import FemininoView from '../views/FemininoView.vue'
import MasculinoView from '../views/MasculinoView.vue'
import AcessoriosView from '../views/AcessoriosView.vue'
import CalcadosView from '../views/CalcadosView.vue'
import SobreView from '../views/SobreView.vue'
import FavoritosView from '../views/FavoritosView.vue'
import ProductDetail from '@/components/products/ProductDetail.vue'
import AnunciarView from '../views/AnunciarView.vue'
import PerfilView from '../views/PerfilView.vue'
import RatingView from '@/views/RatingView.vue'
import PagamentoView from '@/views/PagamentoView.vue'
import CadastroView from '@/views/CadastroView.vue'
import LoginView from '@/views/LoginView.vue'
import PedidosView from '@/views/PedidosView.vue'
import DetalhesPedidoView from '@/views/DetalhesPedidoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/masculino',
      name: 'masculino',
      component: MasculinoView,
    },
    {
      path: '/feminino',
      name: 'feminino',
      component: FemininoView,
    },
    {
      path: '/acessorios',
      name: 'acessorios',
      component: AcessoriosView,
    },
    {
      path: '/calcados',
      name: 'calcados',
      component: CalcadosView,
    },
    {
      path:'/sobre',
      name:'sobre',
      component: SobreView,
    },
    {
      path: '/produtos',
      name: 'products',
      component: ProductList,
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: FavoritosView,
    },
    {
      path: '/produto/:id',
      name: 'produto',
      component: ProductDetail,
    },
    {
      path: '/anunciar',
      name: 'anunciar',
      component: AnunciarView,
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView,
    },
    {
      path: '/pagamento',
      name: 'pagamento',
      component: PagamentoView,
    },
    {
      path: '/avaliacao',
      name: 'avaliacao',
      component: RatingView,
    },
    {
      path: '/cadastro',
      nome: 'cadastro',
      component: CadastroView, 
    }, 
    {
      path: '/login',
      nome: 'login',
      component: LoginView, 
    }, 
    {
      path: '/pedidos',
      nome: 'pedidos',
      component: PedidosView, 
    }, 
    {
      path: '/pedidos/:id',
      name: 'detalhes-pedido',
      component: DetalhesPedidoView,
    },
  ],
})

export default router
