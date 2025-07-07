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
            <h2 class="mb-4">Salas</h2>

            <!-- Filtros -->
            <div class="d-flex flex-wrap align-items-center mb-4 gap-2">
              <input
                type="text"
                v-model="searchTerm"
                class="form-control"
                style="min-width: 250px"
                placeholder="Pesquisar por número ou jogo..."
              />

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Status:</label>
                <select v-model="selectedStatus" class="form-select">
                  <option value="">Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Filtrar por jogo:</label>
                <select v-model="selectedJogo" class="form-select">
                  <option value="">Todos</option>
                  <option
                    v-for="jogo in jogosUnicos"
                    :key="jogo"
                    :value="jogo"
                  >
                    {{ jogo }}
                  </option>
                </select>
              </div>

              <router-link to="/salas/form" class="btn btn-primary ms-auto">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <!-- Tabela -->
            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Número</th>
                    <th>Capacidade Jogadores</th>
                    <th>Status</th>
                    <th>Jogos</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sala, index) in salasFiltradas" :key="index">
                    <th>{{ sala.id }}</th>
                    <td>{{ sala.Numero }}</td>
                    <td>{{ sala.Jogadores }}</td>
                    <td>{{ sala.Status ? 'Ativo' : 'Inativo' }}</td>
                    <td>
                      <ul class="mb-0 ps-3">
                        <li v-for="jogo in sala.Jogos" :key="jogo.id">
                          {{ jogo.NomeJogo }}
                        </li>
                      </ul>
                    </td>
                    <td>
                      <router-link :to="`/salas/detalhe/${sala.id}`" class="btn btn-sm btn-outline-light">
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
        const response = await axios.get('http://localhost:3000/salas', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.status === 200) {
          this.listasalas = response.data.map((item: any) => ({
            id: item.id,
            Numero: item.Numero || '',
            Jogadores: item.Jogadores || 0,
            Status: !!item.Status,
            Jogos: item.Jogos || []
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar salas:', error)
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
