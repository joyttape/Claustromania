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
                <h6 class="mb-4">Detalhes Sala</h6>

                <form @submit.prevent="salvarAlteracoes">
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

                  <div class="d-flex justify-content-start">
                    <button type="submit" class="btn btn-success me-2">Salvar</button>
                    <button type="button" class="btn btn-danger" @click="cancelarAlteracoes">Cancelar</button>
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
import { reactive, ref, onMounted } from 'vue'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const sala = reactive({
  Numero: '',
  Jogadores: '',
  JogosIds: [] as number[] 
})

const listaJogos = ref<{ id: number; NomeJogo: string }[]>([])

onMounted(() => {
  
  listaJogos.value = [
    { id: 1, NomeJogo: 'Mistério no Museu' },
    { id: 2, NomeJogo: 'Laboratório do Tempo' },
    { id: 3, NomeJogo: 'O Segredo do Cofre' }
  ]
})

const salvarAlteracoes = () => {
  alert("Sala atualizada! (simulação)")
  console.log("Sala atualizada:", sala)
}

const cancelarAlteracoes = () => {
  if (confirm("Tem certeza que deseja cancelar as alterações?")) {
    alert("Alterações canceladas! (simulação)")
  }
}


</script>
