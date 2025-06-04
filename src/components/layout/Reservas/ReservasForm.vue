<template>
  <div>
    <NavHeaderBarVue />
    <div class="d-flex">
      <NavSideBarVue />
      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/reservas" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Cadastro de Reserva</h6>

                <form @submit.prevent="cadastrarReserva">
                  <div class="row mb-3">
                    <div class="col-md-4">
                      <label class="form-label">Data da Reserva</label>
                      <input type="date" class="form-control" v-model="reserva.data_reserva" required />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Hora da Reserva</label>
                      <input type="time" class="form-control" v-model="reserva.hora_reserva" required />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Número de Jogadores</label>
                      <input type="number" class="form-control" v-model="reserva.numero_jogadores" required min="1" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Valor Total (R$)</label>
                      <input type="number" class="form-control" v-model="reserva.valor_total" step="0.01" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Ocupado?</label>
                      <select class="form-select" v-model="reserva.ocupado" required>
                        <option :value="true">Sim</option>
                        <option :value="false">Não</option>
                      </select>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Sala</label>
                      <select class="form-select" v-model="reserva.sala" required>
                        <option disabled value="">Selecione uma sala</option>
                        <option v-for="s in salas" :key="s.id" :value="s.nome">
                          {{ s.nome }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Jogo</label>
                      <select class="form-select" v-model="reserva.jogo" required>
                        <option disabled value="">Selecione um jogo</option>
                        <option v-for="j in jogos" :key="j.id" :value="j.nome">
                          {{ j.nome }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">ID do Jogador</label>
                    <input type="number" class="form-control" v-model="reserva.fk_Jogador_Id" required />
                  </div>

                  <button type="submit" class="btn btn-primary">Salvar Reserva</button>
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
import { reactive, ref, onMounted } from 'vue'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'


const salas = ref([
  { id: 1, nome: 'Sala 01' },
  { id: 2, nome: 'Sala 02' },
  { id: 3, nome: 'Sala 03' }
])

const jogos = ref([
  { id: 1, nome: 'Mistério Sombrio' },
  { id: 2, nome: 'Labirinto Perdido' },
  { id: 3, nome: 'A Fuga do Faraó' }
])

const reserva = reactive({
  data_reserva: '',
  hora_reserva: '',
  numero_jogadores: 1,
  valor_total: 0.00,
  ocupado: false,
  sala: '',
  jogo: '',
  fk_Jogador_Id: null
})

const limparFormulario = () => {
  Object.assign(reserva, {
    data_reserva: '',
    hora_reserva: '',
    numero_jogadores: 1,
    valor_total: 0.00,
    ocupado: false,
    sala: '',
    jogo: '',
    fk_Jogador_Id: null
  })
}

const cadastrarReserva = () => {
  console.log('Reserva cadastrada:', reserva)
  alert('Reserva cadastrada com sucesso!')
  limparFormulario()
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>
