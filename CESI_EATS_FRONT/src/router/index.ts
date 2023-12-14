// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '/signin',
        name: 'Signin',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Signin.vue'),
      },
      {
        path: '/signup',
        name: 'Signup',
        component: () => import('@/views/Signup.vue')
      },
      {
        path: '/profil',
        name: 'Profil',
        component: () => import('@/views/Profil.vue')
      },
      {
        path: '/shop/:id',
        name: 'Shop',
        component: () => import('@/views/ShopView.vue')
      },
      {
        path: '/createarticle',
        name: 'New Article',
        component: () => import('@/views/ArticleCreationView.vue')
      },
      {
        path: '/myarticle',
        name: 'Mes articles',
        component: () => import('@/views/MenuCreationView.vue')
      },
      {
        path: '/mymenu',
        name: 'Mes menus',
        component: () => import('@/views/MyShopView.vue')
      },
      {
        path: '/command-restaurant',
        name: 'Mes commandes en cours',
        component: () => import('@/views/Restaurateur/RestoCommandView.vue')
      },
      {
        path: '/command-livreur',
        name: 'Commandes en cours',
        component: () => import('@/views/Livreur/LivreurCommandView.vue')
      },
      {
        path: '/creation-restaurant',
        name: 'Creation',
        component: () => import('@/views/Restaurateur/Restaurant.vue')
      },
      {
        path: '/historique',
        name: 'Historique',
        component: () => import('@/views/HistoricView.vue')
      },
      {
        path: '/home',
        name: 'Bienvenue',
        component: () => import('@/views/RestaurantView.vue')
      },
      {
        path: '/stat',
        name: 'Statistiques',
        component: () => import('@/views/RestoStatView.vue')
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
