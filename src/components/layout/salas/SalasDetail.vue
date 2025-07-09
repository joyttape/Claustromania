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
                <h6 class="mb-3">Dados da sala</h6>
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
                    <label for="unidade" class="form-label">Unidade</label>
                    <select id="unidade" class="form-select" v-model="sala.unidade_id" required>
                      <option disabled value="">Selecione uma unidade</option>
                      <option v-for="unidade in listaUnidades" :key="unidade.id" :value="unidade.id">
                        {{ unidade.nome }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                      <label class="form-label mb-0">Jogos Associados</label>
                      <button
                        v-if="!modoEdicaoJogos"
                        type="button"
                        class="btn btn-outline-light btn-sm"
                        @click="iniciarEdicaoJogos"
                      >
                        <i class="fa fa-edit me-1"></i> Editar Jogos
                      </button>
                    </div>

                    <div v-if="!modoEdicaoJogos" class="bg-dark rounded p-3">
                      <div class="text-muted small mb-2">
                        {{ jogosSelecionados.length }} jogo{{ jogosSelecionados.length !== 1 ? 's' : '' }} selecionado{{ jogosSelecionados.length !== 1 ? 's' : '' }}
                      </div>
                      <div v-if="jogosSelecionados.length > 0" class="row g-2">
                        <div v-for="jogo in jogosSelecionados" :key="jogo.id" class="col-md-6 col-lg-4">
                          <div class="card bg-success text-white">
                            <div class="card-body p-2">
                              <div class="d-flex align-items-center">
                                <i class="fas fa-check-circle me-2 text-white"></i>
                                <div>
                                  <div class="fw-bold small">{{ jogo.NomeJogo }}</div>
                                  <div class="small">
                                    <span class="badge bg-light text-dark me-1">{{ jogo.Dificuldade || 'N/A' }}</span>
                                    <span class="badge bg-warning text-dark">{{ formatarPreco(jogo.Preco) }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center text-muted py-3">
                        <i class="fas fa-gamepad fa-2x mb-2"></i>
                        <p class="mb-0">Nenhum jogo associado a esta sala</p>
                      </div>
                    </div>

                    <div v-else>
                      <div class="text-muted small mb-3">
                        Selecione os jogos que estarão disponíveis nesta sala ({{ jogosSelecionados.length }} selecionado{{ jogosSelecionados.length !== 1 ? 's' : '' }})
                      </div>
                      
                      <div class="mb-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Pesquisar jogos..."
                          v-model="filtroJogos"
                        />
                      </div>

                      <div class="mb-3">
                        <button type="button" class="btn btn-outline-primary btn-sm me-2" @click="selecionarTodos">
                          ✓ Selecionar Todos
                        </button>
                        <button type="button" class="btn btn-outline-primary btn-sm" @click="limparSelecao">
                          ✗ Limpar Seleção
                        </button>
                      </div>

                      <div class="row g-3" style="max-height: 400px; overflow-y: auto;">
                        <div 
                          v-for="jogo in jogosFiltrados" 
                          :key="jogo.id" 
                          class="col-md-6 col-lg-4"
                        >
                          <div 
                            class="card h-100 jogo-card"
                            :class="{ 'jogo-selecionado': isJogoSelecionado(jogo.id) }"
                            @click="toggleJogo(jogo)"
                            style="cursor: pointer; transition: all 0.3s ease;"
                          >
                            <div class="card-body p-3">
                              <div class="d-flex align-items-start">
                                <input
                                  type="checkbox"
                                  class="form-check-input me-3 mt-1"
                                  :checked="isJogoSelecionado(jogo.id)"
                                  @click.stop
                                  @change="toggleJogo(jogo)"
                                  style="transform: scale(1.2);"
                                />
                                <div class="flex-grow-1">
                                  <h6 class="card-title mb-2 text-truncate" :title="jogo.NomeJogo">
                                    {{ jogo.NomeJogo }}
                                  </h6>
                                  <div class="small text-muted mb-1">
                                    <span class="badge bg-info me-2">{{ jogo.Dificuldade || 'N/A' }}</span>
                                    <span class="badge bg-success">{{ formatarPreco(jogo.Preco) }}</span>
                                  </div>
                                  <div class="small text-white">
                                    ⏱️ {{ jogo.Duracao || 'N/A' }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="jogosFiltrados.length === 0" class="text-center text-muted py-4">
                        <i class="fas fa-search fa-2x mb-2"></i>
                        <p>Nenhum jogo encontrado com o filtro "{{ filtroJogos }}"</p>
                      </div>

                      <div class="d-flex gap-2 mt-3">
                        <button
                          type="button"
                          class="btn btn-success"
                          @click="confirmarEdicaoJogos"
                        >
                          <i class="fas fa-check me-1"></i> Confirmar
                        </button>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          @click="cancelarEdicaoJogos"
                        >
                          <i class="fas fa-times me-1"></i> Cancelar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-start mt-3">
                    <button type="submit" class="btn btn-success me-2">
                      <i class="fas fa-save me-1"></i> Salvar
                    </button>
                    <button type="button" class="btn btn-danger" @click="excluirSala">
                      <i class="fas fa-trash me-1"></i> Excluir
                    </button>
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

interface Jogo {
  id: number
  NomeJogo: string
  Dificuldade?: string
  Preco?: number
  Duracao?: string
}

const route = useRoute()
const router = useRouter()
const salaId = route.params.id as string

const sala = reactive({
  Numero: '',
  Jogadores: 0,
  Status: true,
  JogosIds: [] as number[],
  unidade_id: ''
})

const listaJogos = ref<Jogo[]>([])
const listaUnidades = ref<{ id: number; nome: string }[]>([])
const filtroJogos = ref('')

const modoEdicaoJogos = ref(false)
const jogosSelecionadosAntes = ref<number[]>([])

const jogosFiltrados = computed(() => {
  if (!filtroJogos.value) return listaJogos.value
  
  const filtro = filtroJogos.value.toLowerCase()
  return listaJogos.value.filter(jogo => 
    jogo.NomeJogo.toLowerCase().includes(filtro) ||
    (jogo.Dificuldade && jogo.Dificuldade.toLowerCase().includes(filtro))
  )
})

const jogosSelecionados = computed(() => {
  return listaJogos.value.filter(jogo => sala.JogosIds.includes(jogo.id))
})

const formatarPreco = (preco?: number) => {
  if (!preco) return 'Grátis'
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const isJogoSelecionado = (jogoId: number) => {
  return sala.JogosIds.includes(jogoId)
}

const toggleJogo = (jogo: Jogo) => {
  const index = sala.JogosIds.findIndex(id => id === jogo.id)
  
  if (index > -1) {
    sala.JogosIds.splice(index, 1)
  } else {
    sala.JogosIds.push(jogo.id)
  }
}

const selecionarTodos = () => {
  jogosFiltrados.value.forEach(jogo => {
    if (!isJogoSelecionado(jogo.id)) {
      sala.JogosIds.push(jogo.id)
    }
  })
}

const limparSelecao = () => {
  sala.JogosIds.splice(0)
}

const iniciarEdicaoJogos = () => {
  jogosSelecionadosAntes.value = [...sala.JogosIds]
  modoEdicaoJogos.value = true
}

const confirmarEdicaoJogos = () => {
  modoEdicaoJogos.value = false
  filtroJogos.value = ''
}

const cancelarEdicaoJogos = () => {
  sala.JogosIds = [...jogosSelecionadosAntes.value]
  modoEdicaoJogos.value = false
  filtroJogos.value = ''
}

const buscarJogos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/jogos', {
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.status === 200) {
      listaJogos.value = response.data.map((jogo: any) => ({
        id: jogo.id,
        NomeJogo: jogo.NomeJogo,
        Dificuldade: jogo.Dificuldade,
        Preco: jogo.Preco,
        Duracao: jogo.Duracao
      }))
    }
  } catch (error) {
    console.error('Erro ao buscar jogos:', error)
    Swal.fire('Erro', 'Não foi possível carregar os jogos.', 'error')
  }
}

const buscarUnidades = async () => {
  try {
    const response = await axios.get('http://localhost:3000/unidades')
    if (response.status === 200) {
      listaUnidades.value = response.data
    }
  } catch (error) {
    console.error('Erro ao buscar unidades:', error)
    Swal.fire('Erro', 'Não foi possível carregar as unidades.', 'error')
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
    sala.unidade_id = data.unidade_id ?? ''
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
    const jogosSelecionadosCompletos = listaJogos.value.filter(j =>
      sala.JogosIds.includes(j.id)
    )

    const dadosParaSalvar = {
      Numero: sala.Numero,
      Jogadores: Number(sala.Jogadores),
      Status: sala.Status,
      Jogos: jogosSelecionadosCompletos,
      unidade_id: sala.unidade_id
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
  await buscarUnidades()

  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

<style scoped>
.jogo-card {
  background-color: #292d30;
  border: 2px solid transparent;
  color: white;
}

.jogo-card:hover {
  border-color: #F20519;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.jogo-selecionado {
  border-color: #8a141e !important;
  background-color: #292d30 !important;
}

.jogo-selecionado:hover {
  border-color: #8a141e !important;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.badge {
  font-size: 0.7rem;
}

.row.g-3::-webkit-scrollbar {
  width: 8px;
}

.row.g-3::-webkit-scrollbar-track {
  background: #495057;
  border-radius: 4px;
}

.row.g-3::-webkit-scrollbar-thumb {
  background: #6c757d;
  border-radius: 4px;
}

.row.g-3::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>
