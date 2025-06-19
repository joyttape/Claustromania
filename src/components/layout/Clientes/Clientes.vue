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
            <h2 class="mb-4">Jogadores</h2>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                class="form-control w-50"
                placeholder="Pesquisar jogador..."
              />
              <router-link to="/clientes/formclientes" class="btn btn-primary ms-3">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Sexo</th>
                    <th scope="col">Data Nascimento</th>
                    <th scope="col">E-mail</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(jogador, index) in listaclientes" :key="index">
                    <th scope="row">{{ jogador.id }}</th>
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
      }>
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
