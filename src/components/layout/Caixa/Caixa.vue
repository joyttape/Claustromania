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
                      <th>Nome</th>
                      <th>Abertura</th>
                      <th>Fechamento</th>
                      <th>Valor Inicial</th>
                      <th>Valor Final</th>
                      <th>Total Transações</th>
                      <th>Status</th>
                      <th>Funcionário</th>
                      <th>Unidade</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(caixa, index) in caixasFiltrados" :key="index" class="enhanced-row">
                      <td>{{ caixa.id }}</td>
                      <td>{{ caixa.nome }}</td>
                      <td>{{ formatDateTime(caixa.dataHoraAbertura) }}</td>
                      <td>{{ caixa.dataHoraFechamento ? formatDateTime(caixa.dataHoraFechamento) : '-' }}</td>
                      <td>{{ formatCurrency(caixa.valorInicial ?? 0) }}</td>
                      <td>{{ formatCurrency(caixa.valorFinal ?? 0) }}</td>
                      <td>{{ formatCurrency(caixa.totalTransacoes ?? 0) }}</td>
                      <td>
                        <span :class="{
                          'badge bg-success': caixa.status === 'Aberto',
                          'badge bg-danger': caixa.status === 'Fechado',
                          'badge bg-warning': caixa.status !== 'Aberto' && caixa.status !== 'Fechado'
                        }">
                          {{ caixa.status }}
                        </span>
                      </td>
                      <td>{{ caixa.funcionario?.pessoa.nome }}</td>
                      <td>{{ caixa.unidade?.nome }}</td>
                      <td>
                        <router-link 
                          :to="`/caixa/detalhe/${caixa.id}`" 
                          class="btn btn-sm btn-outline-light enhanced-btn-sm"
                        >
                          <i class="fa fa-eye me-1"></i>Visualizar
                        </router-link>
                      </td>
                    </tr>
                    <tr v-if="caixasFiltrados.length === 0">
                      <td colspan="11" class="text-center text-white py-5">
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
import { api } from '@/common/http'

enum StatusCaixa {
  Aberto = 'Aberto',
  Fechado = 'Fechado'
}

interface CaixaResponse {
  id: string
  nome?: string
  dataHoraAbertura: string
  dataHoraFechamento?: string | null
  valorInicial?: number
  valorFinal?: number
  totalTransacoes?: number
  status?: string
  observacoes?: string
  unidade?: {
    id: string
    nome: string
  }
  funcionario?: {
    id: string
    pessoa: {
      nome: string
    }
  }
}

export default defineComponent({
  name: 'Caixas',
  data() {
    return {
      carregando: true,
      listaCaixas: [] as CaixaResponse[],
      searchTerm: '',
      selectedStatus: '',
      filtroHoje: false
    }
  },
  computed: {
    caixasFiltrados(): CaixaResponse[] {
      let resultado = [...this.listaCaixas]

      const termo = this.searchTerm.toLowerCase().trim()
      if (termo) {
        resultado = resultado.filter(
          (caixa) =>
            caixa.id.toLowerCase().includes(termo) ||
            caixa.nome?.toLowerCase().includes(termo) ||
            caixa.funcionario?.pessoa?.nome.toLowerCase().includes(termo)
        )
      }

      if (this.selectedStatus) {
        resultado = resultado.filter(
          (caixa) => caixa.status?.toLowerCase() === this.selectedStatus.toLowerCase()
        )
      }

      if (this.filtroHoje) {
        const hoje = new Date().toISOString().split('T')[0]
        resultado = resultado.filter((caixa) => {
          const data = new Date(caixa.dataHoraAbertura).toISOString().split('T')[0]
          return data === hoje
        })
      }

      resultado.sort(
        (a, b) =>
          new Date(b.dataHoraAbertura).getTime() - new Date(a.dataHoraAbertura).getTime()
      )

      return resultado
    }
  },
  methods: {
    async buscarCaixas() {
      try {
        const response = await api.get<CaixaResponse[]>('/api/Caixa', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.status === 200) {
          this.listaCaixas = response.data.map((item) => ({
            id: item.id,
            nome: item.nome || 'Caixa sem nome',
            dataHoraAbertura: item.dataHoraAbertura,
            dataHoraFechamento: item.dataHoraFechamento || null,
            valorInicial: item.valorInicial || 0,
            valorFinal: item.valorFinal || 0,
            totalTransacoes: item.totalTransacoes || 0,
            status: this.determinarStatusCaixa(item),
            observacoes: item.observacoes || '',
            unidade: item.unidade || { id: '', nome: 'N/A' },
            funcionario: item.funcionario || { id: '', pessoa: { nome: 'N/A' } }
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar caixas:', error)
      } finally {
        this.carregando = false
      }
    },

    determinarStatusCaixa(caixa: CaixaResponse): string {
      if (!caixa.dataHoraFechamento) return StatusCaixa.Aberto
      return caixa.status || StatusCaixa.Fechado
    },

    formatDateTime(dateTimeString: string): string {
      if (!dateTimeString) return '-'
      const date = new Date(dateTimeString)
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatCurrency(value: number): string {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      })
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