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
                      <div class="d-flex align-items-center justify-content-between mb-1">
                        <label for="jogos" class="form-label mb-0">Jogos Associados</label>
                        <button
                          v-if="!modoEdicaoJogos"
                          type="button"
                          class="btn btn-outline-light btn-sm"
                          @click="iniciarEdicaoJogos"
                        >
                          <i class="fa fa-edit me-1"></i> Adicionar
                        </button>
                      </div>

                      <div v-if="!modoEdicaoJogos" class="bg-dark rounded p-2">
                        <ul class="mb-0">
                          <li
                            v-for="nome in nomesJogosSelecionados"
                            :key="nome"
                            class="text-light"
                          >
                            {{ nome }}
                          </li>
                        </ul>
                      </div>

                      <div v-else>
                        <select
                          id="jogos"
                          class="form-select"
                          multiple
                          v-model="sala.JogosIds"
                          required
                          size="8"
                        >
                          <option
                            v-for="jogo in listaJogos"
                            :key="jogo.id"
                            :value="jogo.id"
                          >
                            {{ jogo.NomeJogo }}
                          </option>
                        </select>
                        <small class="text-light"
                          >Use Ctrl (Windows) ou Cmd (Mac) para selecionar vários
                          jogos.</small
                        >

                        <div class="d-flex gap-2 mt-2">
                          <button
                            type="button"
                            class="btn btn-success"
                            @click="modoEdicaoJogos = false"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            class="btn btn-secondary"
                            @click="cancelarEdicaoJogos"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
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
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const salaId = route.params.id as string

const sala = reactive({
  Numero: '',
  Jogadores: 0,
  Status: true,
  JogosIds: [] as number[]
})

const listaJogos = ref<{ id: number; NomeJogo: string }[]>([])

const modoEdicaoJogos = ref(false)
const jogosSelecionadosAntes = ref<number[]>([])

const iniciarEdicaoJogos = () => {
  jogosSelecionadosAntes.value = [...sala.JogosIds]
  modoEdicaoJogos.value = true
}

const cancelarEdicaoJogos = () => {
  sala.JogosIds = [...jogosSelecionadosAntes.value]
  modoEdicaoJogos.value = false
}

const nomesJogosSelecionados = computed(() => {
  return listaJogos.value
    .filter(jogo => sala.JogosIds.includes(jogo.id))
    .map(jogo => jogo.NomeJogo)
})

const buscarJogos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/jogos', {
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.status === 200) {
      listaJogos.value = response.data.map((jogo: any) => ({
        id: jogo.id,
        NomeJogo: jogo.NomeJogo
      }))
    }
  } catch (error) {
    console.error('Erro ao buscar jogos:', error)
    Swal.fire('Erro', 'Não foi possível carregar os jogos.', 'error')
  }
}

const carregarSala = async () => {
  try {
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

const salvarAlteracoes = async () => {
  try {
    const jogosSelecionados = listaJogos.value.filter(j =>
      sala.JogosIds.includes(j.id)
    )

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

onMounted(async () => {
  await buscarJogos()
  await carregarSala()

  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>
