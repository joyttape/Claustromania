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
            <h2 class="mb-4">Jogadores</h2>

            <!-- Barra de pesquisa e filtros -->
            <div class="d-flex flex-wrap align-items-center mb-4 gap-2">
              <input
                type="text"
                v-model="searchTerm"
                class="form-control"
                style="min-width: 250px;"
                placeholder="Pesquisar por nome ou CPF..."
              />

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Sexo:</label>
                <select v-model="selectedSexo" class="form-select">
                  <option value="">Todos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Ordem:</label>
                <select v-model="ordemAlfabetica" class="form-select">
                  <option value="">Padrão</option>
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </div>

              <router-link to="/clientes/formclientes" class="btn btn-primary ms-auto">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <!-- Tabela -->
            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Sexo</th>
                    <th>Data Nascimento</th>
                    <th>E-mail</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(jogador, index) in jogadoresFiltradosOrdenados" :key="index">
                    <th>{{ jogador.id }}</th>
                    <td>{{ jogador.nome }}</td>
                    <td>{{ jogador.cpf }}</td>
                    <td>{{ jogador.sexo }}</td>
                    <td>{{ formatarData(jogador.dataNascimento) }}</td>
                    <td>{{ jogador.email }}</td>
                    <td>
                      <router-link :to="`/clientes/detalhe/${jogador.id}`" class="btn btn-sm btn-outline-light">
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
      resultado = resultado.filter((j) =>
        j.nome.toLowerCase().includes(termo) || j.cpf.includes(termo)
      )
    }

    if (this.selectedSexo) {
      resultado = resultado.filter((j) =>
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
        const response = await axios.get('http://localhost:3000/clientes', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.status === 200) {
          this.listaclientes = response.data.map((item: any) => ({
            id: item.id,
            nome: item.Nome || item.nome || '',
            cpf: item.CPF || item.cpf || '',
            sexo: item.Sexo || item.sexo || '',
            dataNascimento: item.Data || item.dataNascimento || '',
            email: item.Email || item.email || ''
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
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

    this.buscarClientes()
  }
})
</script>
