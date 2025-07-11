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
                <i class="fa fa-user-tie me-2 text-primary"></i>Jogadores
              </h2>

              <router-link to="/clientes/formclientes" class="btn btn-primary ms-auto enhanced-btn">
                <i class="fa fa-plus me-2"></i>Novo Jogador
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
                  placeholder="Pesquisar por nome ou CPF..."
                />
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Sexo:</label>
                <select v-model="selectedSexo" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
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
                    <th scope="col" class="sortable-header">ID</th>
                    <th scope="col" class="sortable-header" @click="ordenarNome()">
                      Nome
                    </th>
                    <th scope="col">CPF</th>
                    <th scope="col">Sexo</th>
                    <th scope="col">Data Nascimento</th>
                    <th scope="col">E-mail</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(jogador, index) in jogadoresFiltradosOrdenados" :key="index" class="enhanced-row">
                    <th scope="col">{{ jogador.id }}</th>
                    <td>{{ jogador.nome }}</td>
                    <td>{{ jogador.cpf }}</td>
                    <td>{{ jogador.sexo }}</td>
                    <td>{{ formatarData(jogador.dataNascimento) }}</td>
                    <td>{{ jogador.email }}</td>
                    <td>
                      <router-link :to="`/clientes/detalhe/${jogador.id}`" class="btn btn-sm btn-outline-light enhanced-btn-sm">
                        <i class="fa fa-eye me-1"></i>Visualizar
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="jogadoresFiltradosOrdenados.length === 0">
                    <td colspan="7" class="text-center text-white py-5">
                      <div class="empty-state">
                        <i class="fa fa-user-times fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">Nenhum jogador encontrado</h5>
                        <p class="text-muted">Tente ajustar os filtros ou cadastre um novo jogador.</p>
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
import { api } from '@/common/http'

export default defineComponent({
  name: 'Clientes',
  data() {
    return {
      listaclientes: [] as Array<{
        id: string
        nome: string
        cpf: string
        sexo: string
        dataNascimento: string
        email: string
        nivelExperiencia: number
      }>,
      searchTerm: '',
      selectedSexo: '',
      ordemAlfabetica: ''
    }
  },

  computed: {
    jogadoresFiltradosOrdenados() {
            let resultado = this.listaclientes
            const termo = this.searchTerm.toLowerCase().trim()

            if (termo) {
              resultado = resultado.filter(j =>
                j.nome.toLowerCase().includes(termo) || j.cpf.includes(termo))
            }

            if (this.selectedSexo) {
              resultado = resultado.filter(j =>
                j.sexo.toLowerCase().trim() === this.selectedSexo.toLowerCase().trim()
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
    async buscarClientes() {
      try {
        const response = await api.get('/api/Cliente')
        if (response.status === 200) {
          this.listaclientes = response.data.map((item: any) => ({
            id: item.id,
            nome: item.pessoa?.nome || '',
            cpf: item.pessoa?.cpf || '',
            sexo: item.pessoa?.sexo || '',
            dataNascimento: item.pessoa?.dataNascimento || '',
            email: item.pessoa?.email || '',
            nivelExperiencia: item.nivelExperiencia || 0
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      }
    },
    
    formatarData(dataISO: string): string {
    if (!dataISO) return '';
    
    try {
      const [dataParte] = dataISO.split('T');
    
      const [ano, mes, dia] = dataParte.split('-');
      

      if (ano && mes && dia) {
        return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
      }
    } catch (e) {
      console.error('Erro ao formatar data:', e);
    }
    
    return dataISO;
  },
    
    ordenarNome() {
      this.ordemAlfabetica = this.ordemAlfabetica === 'asc' ? 'desc' : 'asc'
    },
    
    getSortIcon() {
      if (this.ordemAlfabetica === 'asc') return 'fa-sort-up text-primary'
      if (this.ordemAlfabetica === 'desc') return 'fa-sort-down text-primary'
      return 'fa-sort text-muted'
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

    this.buscarClientes()
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

.enhanced-input {
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.enhanced-input:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  color: white;
}

.enhanced-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.enhanced-select {
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.enhanced-select:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  color: white;
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

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}

.sortable-header:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
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

.sortable-header:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.enhanced-btn:focus,
.enhanced-btn-sm:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}
</style>

