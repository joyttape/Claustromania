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
                <i class="fa fa-calendar-check me-2 text-primary"></i>Reservas
              </h2>
              <router-link to="/reservas/form" class="btn btn-primary ms-auto enhanced-btn">
                <i class="fa fa-plus me-2"></i>Nova Reserva
              </router-link>
            </div>

            <div class="row mb-4">
              <div class="col-md-4 mb-3">
                <div class="stat-card bg-dark text-white rounded p-3">
                  <div class="d-flex align-items-center">
                    <div class="stat-icon bg-primary rounded-circle me-3">
                      <i class="fa fa-calendar-alt"></i>
                    </div>
                    <div>
                      <h4 class="mb-0 text-primary">{{ totalReservas }}</h4>
                      <small class="text-muted">Total de Reservas</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <div class="stat-card bg-dark text-white rounded p-3">
                  <div class="d-flex align-items-center">
                    <div class="stat-icon bg-warning rounded-circle me-3">
                      <i class="fa fa-clock"></i>
                    </div>
                    <div>
                      <h4 class="mb-0 text-warning">{{ reservasHoje }}</h4>
                      <small class="text-muted">Reservas Hoje</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <div class="stat-card bg-dark text-white rounded p-3">
                  <div class="d-flex align-items-center">
                    <div class="stat-icon bg-success rounded-circle me-3">
                      <i class="fa fa-check-circle"></i>
                    </div>
                    <div>
                      <h4 class="mb-0 text-success">{{ reservasConfirmadas }}</h4>
                      <small class="text-muted">Confirmadas</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex flex-wrap align-items-center mb-4 gap-3">
              <div class="search-container position-relative">
                <i class="fa fa-search search-icon text-muted"></i>
                <input
                  type="text"
                  v-model="searchTerm"
                  class="form-control enhanced-input"
                  style="min-width: 250px; padding-left: 2.5rem;"
                  placeholder="Pesquisar por ID ou cliente..."
                />
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Status:</label>
                <select v-model="selectedStatus" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="reservado">Reservado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div class="form-check text-white ms-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="filtroHoje"
                  id="hojeCheck"
                />
                <label class="form-check-label fw-semibold" for="hojeCheck">
                  <i class="fa fa-calendar-day me-1"></i>Reservas do dia
                </label>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Ordem:</label>
                <select v-model="ordemAlfabetica" class="form-select enhanced-select">
                  <option value="">Padrão</option>
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white enhanced-table">
                <thead class="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Data e Hora</th>
                    <th>Status</th>
                    <th>Sala</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(reserva, index) in reservasFiltradas"
                    :key="index"
                    class="enhanced-row"
                  >
                    <th class="fw-bold text-white">{{ reserva.id }}</th>
                    <td>{{ reserva.cliente }}</td>
                    <td>{{ formatDateTime(reserva.dataHora) }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="getStatusClass(reserva.status)"
                      >
                        <i :class="getStatusIcon(reserva.status)" class="me-1"></i>
                        {{ getStatusText(reserva.status) }}
                      </span>
                    </td>
                    <td>{{ reserva.sala?.Numero || '-' }}</td>
                    <td>
                      <div class="d-flex gap-2">
                        <router-link 
                          v-if="reserva.status === 'reservado'"
                          :to="`/reservas/transacao/${reserva.id}`" 
                          class="btn btn-sm btn-success enhanced-btn-sm"
                        >
                          <i class="fa fa-credit-card me-1"></i>Pagar
                        </router-link>
                        <router-link 
                          :to="`/reservas/detalhe/${reserva.id}`" 
                          class="btn btn-sm btn-outline-light enhanced-btn-sm"
                        >
                          <i class="fa fa-eye me-1"></i>Visualizar
                        </router-link>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="reservasFiltradas.length === 0">
                    <td colspan="6" class="text-center text-white py-5">
                      <div class="empty-state">
                        <i class="fa fa-calendar-times fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">Nenhuma reserva encontrada</h5>
                        <p class="text-muted">Tente ajustar os filtros ou adicionar uma nova reserva.</p>
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
  name: 'Reservas',
  data() {
    return {
      listareservas: [] as Array<{
        id: string
        cliente: string
        dataHora: string
        status: string
        sala: { id: number; Numero: string } | null
      }>,
      clientes: [] as Array<{ id: string; nome: string }>,
      salas: [] as Array<{ id: number; Numero: string }>,
      searchTerm: '',
      selectedStatus: '',
      filtroHoje: false,
      ordemAlfabetica: ''
    }
  },

  computed: {
    // Lógica simplificada como no código de funcionários
    reservasFiltradas() {
      let resultado = this.listareservas

      const termo = this.searchTerm.toLowerCase().trim()

      if (termo) {
        resultado = resultado.filter(
          (reserva) =>
            reserva.id.toLowerCase().includes(termo) ||
            reserva.cliente.toLowerCase().includes(termo)
        )
      }

      if (this.selectedStatus) {
        resultado = resultado.filter((reserva) => reserva.status === this.selectedStatus)
      }

      if (this.filtroHoje) {
        const hoje = new Date()
        resultado = resultado.filter((reserva) => {
          if (!reserva.dataHora) return false
          const dataReserva = new Date(reserva.dataHora)
          return (
            dataReserva.getDate() === hoje.getDate() &&
            dataReserva.getMonth() === hoje.getMonth() &&
            dataReserva.getFullYear() === hoje.getFullYear()
          )
        })
      }

      if (this.ordemAlfabetica === 'asc') {
        resultado = resultado.slice().sort((a, b) => a.cliente.localeCompare(b.cliente))
      } else if (this.ordemAlfabetica === 'desc') {
        resultado = resultado.slice().sort((a, b) => b.cliente.localeCompare(a.cliente))
      }

      return resultado
    },

    // Cards de estatísticas mantidos
    totalReservas() {
      return this.listareservas.length
    },
    reservasHoje() {
      const hoje = new Date()
      return this.listareservas.filter(reserva => {
        if (!reserva.dataHora) return false
        const dataReserva = new Date(reserva.dataHora)
        return (
          dataReserva.getDate() === hoje.getDate() &&
          dataReserva.getMonth() === hoje.getMonth() &&
          dataReserva.getFullYear() === hoje.getFullYear()
        )
      }).length
    },
    reservasConfirmadas() {
      return this.listareservas.filter(reserva => reserva.status === 'confirmado').length
    }
  },

  methods: {
    async buscarReservas() {
      try {
        const [resReservas, resClientes, resSalas] = await Promise.all([
          axios.get('http://localhost:3000/reservas', {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': '69420'
            }
          }),
          axios.get('http://localhost:3000/clientes', {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': '69420'
            }
          }),
          axios.get('http://localhost:3000/salas', {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': '69420'
            }
          })
        ])

        this.clientes = resClientes.data
        this.salas = resSalas.data

        if (resReservas.status === 200) {
          this.listareservas = resReservas.data.map((item: any) => {
            const clienteObj = this.clientes.find((c) => String(c.id) === String(item.cliente_id))
            const salaObj = this.salas.find((s) => String(s.id) === String(item.sala_id))

            return {
              id: item.id,
              cliente: clienteObj ? clienteObj.nome : 'Desconhecido',
              dataHora:
                item.data_reserva && item.hora_reserva
                  ? new Date(`${item.data_reserva}T${item.hora_reserva}`).toISOString()
                  : '',
              status: item.status,
              sala: salaObj ? { id: salaObj.id, Numero: salaObj.Numero } : null
            }
          })
        }

      } catch (error) {
        console.error('Erro ao buscar reservas:', error)
      }
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

    getStatusClass(status: string) {
      const classes = {
        'reservado': 'bg-warning text-dark',
        'confirmado': 'bg-success',
        'cancelado': 'bg-danger'
      }
      return classes[status as keyof typeof classes] || 'bg-secondary'
    },

    getStatusIcon(status: string) {
      const icons = {
        'reservado': 'fa fa-clock',
        'confirmado': 'fa fa-check-circle',
        'cancelado': 'fa fa-times-circle'
      }
      return icons[status as keyof typeof icons] || 'fa fa-question-circle'
    },

    getStatusText(status: string) {
      const texts = {
        'reservado': 'Reservado',
        'confirmado': 'Confirmado',
        'cancelado': 'Cancelado'
      }
      return texts[status as keyof typeof texts] || status
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

    this.buscarReservas()
  }
})
</script>

<style scoped>
/* Melhorias visuais mantendo o tema escuro original */
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

.stat-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
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

.empty-state {
  padding: 2rem;
}

.empty-state i {
  opacity: 0.3;
}

/* Responsividade */
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 1rem;
  }
  
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

.enhanced-btn:focus,
.enhanced-btn-sm:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}
</style>

