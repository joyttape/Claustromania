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
                    <td>{{ formatDateTime(caixa.DataHoraAbertura) }}</td>
                    <td>{{ caixa.DataHoraFechamento ? formatDateTime(caixa.DataHoraFechamento) : '-' }}</td>
                    <td>R$ {{ caixa.ValorInicial.toFixed(2) }}</td>
                    <td>R$ {{ caixa.ValorFinal.toFixed(2) }}</td>
                    <td>R$ {{ caixa.TotalTransacoes.toFixed(2) }}</td>
                    <td>{{ caixa.Status }}</td>
                    <td>{{ getFuncionarioNome(caixa.funcionario_id) }}</td>
                    <td>
                      <router-link :to="`/caixa/detalhe/${caixa.Id}`" class="btn btn-sm btn-outline-light">
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
        funcionario_id: string;
      }>,
      listaFuncionarios: [] as Array<{
        id: string;
        nome: string;
      }>
    }
  },
  methods: {
    async buscarCaixas() {
      try {
        const [caixasResponse, funcionariosResponse] = await Promise.all([
          axios.get('http://10.210.8.51:3000/caixas'),
          axios.get('http://10.210.8.51:3000/funcionarios')
        ]);

        if(caixasResponse.status === 200){
          this.listaCaixas = caixasResponse.data.map((item: any) => ({
            Id: item.id,
            DataHoraAbertura: item.data_abertura,
            DataHoraFechamento: item.data_fechamento,
            ValorInicial: item.valor_abertura || 0,
            ValorFinal: item.valor_fechamento || 0,
            TotalTransacoes: item.total_transacoes || 0,
            Status: item.status,
            Observacoes: item.observacao,
            funcionario_id: item.funcionario_id
          }));
          
          console.log('Dados dos caixas:', this.listaCaixas);
        }

        if (funcionariosResponse.status === 200) {
          this.listaFuncionarios = funcionariosResponse.data;
          console.log('Dados dos funcionários:', this.listaFuncionarios); 
        }

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    },
    getFuncionarioNome(funcionarioId: string): string {
        const funcionario = this.listaFuncionarios.find(f => f.id === funcionarioId);
        return funcionario ? funcionario.nome : 'Desconhecido';
    },
    formatDateTime(dateTimeString: string): string {
      if (!dateTimeString) return '-';
      const date = new Date(dateTimeString);
      return date.toLocaleString();
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