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
            <h2 class="mb-4">Caixas</h2>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                class="form-control w-50"
                placeholder="Pesquisar por ID ou Funcionário..."
              />
              <router-link to="/caixa/form" class="btn btn-success ms-3">
                <i class="fa fa-plus me-2"></i>Abrir Caixa
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Abertura</th>
                    <th>Fechamento</th>
                    <th>Valor Inicial</th>
                    <th>Valor Final</th>
                    <th>Total Transações</th>
                    <th>Status</th>
                    <th>Funcionário</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(caixa, index) in listaCaixas" :key="index">
                    <td>{{ caixa.Id }}</td>
                    <td>{{ caixa.DataHoraAbertura }}</td>
                    <td>{{ caixa.DataHoraFechamento || '-' }}</td>
                    <td>R$ {{ caixa.ValorInicial.toFixed(2) }}</td>
                    <td>R$ {{ caixa.ValorFinal.toFixed(2) }}</td>
                    <td>R$ {{ caixa.TotalTransacoes.toFixed(2) }}</td>
                    <td>{{ caixa.Status }}</td>
                    <td>{{ caixa.fk_Funcionario_Id }}</td>
                    <td>
                      <router-link :to="`/caixas/${caixa.Id}`" class="btn btn-sm btn-outline-light">
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

export default defineComponent({
  name: 'Caixas',
  data() {
    return {
      listaCaixas: [] as Array<{
        Id: number;
        DataHoraAbertura: string;
        DataHoraFechamento: string | null;
        ValorInicial: number;
        ValorFinal: number;
        TotalTransacoes: number;
        Status: string;
        Observacoes: string;
        fk_Funcionario_Id: number;
      }>
    }
  },
  methods: {
    buscarCaixas() {
      // Exemplo com dados mockados
      this.listaCaixas = [
        {
          Id: 1,
          DataHoraAbertura: '2025-06-01 08:00:00',
          DataHoraFechamento: '2025-06-01 18:00:00',
          ValorInicial: 100.0,
          ValorFinal: 850.0,
          TotalTransacoes: 750.0,
          Status: 'Fechado',
          Observacoes: '',
          fk_Funcionario_Id: 101
        },
        {
          Id: 2,
          DataHoraAbertura: '2025-06-02 08:00:00',
          DataHoraFechamento: null,
          ValorInicial: 150.0,
          ValorFinal: 0.0,
          TotalTransacoes: 0.0,
          Status: 'Aberto',
          Observacoes: '',
          fk_Funcionario_Id: 102
        }
      ];
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

    this.buscarCaixas();
  }
})
</script>
