<template>
  <div>
    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />

      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/salas" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Cadastro de Sala</h6>

                <form @submit.prevent="cadastrarSala">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="numero" class="form-label">Número da Sala</label>
                      <input
                        type="text"
                        class="form-control"
                        id="numero"
                        v-model="sala.Numero"
                        required
                      />
                    </div>

                    <div class="col-md-6">
                      <label for="jogadores" class="form-label">Capacidade de Jogadores</label>
                      <input
                        type="number"
                        class="form-control"
                        id="jogadores"
                        v-model="sala.Jogadores"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="jogos" class="form-label">Jogos Associados</label>
                    <select
                      id="jogos"
                      class="form-select"
                      multiple
                      v-model="sala.JogosIds"
                      required
                    >
                      <option
                        v-for="jogo in listaJogos"
                        :key="jogo.id"
                        :value="jogo.id"
                      >
                        {{ jogo.NomeJogo }}
                      </option>
                    </select>
                    <small class="text-light">Use Ctrl (Windows) ou Cmd (Mac) para selecionar vários jogos.</small>
                  </div>

                  <button type="submit" class="btn btn-primary">Salvar</button>
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

const sala = reactive({
  Numero: '',
  Jogadores: '',
  JogosIds: [] as number[] // IDs dos jogos selecionados
})

const listaJogos = ref<{ id: number; NomeJogo: string }[]>([])

onMounted(() => {
  // Substitua por chamada real à API
  listaJogos.value = [
    { id: 1, NomeJogo: 'Mistério no Museu' },
    { id: 2, NomeJogo: 'Laboratório do Tempo' },
    { id: 3, NomeJogo: 'O Segredo do Cofre' }
  ]
})

const cadastrarSala = () => {
  console.log('Sala cadastrada:', sala)
  alert(`Sala ${sala.Numero} cadastrada com sucesso!`)
  limparFormulario()
}

const limparFormulario = () => {
  Object.assign(sala, {
    Numero: '',
    Jogadores: '',
    JogosIds: []
  })
}
</script>
