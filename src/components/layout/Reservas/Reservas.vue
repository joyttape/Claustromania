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
                    <td>{{ reserva.dataHora }}</td>
                    <td>{{ reserva.status }}</td>
                    <td>{{ reserva.sala.Numero }}</td>
                    <td>
                      <router-link to="/reservas/detalhe" class="btn btn-sm btn-outline-light">
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
        };
      }>
    }
  },
  methods: {
    buscarReservas() {
      this.listareservas.push({
        id: 101,
        cliente: "João da Silva",
        dataHora: "2025-06-03 18:00",
        status: "Confirmada",
        sala: {
          id: 2,
          Numero: "0002"
        }
      });

      this.listareservas.push({
        id: 102,
        cliente: "Maria Oliveira",
        dataHora: "2025-06-04 15:00",
        status: "Pendente",
        sala: {
          id: 1,
          Numero: "0001"
        }
      });

      this.listareservas.push({
        id: 103,
        cliente: "Carlos Santos",
        dataHora: "2025-06-05 20:00",
        status: "Cancelada",
        sala: {
          id: 3,
          Numero: "0003"
        }
      });
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
