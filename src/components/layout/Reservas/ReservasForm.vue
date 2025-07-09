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
          <router-link to="/reservas" class="btn btn-outline-light mb-3">← Voltar</router-link>
          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Cadastro de Reserva</h6>

                <form @submit.prevent="cadastrarReserva" novalidate>
                  <div class="row mb-3">
                    <div class="col-md-4">
                      <label for="data_reserva" class="form-label">Data da Reserva</label>
                      <input type="date" class="form-control" id="data_reserva" v-model="reserva.data_reserva" :class="{ 'is-invalid': v$.data_reserva.$error }" required />
                      <div class="invalid-feedback" v-if="v$.data_reserva.$error">Data da reserva é obrigatória.</div>
                    </div>
                    <div class="col-md-4">
                      <label for="hora_reserva" class="form-label">Hora da Reserva</label>
                      <input type="time" class="form-control" id="hora_reserva" v-model="reserva.hora_reserva" :class="{ 'is-invalid': v$.hora_reserva.$error }" required />
                      <div class="invalid-feedback" v-if="v$.hora_reserva.$error">Hora da reserva é obrigatória.</div>
                    </div>
                    <div class="col-md-4">
                      <label for="numero_jogadores" class="form-label">Número de Jogadores</label>
                      <input type="number" class="form-control" id="numero_jogadores" v-model.number="reserva.numero_jogadores" @change="calcularValorTotal" :class="{ 'is-invalid': v$.numero_jogadores.$error }" min="1" :max="capacidadeSalaSelecionada" required />
                      <div class="invalid-feedback" v-if="v$.numero_jogadores.$error">
                        <span v-if="v$.numero_jogadores.minValue">Número mínimo: 1.</span>
                        <span v-if="v$.numero_jogadores.maxValue">Excede capacidade da sala ({{ capacidadeSalaSelecionada }}).</span>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="valor_total" class="form-label">Valor Total (R$)</label>
                      <input type="text" class="form-control" id="valor_total" v-model="reserva.valor_total" readonly :class="{ 'is-invalid': v$.valor_total.$error }" required />
                      <small class="text-light" v-if="jogoSelecionado">Valor unitário: R$ {{ formatarMoeda(jogoSelecionado.Preco) }}</small>
                      <div class="invalid-feedback" v-if="v$.valor_total.$error">Valor inválido.</div>
                    </div>
                    <div class="col-md-6">
                      <label for="status" class="form-label">Status</label>
                      <select class="form-select" id="status" v-model="reserva.status" :class="{ 'is-invalid': v$.status.$error }" required>
                        <option disabled value="">Selecione</option>
                        <option value="reservado">Reservado</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="concluido">Concluído</option>
                      </select>
                      <div class="invalid-feedback" v-if="v$.status.$error">Status obrigatório.</div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="jogo" class="form-label">Jogo</label>
                      <div class="position-relative">
                        <input type="text" class="form-control" id="jogo" v-model="jogoPesquisa" @input="pesquisarJogo" @focus="mostrarSugestoesJogo = true" placeholder="Pesquisar jogo..." :class="{ 'is-invalid': v$.jogo_id.$error }" autocomplete="off" required />
                        <div v-if="mostrarSugestoesJogo && jogosFiltrados.length > 0" class="list-group position-absolute w-100 z-3 mt-1" style="max-height: 200px; overflow-y: auto;">
                          <button type="button" class="list-group-item list-group-item-action" v-for="jogo in jogosFiltrados" :key="jogo.id" @click="selecionarJogo(jogo)">{{ jogo.NomeJogo }}</button>
                        </div>
                      </div>
                      <small class="text-light" v-if="reserva.jogo_nome">Selecionado: <strong>{{ reserva.jogo_nome }}</strong></small>
                    </div>

                    <div class="col-md-6">
                      <label for="unidade" class="form-label">Unidade</label>
                      <select class="form-select" id="unidade" v-model="reserva.unidade_id" :class="{ 'is-invalid': v$.unidade_id.$error }" required @change="filtrarSalasPorJogoEUnidade">
                        <option disabled value="">Selecione uma unidade</option>
                        <option v-for="unidade in listaUnidades" :key="unidade.id" :value="unidade.id">{{ unidade.nome }}</option>
                      </select>
                      <div class="invalid-feedback" v-if="v$.unidade_id.$error">Unidade obrigatória.</div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="sala" class="form-label">Sala</label>
                      <select class="form-select" id="sala" v-model="reserva.sala_id" :class="{ 'is-invalid': v$.sala_id.$error }" :disabled="!reserva.jogo_id || !reserva.unidade_id" required>
                        <option disabled value="">Selecione uma sala</option>
                        <option v-for="sala in salasDisponiveis" :key="sala.id" :value="sala.id" :disabled="reserva.numero_jogadores > sala.Jogadores">
                          Sala {{ sala.Numero }} (Capacidade: {{ sala.Jogadores }})
                        </option>
                      </select>
                      <div class="invalid-feedback" v-if="v$.sala_id.$error">Sala obrigatória.</div>
                      <div class="text-warning mt-1" v-if="reserva.sala_id && reserva.numero_jogadores > capacidadeSalaSelecionada">
                        Atenção: Número de jogadores excede a capacidade da sala!
                      </div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="cliente" class="form-label">Cliente</label>
                      <div class="position-relative">
                        <input type="text" class="form-control" id="cliente" v-model="clientePesquisa" @input="pesquisarCliente" @focus="mostrarSugestoesCliente = true" placeholder="Pesquisar cliente..." :class="{ 'is-invalid': v$.cliente_id.$error }" autocomplete="off" required />
                        <div v-if="mostrarSugestoesCliente && clientesFiltrados.length > 0" class="list-group position-absolute w-100 z-3 mt-1" style="max-height: 200px; overflow-y: auto;">
                          <button type="button" class="list-group-item list-group-item-action" v-for="cliente in clientesFiltrados" :key="cliente.id" @click="selecionarCliente(cliente)">{{ cliente.nome }}</button>
                        </div>
                      </div>
                      <small class="text-light" v-if="reserva.cliente_nome">Selecionado: <strong>{{ reserva.cliente_nome }}</strong></small>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="observacoes" class="form-label">Observações</label>
                      <textarea class="form-control" id="observacoes" rows="2" v-model="reserva.observacoes" placeholder="Observações sobre a reserva" :class="{ 'is-invalid': v$.observacoes.$error }"></textarea>
                      <div class="invalid-feedback" v-if="v$.observacoes.$error">Máximo 500 caracteres.</div>
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="forma_pagamento" class="form-label">Forma de Pagamento</label>
                    <select class="form-select" id="forma_pagamento" v-model="reserva.forma_pagamento" :class="{ 'is-invalid': v$.forma_pagamento?.$error }" required>
                      <option disabled value="">Selecione</option>
                      <option value="pix">PIX</option>
                      <option value="dinheiro">Dinheiro</option>
                      <option value="cartao">Cartão</option>
                    </select>
                    <div class="invalid-feedback" v-if="v$.forma_pagamento?.$error">Forma de pagamento obrigatória.</div>
                  </div>

                  <button type="submit" class="btn btn-primary">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Salvando...' : 'Salvar Reserva' }}
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
import { required, minValue, maxLength, helpers } from '@vuelidate/validators'
import axios from 'axios'
import Swal from 'sweetalert2'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const router = useRouter()

interface Jogo {
  id: string | number
  NomeJogo: string
  Preco: number
}

interface Sala {
  id: string | number
  Numero: string
  Jogadores: number
  Status: boolean
  unidade_id: string | number
  Jogos: { id: string | number; NomeJogo: string }[]
}

interface Cliente {
  id: number
  nome: string
}

interface Unidade {
  id: string | number
  nome: string
}

const reserva = reactive({
  data_reserva: '',
  hora_reserva: '',
  numero_jogadores: 1,
  valor_total: '0,00',
  status: '',
  jogo_id: null as string | number | null,
  jogo_nome: '',
  sala_id: null as string | number | null,
  cliente_id: null as number | null,
  cliente_nome: '',
  observacoes: '',
  forma_pagamento: '',
  unidade_id: ''
})

const loading = ref(false)
const jogoPesquisa = ref('')
const jogosFiltrados = ref<Jogo[]>([])
const listaJogos = ref<Jogo[]>([])
const jogoSelecionado = ref<Jogo | null>(null)

const clientePesquisa = ref('')
const clientesFiltrados = ref<Cliente[]>([])
const listaClientes = ref<Cliente[]>([])

const salasDisponiveis = ref<Sala[]>([])
const listaSalas = ref<Sala[]>([])
const listaUnidades = ref<Unidade[]>([])

const mostrarSugestoesJogo = ref(false)
const mostrarSugestoesCliente = ref(false)

const formatarMoeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const capacidadeSalaSelecionada = computed(() => {
  if (!reserva.sala_id) return Infinity
  const sala = salasDisponiveis.value.find(s => String(s.id) === String(reserva.sala_id))
  return sala?.Jogadores || Infinity
})

const calcularValorTotal = () => {
  if (!jogoSelecionado.value) {
    reserva.valor_total = '0,00'
    return
  }
  const total = reserva.numero_jogadores * jogoSelecionado.value.Preco
  reserva.valor_total = formatarMoeda(total)
}

const pesquisarJogo = () => {
  if (jogoPesquisa.value.length < 2) {
    jogosFiltrados.value = []
    return
  }
  jogosFiltrados.value = listaJogos.value.filter(j => {
    if (!j || !j.NomeJogo) return false
    return j.NomeJogo.toLowerCase().includes(jogoPesquisa.value.toLowerCase())
  })
}

const selecionarJogo = (jogo: Jogo) => {
  reserva.jogo_id = jogo.id
  reserva.jogo_nome = jogo.NomeJogo
  jogoPesquisa.value = jogo.NomeJogo
  jogoSelecionado.value = jogo
  mostrarSugestoesJogo.value = false

  filtrarSalasPorJogoEUnidade()
  reserva.sala_id = null
  calcularValorTotal()
}

const pesquisarCliente = async () => {
  if (clientePesquisa.value.length < 2) {
    clientesFiltrados.value = []
    return
  }
  if (listaClientes.value.length > 0) {
    clientesFiltrados.value = listaClientes.value.filter(c =>
      c.nome.toLowerCase().includes(clientePesquisa.value.toLowerCase())
    )
  } else {
    try {
      const res = await axios.get(`http://localhost:3000/clientes?nome=${clientePesquisa.value}`)
      clientesFiltrados.value = res.data
    } catch {
      clientesFiltrados.value = []
    }
  }
}

const selecionarCliente = (cliente: Cliente) => {
  reserva.cliente_id = cliente.id
  reserva.cliente_nome = cliente.nome
  clientePesquisa.value = cliente.nome
  mostrarSugestoesCliente.value = false
}

const carregarSalas = async () => {
  try {
    const res = await axios.get('http://localhost:3000/salas')
    listaSalas.value = res.data
  } catch {
    listaSalas.value = []
  }
}

const carregarUnidades = async () => {
  try {
    const res = await axios.get('http://localhost:3000/unidades')
    listaUnidades.value = res.data
  } catch {
    listaUnidades.value = []
  }
}

const filtrarSalasPorJogoEUnidade = () => {
  salasDisponiveis.value = listaSalas.value.filter(sala => {
    const jogoRelacionado = sala.Jogos?.some(j => String(j.id) === String(reserva.jogo_id))
    const unidadeCorreta = String(sala.unidade_id) === String(reserva.unidade_id)
    return jogoRelacionado && unidadeCorreta
  })
}

const rules = {
  data_reserva: { required },
  hora_reserva: { required },
  numero_jogadores: {
    required,
    minValue: minValue(1),
    maxValue: helpers.withMessage(
      () => `Excede capacidade da sala (${capacidadeSalaSelecionada.value})`,
      (val: number) => val <= capacidadeSalaSelecionada.value
    )
  },
  valor_total: {
    required,
    valorValido: helpers.withMessage('Valor deve ser maior que zero', (value: string) => {
      const valor = parseFloat(value.replace('.', '').replace(',', '.')) || 0
      return valor > 0
    })
  },
  status: { required },
  jogo_id: { required },
  sala_id: { required },
  cliente_id: { required },
  observacoes: { maxLength: maxLength(500) },
  forma_pagamento: { required },
  unidade_id: { required }
}

const v$ = useVuelidate(rules, reserva)

const cadastrarReserva = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    Swal.fire({
      icon: 'error',
      title: 'Corrija os erros no formulário antes de enviar.',
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    })
    return
  }

  if (reserva.numero_jogadores > capacidadeSalaSelecionada.value) {
    Swal.fire({
      icon: 'error',
      title: 'Capacidade excedida',
      text: 'Número de jogadores maior que a capacidade da sala selecionada.',
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    })
    return
  }

  loading.value = true
  try {
    const payload = {
      ...reserva,
      valor_total: parseFloat(reserva.valor_total.replace('.', '').replace(',', '.'))
    }
    const res = await axios.post('http://localhost:3000/reservas', payload)
if (res.status === 201) {
  const reservaCriada = res.data

  Swal.fire({
    icon: 'success',
    title: `Reserva para ${reserva.cliente_nome} cadastrada com sucesso!`,
    toast: true,
    position: 'top-end',
    timer: 2500,
    timerProgressBar: true,
    showConfirmButton: false
  })

  router.push(`/reservas/transacao/${reservaCriada.id}`)
}
  } catch (e: any) {
    Swal.fire({
      icon: 'error',
      title: 'Erro ao salvar reserva',
      text: e?.message || '',
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const [jogos, clientes] = await Promise.all([
      axios.get('http://localhost:3000/jogos'),
      axios.get('http://localhost:3000/clientes')
    ])
    listaJogos.value = jogos.data
    listaClientes.value = clientes.data
    await carregarSalas()
    await carregarUnidades()
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  }

  document.getElementById('spinner')?.classList.remove('show')
})
</script>


<style scoped>
:deep(input.form-control:read-only) {
  background-color: black !important;
  color: inherit !important;
  opacity: 1;
}

:deep(input.form-control:disabled),
:deep(select.form-select:disabled) {
  background-color: black !important;
  color: inherit !important;
  opacity: 1;
  cursor: not-allowed;
}
</style>
