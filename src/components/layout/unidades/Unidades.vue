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
            <h2 class="mb-4">Unidades Cadastradas</h2>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                class="form-control w-50"
                placeholder="Pesquisar unidade..."
              />
              <router-link to="/unidades/form" class="btn btn-primary ms-3">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Capacidade</th>
                    <th scope="col">Horário Abertura</th>
                    <th scope="col">Horário Fechamento</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(unidade, index) in listaunidades" :key="index">
                    <th scope="row">{{ unidade.id }}</th>
                    <td>{{ unidade.NomeUnidade }}</td>
                    <td>{{ unidade.Capacidade }}</td>
                    <td>{{ unidade.Horario_Abert }}</td>
                    <td>{{ unidade.Horario_Fecha }}</td>
                    <td>{{ unidade.Telefone }}</td>
                    <td>{{ unidade.Status ? 'Ativo' : 'Inativo' }}</td>
                    <td>
                      <router-link :to="`/unidades/detalhe/${unidade.id}`" class="btn btn-sm btn-outline-light">
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
  name: 'Unidades',
  data() {
    return {
      listaunidades: [] as Array<{
        id: number
        NomeUnidade: string
        Capacidade: number
        Horario_Abert: string
        Horario_Fecha: string,
        Telefone: string
        Status: boolean
      }>
    }
  },

  methods: {
  async buscarUnidades() {
    try {
      const response = await axios.get('http://localhost:3000/unidades', {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
      });

      if (response.status === 200) {
        this.listaunidades = response.data.map((item: any) => ({
          id: item.id,
          NomeUnidade: item.nome || 'Não informado',
          Capacidade: item.capacidade || 0,
          Horario_Abert: item.horarioAbertura || '',
          Horario_Fecha: item.horarioFechamento || '',
          Telefone: item.telefone || '',
          Status: item.status // Note que na API está "status" (minúsculo)
        }));
        console.log('Unidades carregadas:', this.listaunidades); // Para debug
      }
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
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

    this.buscarUnidades()
  }
})
</script>
