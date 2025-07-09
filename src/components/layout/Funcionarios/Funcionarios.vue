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
                <i class="fa fa-puzzle-piece me-2 text-primary"></i>Funcionários
              </h2>
              <router-link to="/funcionarios/form" class="btn btn-primary ms-auto enhanced-btn">
                <i class="fa fa-plus me-2"></i>Novo Funcionário
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
                  placeholder="Pesquisar por nome ou cargo..."
                />
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Turno:</label>
                <select v-model="selectedTurno" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                  <option value="Integral">Integral</option>
                </select>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Status:</label>
                <select v-model="selectedStatus" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="Contratado">Contratado</option>
                  <option value="Demitido">Demitido</option>
                </select>
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
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Salário</th>
                    <th>Data Contratação</th>
                    <th>Turno</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(funcionario, index) in funcionariosFiltrados"
                    :key="index"
                    class="enhanced-row"
                  >
                    <th>{{ funcionario.id }}</th>
                    <td>{{ funcionario.nome }}</td>
                    <td>{{ funcionario.cargo }}</td>
                    <td>{{ funcionario.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
                    <td>{{ formatarData(funcionario.dataContratacao) }}</td>
                    <td>{{ funcionario.turno }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="funcionario.status ? 'bg-success' : 'bg-danger'"
                      >
                        {{ funcionario.status ? 'Contratado' : 'Demitido' }}
                      </span>
                    </td>
                    <td>
                      <router-link
                        :to="`/funcionarios/detalhe/${funcionario.id}`"
                        class="btn btn-sm btn-outline-light enhanced-btn-sm"
                      >
                        <i class="fa fa-eye me-1"></i>Visualizar
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="funcionariosFiltrados.length === 0">
                    <td colspan="8" class="text-center text-white py-5">
                      <div class="empty-state">
                        <i class="fa fa-user-times fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">Nenhum funcionário encontrado</h5>
                        <p class="text-muted">Tente ajustar os filtros ou adicionar um novo funcionário.</p>
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
  name: 'Funcionarios',
  data() {
    return {
      listafuncionarios: [] as Array<{
        id: string
        nome: string
        cargo: string
        salario: number
        dataContratacao: string
        turno: string
        status: boolean
      }>,
      searchTerm: '',
      selectedTurno: '',
      selectedStatus: '',
      ordemAlfabetica: ''
    }
  },

  computed: {
    funcionariosFiltrados() {
      let resultado = this.listafuncionarios

      const termo = this.searchTerm.toLowerCase().trim()

      if (termo) {
        resultado = resultado.filter((f) =>
          f.nome.toLowerCase().includes(termo) || f.cargo.toLowerCase().includes(termo)
        )
      }

      if (this.selectedTurno) {
        resultado = resultado.filter(
          (f) => f.turno.toLowerCase().trim() === this.selectedTurno.toLowerCase().trim()
        )
      }

      if (this.selectedStatus) {
        resultado = resultado.filter((f) =>
          f.status === (this.selectedStatus === 'Contratado')
        )
      }

      if (this.ordemAlfabetica === 'asc') {
        resultado = resultado.slice().sort((a, b) => a.nome.localeCompare(b.nome))
      } else if (this.ordemAlfabetica === 'desc') {
        resultado = resultado.slice().sort((a, b) => b.nome.localeCompare(a.nome))
      }

      return resultado
    }
  },

  methods: {
    async buscarFuncionarios() {
      try {
        const response = await axios.get('http://localhost:3000/funcionarios', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.status === 200) {
          this.listafuncionarios = response.data.map((item: any) => ({
            id: item.id,
            nome: item.nome || item.Nome || '',
            cargo: item.cargo || item.Cargo || '',
            salario: item.salario || item.Salário || 0,
            dataContratacao: item.dataContratacao || item.Data || '',
            turno: item.turno || item.Turno || '',
            status: !!item.status
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error)
      }
    },

    formatarData(dataISO: string): string {
      if (!dataISO) return ''
      const [ano, mes, dia] = dataISO.split('-')
      return `${dia}/${mes}/${ano}`
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

    this.buscarFuncionarios()
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

.enhanced-btn:focus,
.enhanced-btn-sm:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}


</style>