<template>
  <div>
    <div id="spinner" class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
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
              <h2 class="mb-0">
                <i class="fas fa-door-open me-2"></i>Salas
                <span class="badge bg-primary ms-2">{{ salasFiltradas.length }}</span>
              </h2>
              <router-link to="/salas/form" class="btn btn-primary">
                <i class="fa fa-plus me-2"></i>Nova Sala
              </router-link>
            </div>

            <div class="row mb-4">
              <div class="col-md-4 mb-2">
                <div class="input-group">
                  <span class="input-group-text bg-dark text-light border-secondary">
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    v-model="searchTerm"
                    class="form-control"
                    placeholder="Pesquisar por número ou jogo..."
                  />
                </div>
              </div>

              <div class="col-md-3 mb-2">
                <select v-model="selectedStatus" class="form-select">
                  <option value="">Todos os Status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <div class="col-md-5 mb-2">
                <select v-model="selectedJogo" class="form-select">
                  <option value="">Todos os Jogos</option>
                  <option
                    v-for="jogo in jogosUnicos"
                    :key="jogo"
                    :value="jogo"
                  >
                    {{ jogo }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row g-4">
              <div v-for="(sala, index) in salasFiltradas" :key="index" class="col-lg-6 col-xl-4">
                <div class="card h-100 sala-card">
                  <div class="card-header text-light bg-dark d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="mb-0">
                        {{ sala.Numero }}
                      </h5>
                      <small class="text-muted">ID: {{ sala.id }}</small>
                    </div>
                    <span class="badge" :class="sala.Status ? 'bg-success' : 'bg-danger'">
                      {{ sala.Status ? 'Ativo' : 'Inativo' }}
                    </span>
                  </div>
                  
                  <div class="card-body">
                    <div class="mb-3">
                      <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-users text-primary me-2"></i>
                        <span class="fw-bold">Capacidade:</span>
                        <span class="ms-2">{{ sala.Jogadores }} jogadores</span>
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="d-flex align-items-center mb-2">
                        <i class="fas fa-gamepad text-success me-2"></i>
                        <span class="fw-bold">Jogos Associados:</span>
                        <span class="badge bg-danger ms-2">{{ sala.Jogos.length }}</span>
                      </div>
                      
                      <div v-if="sala.Jogos.length > 0" class="jogos-container">
                        <div 
                          v-for="jogo in sala.Jogos" 
                          :key="jogo.id" 
                          class="jogo-tag"
                        >
                          <i class="fas fa-puzzle-piece me-1"></i>
                          {{ jogo.NomeJogo }}
                        </div>
                      </div>
                      
                      <div v-else class="text-muted small">
                        <i class="fas fa-exclamation-triangle me-1"></i>
                        Nenhum jogo associado
                      </div>
                    </div>
                  </div>

                  <div class="card-footer bg-transparent">
                    <router-link 
                      :to="`/salas/detalhe/${sala.id}`" 
                      class="btn btn-link text-white w-100"
                    >
                      <i class="fas fa-eye me-2"></i>Visualizar Detalhes
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="salasFiltradas.length === 0" class="text-center py-5">
              <i class="fas fa-search fa-3x text-muted mb-3"></i>
              <h4 class="text-muted">Nenhuma sala encontrada</h4>
              <p class="text-muted">
                <span v-if="searchTerm || selectedStatus || selectedJogo">
                  Tente ajustar os filtros.
                </span>
                <router-link to="/salas/form" class="text-decoration-none">
                  cadastre uma nova sala
                </router-link>
              </p>
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
  name: 'Salas',
  data() {
    return {
      listasalas: [] as Array<{
        id: number
        Numero: string
        Jogadores: number
        Status: boolean
        Jogos: Array<{ id: number; NomeJogo: string }>
      }>,
      searchTerm: '',
      selectedStatus: '',
      selectedJogo: ''
    }
  },
  computed: {
    jogosUnicos(): string[] {
      const nomes = new Set<string>()
      this.listasalas.forEach(sala => {
        sala.Jogos.forEach(jogo => nomes.add(jogo.NomeJogo))
      })
      return Array.from(nomes).sort()
    },
    salasFiltradas() {
      let resultado = this.listasalas

      const termo = this.searchTerm.toLowerCase().trim()

      if (termo) {
        resultado = resultado.filter(s =>
          s.Numero.toLowerCase().includes(termo) ||
          s.Jogos.some(j => j.NomeJogo.toLowerCase().includes(termo))
        )
      }

      if (this.selectedStatus) {
        const ativo = this.selectedStatus === 'Ativo'
        resultado = resultado.filter(s => s.Status === ativo)
      }

      if (this.selectedJogo) {
        resultado = resultado.filter(s =>
          s.Jogos.some(j => j.NomeJogo === this.selectedJogo)
        )
      }

      return resultado
    }
  },
  methods: {
    async buscarSalas() {
  try {
    const [salasRes, salaJogosRes, jogosRes] = await Promise.all([
      api.get('/api/Sala'),
      api.get('/api/SalaJogo'),
      api.get('/api/Jogo')
    ]);

    const salas = salasRes.data;
    const salaJogos = salaJogosRes.data;
    const jogos = jogosRes.data;

    this.listasalas = salas.map((sala: any) => {
      const jogosRelacionados = salaJogos
        .filter((sj: any) => sj.fkSala === sala.id)
        .map((sj: any) => jogos.find((j: any) => j.id === sj.fkJogo))
        .filter((j: any) => j !== undefined);

      return {
        id: sala.id,
        Numero: sala.nome || 'Sem nome',
        Jogadores: sala.capacidade || 0,
        Status: !!sala.ativa,
        Jogos: jogosRelacionados.map((j: any) => ({
          id: j.id,
          NomeJogo: j.nome
        }))
      };
    });
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
  }
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

    this.buscarSalas()
  }
})
</script>

<style scoped>
.sala-card {
  background-color: #292d30;
  color: white;
  transition: all 0.3s ease;
  border-radius: 10px;
}

.sala-card:hover {
  transform: translateY(-5px);
}

.card-header {
  border-bottom: 1px solid #292d30;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

.card-footer {
  border-top: 1px solid #292d30;
}

.jogos-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 120px;
  overflow-y: auto;
}

.jogo-tag {
  background-color: #292d30;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  white-space: nowrap;

  border: 1px solid #d00e1e;
}

.jogos-container::-webkit-scrollbar {
  width: 4px;
}

.jogos-container::-webkit-scrollbar-track {
  background: #495057;
  border-radius: 2px;
}

.jogos-container::-webkit-scrollbar-thumb {
  background: #6c757d;
  border-radius: 2px;
}

.jogos-container::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

.input-group-text {
  border-color: #6c757d;
}

.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.btn-link.text-white:hover {
  background-color: #d00e1e;
  color: white;
}


@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sala-card {
  animation: fadeInUp 0.5s ease-out;
}

@media (max-width: 768px) {
  .jogos-container {
    max-height: 80px;
  }
  
  .jogo-tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
}
</style>


