import DashboardLayout from '@/layout/DashboardLayout.vue'
import auth from '@/modules/auth'
import Register from '@/views/Auth/Register.vue'

import TicketsLayout from '@/views/Tickets/TicketsLayout.vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Auth/Login.vue'
import PatientsLayout from "@/views/Patients/PatientsLayout.vue";

const routes: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '/',
    component: DashboardLayout,
    meta: { auth: true },
    children: [
      {
        name: 'tickets',
        path: '/tickets',
        meta: { auth: true },
        component: TicketsLayout,
        children: [
          {
            name: 'tickets.home',
            path: '',
            meta: { auth: true },
            component: () => import('@/views/Tickets/TicketsHome.vue')
          }
        ]
      },
      {
        name: 'patients',
        path: '/patients',
        meta: { auth: true },
        component: PatientsLayout,
        children: [
          {
            name: 'patients.home',
            path: '',
            meta: { auth: true },
            component: () => import('@/views/Patients/PatientsHome.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { auth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { auth: false }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    if (!auth.isLoggedIn()) {
      next({
        name: 'login'
      })

      return
    }
  }

  next()
})

export default router
