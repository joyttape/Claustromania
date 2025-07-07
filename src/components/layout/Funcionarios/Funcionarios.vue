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
            <h2 class="mb-4">Funcionários</h2>

            <div class="d-flex flex-wrap align-items-center mb-4 gap-2">
              <input
                type="text"
                v-model="searchTerm"
                class="form-control"
                style="min-width: 250px"
                placeholder="Pesquisar por nome ou cargo..."
              />

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Turno:</label>
                <select v-model="selectedTurno" class="form-select">
                  <option value="">Todos</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Status:</label>
                <select v-model="selectedStatus" class="form-select">
                  <option value="">Todos</option>
                  <option value="Contratado">Contratado</option>
                  <option value="Demitido">Demitido</option>
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

              <router-link to="/funcionarios/form" class="btn btn-primary ms-auto">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
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
                  <tr v-for="(funcionario, index) in funcionariosFiltrados" :key="index">
                    <th>{{ funcionario.id }}</th>
                    <td>{{ funcionario.nome }}</td>
                    <td>{{ funcionario.cargo }}</td>
                    <td>{{ funcionario.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
                    <td>{{ formatarData(funcionario.dataContratacao) }}</td>
                    <td>{{ funcionario.turno }}</td>
                    <td>{{ funcionario.status ? 'Contratado' : 'Demitido' }}</td>
                    <td>
                      <router-link :to="`/funcionarios/detalhe/${funcionario.id}`" class="btn btn-sm btn-outline-light">
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
