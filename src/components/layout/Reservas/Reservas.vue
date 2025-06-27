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
            <h2 class="mb-4">Reservas Cadastradas</h2>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                class="form-control w-50"
                placeholder="Pesquisar reserva..."
              />
              <router-link to="/reservas/form" class="btn btn-primary ms-3">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Data e Hora</th>
                    <th scope="col">Status</th>
                    <th scope="col">Sala</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(reserva, index) in listareservas" :key="index">
                    <th scope="row">{{ reserva.id }}</th>
                    <td>{{ reserva.cliente }}</td>
                    <td>{{ formatDateTime(reserva.dataHora) }}</td>
                    <td>{{ reserva.status }}</td>
                    <td>{{ reserva.sala?.Numero || '-' }}</td>
                    <td>
                      <router-link :to="`/reservas/detalhe/${reserva.id}`" class="btn btn-sm btn-outline-light">
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
  name: 'Reservas',
  data() {
    return {
      listareservas: [] as Array<{
        id: number;
        cliente: string;
        dataHora: string;
        status: string;
        sala: {
          id: number;
          Numero: string;
        } | null;
      }>,
      clientes: [] as Array<{ id: number; nome: string }>,
      salas: [] as Array<{ id: number; Numero: string }>
    }
  },
  methods: {
    async buscarReservas() {
      try {
        const [resReservas, resClientes, resSalas] = await Promise.all([
          axios.get('http://10.210.8.51:3000/reservas'),
          axios.get('http://10.210.8.51:3000/clientes'),
          axios.get('http://10.210.8.51:3000/salas')
        ]);

        this.clientes = resClientes.data
        this.salas = resSalas.data

        if (resReservas.status === 200) {
          this.listareservas = resReservas.data.map((item: any) => {
            const clienteObj = this.clientes.find(c => c.id === item.cliente_id)
            const salaObj = this.salas.find(s => s.id === item.sala_id)

            return {
              id: item.id,
              cliente: clienteObj ? clienteObj.nome : 'Desconhecido',
              dataHora: item.data_reserva && item.hora_reserva ? 
                new Date(`${item.data_reserva}T${item.hora_reserva}`).toISOString() :
                '',
              status: item.status,
              sala: salaObj ? { id: salaObj.id, Numero: salaObj.Numero } : null
            }
          });
          console.log('Reservas carregadas:', this.listareservas);
        }
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
      }
    },
    formatDateTime(dateTimeString: string): string {
      if (!dateTimeString) return '-';
      const date = new Date(dateTimeString);
      return date.toLocaleString();
    }
  },
  mounted() {
    const script = document.createElement('script')
    script.src = '/src/components/js/maincode.js'
    script.async = true
    document.body.appendChild(script)
    this.buscarReservas();
  },
  components: {
    NavHeaderBarVue,
    NavSideBarVue,
    FooterBarVue
  }
})
</script>

