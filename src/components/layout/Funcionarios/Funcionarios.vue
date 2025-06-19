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

            <div class="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                class="form-control w-50"
                placeholder="Pesquisar funcionário..."
              />
              <router-link to="/funcionarios/form" class="btn btn-primary ms-3">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Cargo</th>
                    <th scope="col">Salário</th>
                    <th scope="col">Data Contratação</th>
                    <th scope="col">Turno</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(funcionario, index) in listafuncionarios" :key="index">
                    <th scope="row">{{ funcionario.id }}</th>
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
      }>
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
              status: !!item.status  // Corrigido para usar o campo certo e garantir booleano
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
