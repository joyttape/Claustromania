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
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="mb-0 text-white">
                <i class="fa fa-user-tie me-2 text-primary"></i>Caixas
              </h2>
              
              <router-link to="/caixa/form" class="btn btn-primary ms-auto enhanced-btn">
                <i class="fa fa-plus me-2"></i>Abrir Caixa
              </router-link>
            </div>

            <div class="d-flex flex-wrap align-items-center mb-4 gap-3">
              <div class="search-container position-relative">
                <i class="fa fa-search search-icon text-muted"></i>
                <input
                  type="text"
                  v-model="searchTerm"
                  class="form-control enhanced-input"
                  style="min-width: 250px; padding-left: 2.5rem;"
                  placeholder="Pesquisar por ID ou funcionário..."
                />
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Status:</label>
                <select v-model="selectedStatus" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="Aberto">Aberto</option>
                  <option value="Fechado">Fechado</option>
                </select>
              </div>

              <div class="form-check text-white ms-3">
                <input class="form-check-input" type="checkbox" v-model="filtroHoje" id="hojeCheck" />
                <label class="form-check-label" for="hojeCheck">Abertos hoje</label>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white enhanced-table">
                <thead class="table-dark">
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
                  <tr v-for="(caixa, index) in caixasFiltrados" :key="index" class="enhanced-row">
                    <td>{{ caixa.Id }}</td>
                    <td>{{ formatDateTime(caixa.DataHoraAbertura) }}</td>
                    <td>{{ caixa.DataHoraFechamento ? formatDateTime(caixa.DataHoraFechamento) : '-' }}</td>
                    <td>{{ caixa.ValorInicial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
                    <td>{{ caixa.ValorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
                    <td>{{ caixa.TotalTransacoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
                    <td>
                      <span :class="{
                        'badge bg-success': caixa.Status === 'Aberto',
                        'badge bg-danger': caixa.Status === 'Fechado'
                      }">
                        {{ caixa.Status }}
                      </span>
                    </td>
                    <td>{{ getFuncionarioNome(caixa.funcionario_id) }}</td>
                    <td>
                      <router-link 
                        :to="`/caixa/detalhe/${caixa.Id}`" 
                        class="btn btn-sm btn-outline-light enhanced-btn-sm"
                      >
                        <i class="fa fa-eye me-1"></i>Visualizar
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="caixasFiltrados.length === 0">
                    <td colspan="9" class="text-center text-white py-5">
                      <div class="empty-state">
                        <i class="fa fa-cash-register fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">Nenhum caixa encontrado</h5>
                        <p class="text-muted">Tente ajustar os filtros ou abra um novo caixa.</p>
                      </div>
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
      return date.toLocaleString('pt-BR')
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

<style scoped>
.enhanced-btn {
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.enhanced-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.enhanced-btn-sm {
  transition: all 0.3s ease;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}
.enhanced-btn-sm:hover {
  transform: translateY(-1px);
}
.search-container {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}
.enhanced-input,
.enhanced-select {
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}
.enhanced-input:focus,
.enhanced-select:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  color: white;
}
.enhanced-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
.enhanced-select option {
  background-color: #6c757d;
  color: white;
}
.enhanced-table {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.enhanced-table thead th {
  background-color: #495057 !important;
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}
.enhanced-row {
  transition: all 0.3s ease;
}
.enhanced-row:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  transform: scale(1.01);
}
.empty-state {
  padding: 2rem;
}
.empty-state i {
  opacity: 0.3;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.enhanced-table tbody tr {
  animation: fadeIn 0.5s ease-in-out;
}
@media (max-width: 768px) {
  .d-flex.flex-wrap.align-items-center {
    flex-direction: column;
    align-items: stretch !important;
  }
  .d-flex.flex-wrap.align-items-center > * {
    margin-bottom: 0.5rem;
  }
  .enhanced-input {
    min-width: auto !important;
  }
}
</style>