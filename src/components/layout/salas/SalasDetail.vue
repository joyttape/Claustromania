<template>
  <div>
    <div
      id="spinner"
      class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem;"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />

      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/salas" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Detalhes da Sala</h6>

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
                        v-model.number="sala.Jogadores"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="status" class="form-label">Status</label>
                    <select id="status" class="form-select" v-model="sala.Status" required>
                      <option :value="true">Ativo</option>
                      <option :value="false">Inativo</option>
                    </select>
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

                  <div class="d-flex justify-content-start mt-3">
                    <button type="submit" class="btn btn-success me-2">Salvar</button>
                    <button type="button" class="btn btn-danger" @click="excluirSala">Excluir</button>
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
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const salaId = route.params.id as string

// Estado reativo da sala com Status declarado e Jogadores como number
const sala = reactive({
  Numero: '',
  Jogadores: 0,
  Status: true,
  JogosIds: [] as number[]
})

// Lista de jogos para preencher select (pode ser dinâmico, fixo aqui para exemplo)
const listaJogos = ref<{ id: number; NomeJogo: string }[]>([
  { id: 1, NomeJogo: 'Mistério no Museu' },
  { id: 2, NomeJogo: 'Laboratório do Tempo' },
  { id: 3, NomeJogo: 'O Segredo do Cofre' }
])

// Carregar sala por ID
const carregarSala = async () => {
  try {
    console.log('Carregando sala com ID:', salaId)
    const response = await axios.get(`http://localhost:3000/salas/${salaId}`)
    const data = response.data

    sala.Numero = data.Numero ?? ''
    sala.Jogadores = data.Jogadores ?? 0
    sala.Status = data.Status ?? true
    sala.JogosIds = data.Jogos ? data.Jogos.map((j: any) => j.id) : []
  } catch (error) {
    console.error('Erro ao carregar sala:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao carregar sala!',
      text: 'Verifique o console para mais detalhes.'
    })
  }
}

// Salvar alterações da sala
const salvarAlteracoes = async () => {
  try {
    // Filtrar os objetos de jogos selecionados pelo id
    const jogosSelecionados = listaJogos.value.filter(jogo => sala.JogosIds.includes(jogo.id))

    const dadosParaSalvar = {
      Numero: sala.Numero,
      Jogadores: Number(sala.Jogadores),
      Status: sala.Status,
      Jogos: jogosSelecionados
    }

    await axios.put(`http://localhost:3000/salas/${salaId}`, dadosParaSalvar)

    await Swal.fire({
      icon: 'success',
      title: 'Sala atualizada com sucesso!',
      confirmButtonText: 'OK'
    })
    router.push('/salas')
  } catch (error) {
    console.error('Erro ao salvar alterações:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao salvar!',
      text: 'Tente novamente mais tarde.'
    })
  }
}

// Excluir sala
const excluirSala = async () => {
  const resultado = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não pode ser desfeita.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })

  if (resultado.isConfirmed) {
    try {
      await axios.delete(`http://localhost:3000/salas/${salaId}`)
      await Swal.fire({
        icon: 'success',
        title: 'Sala excluída com sucesso!',
        confirmButtonText: 'OK'
      })
      router.push('/salas')
    } catch (error) {
      console.error('Erro ao excluir sala:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir!',
        text: 'Tente novamente mais tarde.'
      })
    }
  }
}

onMounted(() => {
  carregarSala()
  // Se você realmente precisa carregar esse script, mantenha; se não, pode remover.
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>
