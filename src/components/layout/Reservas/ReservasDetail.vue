<template>
  <div>
    <div id="spinner" class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />

      <div class="content">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/reservas" class="btn btn-outline-light mb-3">
            ← Voltar
          </router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <form @submit.prevent="salvarAlteracoes">
                  <h6 class="mb-4">Detalhes da Reserva</h6>

                  <div class="row mb-3">
                    <div class="col-md-4">
                      <label class="form-label">ID</label>
                      <input type="text" class="form-control" v-model="reserva.id"/>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Cliente</label>
                      <input type="text" class="form-control" v-model="reserva.cliente"/>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Data</label>
                      <input type="date" class="form-control" v-model="reserva.data" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-4">
                      <label class="form-label">Sala</label>
                      <input type="text" class="form-control" v-model="reserva.sala" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Jogos</label>
                      <input type="text" class="form-control" v-model="reserva.jogos" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Valor</label>
                      <input type="text" class="form-control" v-model="reserva.valor" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-4">
                      <label class="form-label">Status</label>
                      <select class="form-select" v-model="reserva.status">
                        <option value="pendente">Pendente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="concluída">Concluída</option>
                      </select>
                    </div>
                  </div>

                  <div class="d-flex justify-content-start">
                    <button type="submit" class="btn btn-success me-2">Salvar</button>
                    <button type="button" class="btn btn-danger" @click="cancelarReserva">Cancelar Reserva</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <FooterBarVue />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const reserva = reactive({
  id: 'RESV-001',
  cliente: 'João da Silva',
  data: '2025-06-03',
  status: 'pendente',
  sala: 'Sala 01',
  jogos: 'Mistério Sombrio, Labirinto Perdido',
  valor: 'R$ 180,00'
})

const salvarAlteracoes = () => {
  alert("Reserva atualizada! (simulação)")
  console.log("Reserva atualizada:", reserva)
}

const cancelarReserva = () => {
  if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
    reserva.status = 'cancelada'
    alert("Reserva cancelada! (simulação)")
  }
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

