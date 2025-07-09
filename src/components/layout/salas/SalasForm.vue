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
                      <label class="form-label">Número da Sala</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="sala.Numero"
                        :class="{ 'is-invalid': v$.Numero.$error }"
                      />
                      <div class="invalid-feedback" v-if="v$.Numero.$error">
                        Campo obrigatório.
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Capacidade de Jogadores</label>
                      <input
                        type="number"
                        class="form-control"
                        v-model.number="sala.Jogadores"
                        :class="{ 'is-invalid': v$.Jogadores.$error }"
                      />
                      <div class="invalid-feedback" v-if="v$.Jogadores.$error">
                        Deve ser um número maior que 0.
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Status</label>
                    <select class="form-select" v-model="sala.Status">
                      <option :value="true">Ativo</option>
                      <option :value="false">Inativo</option>
                    </select>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Unidade</label>
                    <select
                      class="form-select"
                      v-model="sala.unidade_id"
                      :class="{ 'is-invalid': v$.unidade_id.$error }"
                    >
                      <option disabled value="">Selecione uma unidade</option>
                      <option v-for="unidade in listaUnidades" :key="unidade.id" :value="unidade.id">
                        {{ unidade.nome }}
                      </option>
                    </select>
                    <div class="invalid-feedback" v-if="v$.unidade_id.$error">Unidade obrigatória.</div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label">Jogos Associados</label>
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
                                  <span class="badge red bg-info me-2">{{ jogo.Dificuldade || 'N/A' }}</span>
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

                    <div class="invalid-feedback d-block" v-if="v$.JogosSelecionados.$error">
                      Selecione ao menos um jogo.
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>Salvar Sala
                  </button>
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
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, minValue } from '@vuelidate/validators'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Toast } from '@/components/common/toast'

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

const sala = reactive({
  Numero: '',
  Jogadores: null as number | null,
  Status: true,
  JogosSelecionados: [] as Jogo[],
  unidade_id: ''
})

const listaJogos = ref<Jogo[]>([])
const listaUnidades = ref<{ id: number; nome: string }[]>([])
const filtroJogos = ref('')

const rules = {
  Numero: { required, minLength: minLength(1) },
  Jogadores: { required, minValue: minValue(1) },
  JogosSelecionados: { required },
  unidade_id: { required }
}

const v$ = useVuelidate(rules, sala)
const router = useRouter()

const jogosFiltrados = computed(() => {
  if (!filtroJogos.value) return listaJogos.value
  
  const filtro = filtroJogos.value.toLowerCase()
  return listaJogos.value.filter(jogo => 
    jogo.NomeJogo.toLowerCase().includes(filtro) ||
    (jogo.Dificuldade && jogo.Dificuldade.toLowerCase().includes(filtro))
  )
})

const jogosSelecionados = computed(() => sala.JogosSelecionados)

const formatarPreco = (preco?: number) => {
  if (!preco) return 'Grátis'
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const isJogoSelecionado = (jogoId: number) => {
  return sala.JogosSelecionados.some(jogo => jogo.id === jogoId)
}

const toggleJogo = (jogo: Jogo) => {
  const index = sala.JogosSelecionados.findIndex(j => j.id === jogo.id)
  
  if (index > -1) {
    sala.JogosSelecionados.splice(index, 1)
  } else {
    sala.JogosSelecionados.push(jogo)
  }
}

const selecionarTodos = () => {
  jogosFiltrados.value.forEach(jogo => {
    if (!isJogoSelecionado(jogo.id)) {
      sala.JogosSelecionados.push(jogo)
    }
  })
}

const limparSelecao = () => {
  sala.JogosSelecionados.splice(0)
}

onMounted(async () => {
  try {
    const [resJogos, resUnidades] = await Promise.all([
      axios.get('http://localhost:3000/jogos'),
      axios.get('http://localhost:3000/unidades')
    ])

    if (resJogos.status === 200) {
      listaJogos.value = resJogos.data.map((jogo: any) => ({
        id: jogo.id,
        NomeJogo: jogo.NomeJogo,
        Dificuldade: jogo.Dificuldade,
        Preco: jogo.Preco,
        Duracao: jogo.Duracao
      }))
    }

    if (resUnidades.status === 200) {
      listaUnidades.value = resUnidades.data
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    Swal.fire('Erro', 'Não foi possível carregar os jogos ou unidades.', 'error')
  }
})

const cadastrarSala = async () => {
  const valid = await v$.value.$validate()

  if (!valid) {
    Toast.fire({
      icon: 'error',
      title: 'Corrija os erros no formulário antes de enviar.',
    })
    return
  }

  const dadosParaSalvar = {
    id: Math.floor(Math.random() * 100000),
    Numero: sala.Numero,
    Jogadores: sala.Jogadores,
    Status: sala.Status,
    Jogos: sala.JogosSelecionados,
    unidade_id: sala.unidade_id
  }

  try {
    const response = await axios.post('http://localhost:3000/salas', dadosParaSalvar, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status === 201) {
      Toast.fire({
        icon: 'success',
        title: `Sala ${sala.Numero} cadastrada com sucesso!`,
      })

      limparFormulario()
      router.push('/salas')
    }
  } catch (error) {
    console.error('Erro ao cadastrar sala:', error)
    Swal.fire('Erro', 'Erro ao cadastrar sala.', 'error')
  }
}

const limparFormulario = () => {
  sala.Numero = ''
  sala.Jogadores = null
  sala.Status = true
  sala.JogosSelecionados = []
  sala.unidade_id = ''
  filtroJogos.value = ''
  v$.value.$reset()
}
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
