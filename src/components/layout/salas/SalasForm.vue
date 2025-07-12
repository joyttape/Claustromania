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
                <h6 class="mb-4">Cadastro de Sala</h6>

                <form @submit.prevent="cadastrarSala">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Nome da Sala</label>
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
                                <h6 class="card-title mb-2 text-truncate" :title="jogo.nome">
                                    {{ jogo.nome }}
                                  </h6>
                                  <div class="small text-muted mb-1">
                                    <span class="badge red bg-info me-2">{{ formatarDificuldade(jogo.dificuldade) }}</span>
                                    <span class="badge bg-success">{{ formatarPreco(jogo.preco) }}</span>
                                  </div>
                                  <div class="small text-white">
                                    ⏱️ {{ jogo.duracao || 'N/A' }}
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
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, minValue, helpers } from '@vuelidate/validators'
import { api } from '@/common/http'
import Swal from 'sweetalert2'
import { Toast } from '@/components/common/toast'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

interface Jogo {
  id: string
  nome: string
  dificuldade?: number
  preco?: number
  duracao?: string
}

interface Unidade {
  id: string
  nome: string
}

interface Sala {
  Numero: string
  Jogadores: number | null
  Status: boolean
  unidade_id: string
  JogosSelecionados: Jogo[]
}

const router = useRouter()

const sala = reactive<Sala>({
  Numero: '',
  Jogadores: null,
  Status: true,
  unidade_id: '',
  JogosSelecionados: []
})

const listaJogos = ref<Jogo[]>([])
const listaUnidades = ref<Unidade[]>([])
const filtroJogos = ref('')

const rules = {
  Numero: { required, minLength: minLength(1) },
  Jogadores: { required, minValue: minValue(1) },
  unidade_id: { required },
  JogosSelecionados: {
    required,
    jogosSelecionadosValidos: helpers.withMessage(
      'Selecione ao menos um jogo.',
      (value: Jogo[]) => value && value.length > 0
    )
  }
}

const v$ = useVuelidate(rules, sala)

const jogosFiltrados = computed(() => {
  if (!filtroJogos.value) return listaJogos.value
  const filtro = filtroJogos.value.toLowerCase()
  return listaJogos.value.filter(jogo =>
    jogo.nome.toLowerCase().includes(filtro) ||
    formatarDificuldade(jogo.dificuldade).toLowerCase().includes(filtro)
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

const formatarDificuldade = (dificuldade?: number) => {
  const niveis = ['Fácil', 'Médio', 'Difícil']
  return dificuldade !== undefined ? niveis[dificuldade] || 'N/A' : 'N/A'
}

const isJogoSelecionado = (jogoId: string) => {
  return sala.JogosSelecionados.some(j => j.id === jogoId)
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
  sala.JogosSelecionados = []
}

const carregarDados = async () => {
  try {
    const [resJogos, resUnidades] = await Promise.all([
      api.get('/api/Jogo'),
      api.get('/api/Unidade')
    ])

    listaJogos.value = resJogos.data.map((jogo: any) => ({
      id: jogo.id,
      nome: jogo.nome,
      dificuldade: jogo.dificuldade,
      preco: jogo.preco,
      duracao: jogo.duracao
    }))

    listaUnidades.value = resUnidades.data
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    Swal.fire('Erro', 'Não foi possível carregar jogos ou unidades.', 'error')
  }
}

const cadastrarSala = async () => {
  const isValid = await v$.value.$validate()

  if (!isValid) {
    Toast.fire({ icon: 'error', title: 'Corrija os erros no formulário antes de enviar.' })
    return
  }

  try {
    const response = await api.post('/api/Sala', {
      nome: sala.Numero,
      capacidade: sala.Jogadores,
      ativa: sala.Status,
      fkUnidade: sala.unidade_id
    })

    if (response.status === 201) {
      const novaSalaId = response.data.id

      await Promise.all(
        sala.JogosSelecionados.map(jogo =>
          api.post('/api/SalaJogo', {
            fkSala: novaSalaId,
            fkJogo: jogo.id
          })
        )
      )

      Toast.fire({
        icon: 'success',
        title: `Sala ${sala.Numero} cadastrada com sucesso!`,
      })

      limparFormulario()
      router.push('/salas')
    } else {
      Swal.fire('Erro', 'Não foi possível cadastrar a sala.', 'error')
    }
  } catch (error) {
    console.error('Erro ao cadastrar sala:', error)
    Swal.fire('Erro', 'Ocorreu um erro ao cadastrar a sala.', 'error')
  }
}

const limparFormulario = () => {
  sala.Numero = ''
  sala.Jogadores = null
  sala.Status = true
  sala.unidade_id = ''
  sala.JogosSelecionados = []
  filtroJogos.value = ''
  v$.value.$reset()
}
onMounted(() => {
  carregarDados()

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
