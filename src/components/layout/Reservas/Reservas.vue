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
            <h2 class="mb-4">Reservas Cadastradas</h2>

            <div class="d-flex flex-wrap align-items-center mb-4 gap-2">
              <input
                type="text"
                v-model="searchTerm"
                class="form-control"
                style="min-width: 250px"
                placeholder="Pesquisar por ID ou cliente..."
              />

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Status:</label>
                <select v-model="selectedStatus" class="form-select">
                  <option value="">Todos</option>
                  <option value="reservado">Reservado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div class="form-check text-white ms-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="filtroHoje"
                  id="hojeCheck"
                />
                <label class="form-check-label" for="hojeCheck">Reservas do dia</label>
              </div>

              <router-link to="/reservas/form" class="btn btn-primary ms-auto">
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
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(reserva, index) in reservasFiltradas" :key="index">
                    <th scope="row">{{ reserva.id }}</th>
                    <td>{{ reserva.cliente }}</td>
                    <td>{{ formatDateTime(reserva.dataHora) }}</td>
                    <td>{{ reserva.status }}</td>
                    <td>{{ reserva.sala?.Numero || '-' }}</td>
                    <td v-if="reserva.status === 'reservado'">
                      <router-link :to="`/reservas/transacao/${reserva.id}`" class="btn btn-sm btn-outline-light">
                        Pagar
                      </router-link>
                    </td>
                    <td>
                      <router-link :to="`/reservas/detalhe/${reserva.id}`" class="btn btn-sm btn-outline-light">
                        Visualizar
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="reservasFiltradas.length === 0">
                    <td colspan="7" class="text-center text-white">Nenhuma reserva encontrada.</td>
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
        id: string
        cliente: string
        dataHora: string
        status: string
        sala: { id: number; Numero: string } | null
      }>,
      clientes: [] as Array<{ id: string; nome: string }>,
      salas: [] as Array<{ id: number; Numero: string }>,
      searchTerm: '',
      selectedStatus: '',
      filtroHoje: false
    }
  },
  computed: {
    reservasFiltradas() {
      let resultado = this.listareservas

      const termo = this.searchTerm.toLowerCase().trim()

      if (termo) {
        resultado = resultado.filter(
          (reserva) =>
            reserva.id.toLowerCase().includes(termo) ||
            reserva.cliente.toLowerCase().includes(termo)
        )
      }

      if (this.selectedStatus) {
        resultado = resultado.filter((reserva) => reserva.status === this.selectedStatus)
      }

      if (this.filtroHoje) {
        const hoje = new Date()
        resultado = resultado.filter((reserva) => {
          if (!reserva.dataHora) return false
          const dataReserva = new Date(reserva.dataHora)
          return (
            dataReserva.getDate() === hoje.getDate() &&
            dataReserva.getMonth() === hoje.getMonth() &&
            dataReserva.getFullYear() === hoje.getFullYear()
          )
        })
      }

      return resultado
    }
  },
  methods: {
    async buscarReservas() {
      try {
        const [resReservas, resClientes, resSalas] = await Promise.all([
          axios.get('http://localhost:3000/reservas'),
          axios.get('http://localhost:3000/clientes'),
          axios.get('http://localhost:3000/salas')
        ])

        this.clientes = resClientes.data
        this.salas = resSalas.data

        if (resReservas.status === 200) {
            this.listareservas = resReservas.data.map((item: any) => {
              const clienteObj = this.clientes.find((c) => String(c.id) === String(item.cliente_id))
              const salaObj = this.salas.find((s) => String(s.id) === String(item.sala_id))

              return {
                id: item.id,
                cliente: clienteObj ? clienteObj.nome : 'Desconhecido',
                dataHora:
                  item.data_reserva && item.hora_reserva
                    ? new Date(`${item.data_reserva}T${item.hora_reserva}`).toISOString()
                    : '',
                status: item.status,
                sala: salaObj ? { id: salaObj.id, Numero: salaObj.Numero } : null
              }
            })
          }

      } catch (error) {
        console.error('Erro ao buscar reservas:', error)
      }
    },
    formatDateTime(dateTimeString: string): string {
      if (!dateTimeString) return '-'
      const date = new Date(dateTimeString)
      return date.toLocaleString()
    }
  },
  mounted() {
    const script = document.createElement('script')
    script.src = '/src/components/js/maincode.js'
    script.async = true
    document.body.appendChild(script)

    this.buscarReservas()
  },
  components: {
    NavHeaderBarVue,
    NavSideBarVue,
    FooterBarVue
  }
})
</script>
