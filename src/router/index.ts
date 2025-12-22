import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieLogView from '@/views/log/MovieLogView.vue'
import AddMovieLogView from '@/views/log/AddMovieLogView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/log', component: MovieLogView },
  { path: '/log/add/:id', component: AddMovieLogView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
