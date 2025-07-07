<template>
  <div>
    <div
      id="spinner"
      class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />
      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <div class="row bg-secondary rounded mx-0 p-4">
            <h2 class="mb-4">Caixas</h2>

            <!-- Filtros -->
            <div class="d-flex flex-wrap align-items-center mb-4 gap-2">
              <input
                type="text"
                v-model="searchTerm"
                class="form-control"
                style="min-width: 250px"
                placeholder="Pesquisar por ID..."
              />

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Status:</label>
                <select v-model="selectedStatus" class="form-select">
                  <option value="">Todos</option>
                  <option value="Aberto">Aberto</option>
                  <option value="Fechado">Fechado</option>
                </select>
              </div>

              <div class="form-check text-white ms-3">
                <input class="form-check-input" type="checkbox" v-model="filtroHoje" id="hojeCheck" />
                <label class="form-check-label" for="hojeCheck">Abertos hoje</label>
              </div>

              <router-link to="/caixa/form" class="btn btn-success ms-auto">
                <i class="fa fa-plus me-2"></i>Abrir Caixa
              </router-link>
            </div>

            <!-- Tabela -->
            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Abertura</th>
                    <th>Fechamento</th>
                    <th>Valor Inicial</th>
                    <th>Valor Final</th>
                    <th>Total Transações</th>
                    <th>Status</th>
                    <th>Funcionário</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(caixa, index) in caixasFiltrados" :key="index">
                    <td>{{ caixa.Id }}</td>
                    <td>{{ formatDateTime(caixa.DataHoraAbertura) }}</td>
                    <td>{{ caixa.DataHoraFechamento ? formatDateTime(caixa.DataHoraFechamento) : '-' }}</td>
                    <td>R$ {{ caixa.ValorInicial.toFixed(2) }}</td>
                    <td>R$ {{ caixa.ValorFinal.toFixed(2) }}</td>
                    <td>R$ {{ caixa.TotalTransacoes.toFixed(2) }}</td>
                    <td>{{ caixa.Status }}</td>
                    <td>{{ getFuncionarioNome(caixa.funcionario_id) }}</td>
                    <td>
                      <router-link :to="`/caixa/detalhe/${caixa.Id}`" class="btn btn-sm btn-outline-light">
                        Visualizar
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <FooterBarVue />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import axios from 'axios'

export default defineComponent({
  name: 'Caixas',
  data() {
    return {
      listaCaixas: [] as Array<{
        Id: string
        DataHoraAbertura: string
        DataHoraFechamento: string | null
        ValorInicial: number
        ValorFinal: number
        TotalTransacoes: number
        Status: string
        Observacoes: string
        funcionario_id: string
      }>,
      listaFuncionarios: [] as Array<{
        id: string
        nome: string
      }>,
      searchTerm: '',
      selectedStatus: '',
      filtroHoje: false
    }
  },
  computed: {
    caixasFiltrados() {
      let resultado = this.listaCaixas

      const termo = this.searchTerm.toLowerCase().trim()

      if (termo) {
        resultado = resultado.filter(
          (caixa) =>
            caixa.Id.toLowerCase().includes(termo) ||
            this.getFuncionarioNome(caixa.funcionario_id).toLowerCase().includes(termo)
        )
      }

      if (this.selectedStatus) {
        resultado = resultado.filter((caixa) => caixa.Status === this.selectedStatus)
      }

      if (this.filtroHoje) {
        const hoje = new Date()
        resultado = resultado.filter((caixa) => {
          const dataAbertura = new Date(caixa.DataHoraAbertura)
          return (
            dataAbertura.getDate() === hoje.getDate() &&
            dataAbertura.getMonth() === hoje.getMonth() &&
            dataAbertura.getFullYear() === hoje.getFullYear()
          )
        })
      }

      return resultado
    }
  },
  methods: {
    async buscarCaixas() {
      try {
        const [caixasResponse, funcionariosResponse] = await Promise.all([
          axios.get('http://localhost:3000/caixas'),
          axios.get('http://localhost:3000/funcionarios')
        ])

        if (caixasResponse.status === 200) {
          this.listaCaixas = caixasResponse.data.map((item: any) => {
            const statusStr = (item.status || '').toString().trim().toLowerCase()
            const isAberto =
              statusStr === 'aberto' &&
              (!item.data_fechamento || item.data_fechamento === null || item.data_fechamento === '')

            return {
              Id: item.id,
              DataHoraAbertura: item.data_abertura,
              DataHoraFechamento: item.data_fechamento,
              ValorInicial: item.valor_abertura || 0,
              ValorFinal: item.valor_fechamento || 0,
              TotalTransacoes: item.total_transacoes || 0,
              Status: isAberto ? 'Aberto' : 'Fechado',
              Observacoes: item.observacao,
              funcionario_id: item.funcionario_id
            }
          })
        }

        if (funcionariosResponse.status === 200) {
          this.listaFuncionarios = funcionariosResponse.data
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    },
    getFuncionarioNome(funcionarioId: string): string {
      const funcionario = this.listaFuncionarios.find((f) => f.id === funcionarioId)
      return funcionario ? funcionario.nome : 'Desconhecido'
    },
    formatDateTime(dateTimeString: string): string {
      if (!dateTimeString) return '-'
      const date = new Date(dateTimeString)
      return date.toLocaleString()
    }
  },
  components: {
    NavHeaderBarVue,
    NavSideBarVue,
    FooterBarVue
  },
  mounted() {
    const script = document.createElement('script')
    script.src = '/src/components/js/maincode.js'
    script.async = true
    document.body.appendChild(script)

    this.buscarCaixas()
  }
})
</script>
