import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BouquetView from '../views/BouquetView.vue'
import CartView from '../views/CartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/bouquet/:id/edit',
      name: 'Bouquet View',
      component: BouquetView
    },
    {
      path: '/cart',
      name: 'Cart View',
      component: CartView
    },
  ]
})

export default router
