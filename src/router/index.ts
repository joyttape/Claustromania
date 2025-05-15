import { createRouter, createWebHistory } from 'vue-router'
import Loogin from '../components/layout/Loogin.vue'
import SingUp from '../components/layout/SingUp.vue'
import Blank from '@/components/layout/Blank.vue'
import Salas from '@/components/layout/salas/Salas.vue'
import CadSala from '@/components/layout/CadSala.vue'
import Unidades from '@/components/layout/unidades/Unidades.vue'
import Funcionarios from '@/components/layout/Funcionairos/Funcionarios.vue'
import Clientes from '@/components/layout/Clientes/Clientes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'SingUp',
      component: SingUp,
    },
    {
    path: '/login',
    name: 'Login',
    component: Loogin,
    },
    {
      path: '/blank',
      name: 'Blank',
      component: Blank,
    },
    {
      path: '/salas',
      name: 'Salas',
      component: Salas,
    },
    {
      path: '/salas/cadastrosala',
      name: 'Cadastro Salas',
      component: CadSala,
    },
    {
      path: '/unidades',
      name: "Unidades",
      component: Unidades
    },
    {
      path: "/funcionarios",
      name: "Funcionários",
      component: Funcionarios
    },
    {
      path: '/clientes',
      name: "Clientes",
      component: Clientes
    }

  ]
})

export default router
