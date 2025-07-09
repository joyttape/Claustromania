import { createRouter, createWebHistory } from 'vue-router'
import Loogin from '../components/layout/Loogin.vue'
import SingUp from '../components/layout/SingUp.vue'
import Blank from '@/components/layout/Blank.vue'
import Salas from '@/components/layout/salas/Salas.vue'
import Unidades from '@/components/layout/unidades/Unidades.vue'
import Funcionarios from '@/components/layout/Funcionarios/Funcionarios.vue'
import Clientes from '@/components/layout/Clientes/Clientes.vue'
import FormFuncionarios from '@/components/layout/Funcionarios/FormFuncionarios.vue'
import FormClientes from '@/components/layout/Clientes/FormClientes.vue'
import FormUnidades from '@/components/layout/unidades/FormUnidades.vue'
import FuncionariosDetail from '@/components/layout/Funcionarios/FuncionariosDetail.vue'
import ClientesDetail from '@/components/layout/Clientes/ClientesDetail.vue'
import UnidadesDetail from '@/components/layout/unidades/UnidadesDetail.vue'
import Jogos from '@/components/layout/Jogos/Jogos.vue'
import JogosForm from '@/components/layout/Jogos/JogosForm.vue'
import SalasForm from '@/components/layout/salas/SalasForm.vue'
import Reservas from '@/components/layout/Reservas/Reservas.vue'
import ReservasForm from '@/components/layout/Reservas/ReservasForm.vue'
import ReservasDetail from '@/components/layout/Reservas/ReservasDetail.vue'
import Transacao from '@/components/layout/Reservas/Transacao.vue'
import SalasDetail from '@/components/layout/salas/SalasDetail.vue'
import JogosDetail from '@/components/layout/Jogos/JogosDetail.vue'
import Caixa from '@/components/layout/Caixa/Caixa.vue'
import FormCaixa from '@/components/layout/Caixa/FormCaixa.vue'
import CaixaDetail from '@/components/layout/Caixa/CaixaDetail.vue'

import { Form } from 'react-router-dom'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/singup',
      name: 'Singup',
      component: SingUp,
    },
    {
    path: '/',
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
      path: '/unidades',
      name: "Unidades",
      component: Unidades
    },
    {
      path: '/funcionarios',
      name: 'Funcionários',
      component: Funcionarios
    },
    {
      path: '/funcionarios/detalhe/:id',
      name: 'DetalhesFunc',
      component: FuncionariosDetail
    },
    {
      path: '/clientes',
      name: "Clientes",
      component: Clientes
    },
    {
      path: '/funcionarios/form',
      name: 'CadastroFuncionario',
      component: FormFuncionarios
    },
    {
      path: '/clientes/formclientes',
      name: 'CadastroCliente',
      component: FormClientes
    },
    {
      path: '/unidades/form',
      name: "CadastroUnidade",
      component: FormUnidades
    },
    {
      path: '/clientes/detalhe/:id',
      name: "DetalhesCli",
      component: ClientesDetail
    },
    {
      path: '/unidades/detalhe/:id',
      name: "DetalhesUni",
      component: UnidadesDetail
    },
    {
      path: '/jogos',
      name: 'Jogos',
      component: Jogos
    },
    {
     path: '/jogos/form',
     name: 'FormJogos',
     component: JogosForm
    },
    {
     path: '/salas/form',
     name: 'FormSalas',
     component: SalasForm
    },
    {
     path: '/reservas',
     name: 'Reservas',
     component: Reservas
    },
    {
     path: '/reservas/form',
     name: 'FormReservas',
     component: ReservasForm
    },
    {
      path: '/reservas/detalhe/:id',
      name: "DetalhesReserva",
      component: ReservasDetail
    },
    {
      path: '/reservas/transacao/:id',
      name: "Transacao",
      component: Transacao
    },
    {
     path: '/salas/detalhe/:id',
     name: 'DetalhesSala',
     component: SalasDetail
    },
    {
     path: '/jogos/detalhe/:id',
     name: 'DetalhesJogo',
     component: JogosDetail
    },
    {
      path: '/caixa',
      name: 'Caixa',
      component: Caixa
    },
    {
      path: '/caixa/form',
      name: 'FormCaixa',
      component: FormCaixa
    },
    {
      path: '/caixa/form',
      name: 'FormCaixa',
      component: FormCaixa
    },
    {
      path: '/caixa/detalhe/:id',
      name: 'CaixaDetalhe',
      component: CaixaDetail
    }
  ]
})

export default router
