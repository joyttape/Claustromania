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
                <h6 class="mb-4">Detalhes da Reserva</h6>
                <form @submit.prevent="salvarAlteracoes" novalidate>

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
                      <small class="text-light" v-if="jogoSelecionado">Valor unitário: R$ {{ formatarMoeda(jogoSelecionado.preco) }}</small>
                      <div class="invalid-feedback" v-if="v$.valor_total.$error">Valor inválido.</div>
                    </div>
                    <div class="col-md-6">
                      <label for="status" class="form-label">Status</label>
                      <select class="form-select" id="status" v-model="reserva.status" :class="{ 'is-invalid': v$.status.$error }" required>
                        <option disabled value="">Selecione</option>
                        <option value="RESERVADO">Reservado</option>
                        <option value="CONFIRMADO">Confirmado</option>
                        <option value="CANCELADO">Cancelado</option>
                        <option value="CONCLUIDO">Concluído</option>
                      </select>
                      <div class="invalid-feedback" v-if="v$.status.$error">Status obrigatório.</div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="jogo" class="form-label">Jogo</label>
                      <div class="position-relative">
                        <input 
                          type="text" 
                          class="form-control" 
                          id="jogo" 
                          v-model="jogoPesquisa" 
                          @input="pesquisarJogo" 
                          @focus="mostrarSugestoesJogo = true" 
                          @blur="ocultarSugestoesJogo"
                          placeholder="Digite para pesquisar jogo..." 
                          :class="{ 'is-invalid': v$.jogo_id.$error }" 
                          autocomplete="off" 
                          required 
                        />
                        <div 
                          v-if="mostrarSugestoesJogo && jogosFiltrados.length > 0" 
                          class="list-group position-absolute w-100 z-3 mt-1 shadow" 
                          style="max-height: 200px; overflow-y: auto;"
                        >
                          <button 
                            type="button" 
                            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
                            v-for="jogo in jogosFiltrados" 
                            :key="jogo.id" 
                            @mousedown="selecionarJogo(jogo)"
                          >
                            <span>{{ jogo.nome }}</span>
                            <small class="text-muted">R$ {{ formatarMoeda(jogo.preco) }}</small>
                          </button>
                        </div>
                        <div 
                          v-if="mostrarSugestoesJogo && jogoPesquisa.length >= 1 && jogosFiltrados.length === 0" 
                          class="list-group position-absolute w-100 z-3 mt-1 shadow"
                        >
                          <div class="list-group-item text-muted">Nenhum jogo encontrado</div>
                        </div>
                      </div>
                      <small class="text-light" v-if="reserva.jogo_nome">Selecionado: <strong>{{ reserva.jogo_nome }}</strong></small>
                      <div class="invalid-feedback" v-if="v$.jogo_id.$error">Jogo obrigatório.</div>
                    </div>
                    <div class="col-md-6">
                      <label for="unidade" class="form-label">Unidade</label>
                      <div class="position-relative">
                        <input 
                          type="text" 
                          class="form-control" 
                          id="unidade" 
                          v-model="unidadePesquisa" 
                          @input="pesquisarUnidade" 
                          @focus="mostrarSugestoesUnidade = true" 
                          @blur="ocultarSugestoesUnidade"
                          placeholder="Digite para pesquisar unidade..." 
                          :class="{ 'is-invalid': v$.unidade_id.$error }" 
                          autocomplete="off" 
                          required 
                        />
                        <div 
                          v-if="mostrarSugestoesUnidade && unidadesFiltradas.length > 0" 
                          class="list-group position-absolute w-100 z-3 mt-1 shadow" 
                          style="max-height: 200px; overflow-y: auto;"
                        >
                          <button 
                            type="button" 
                            class="list-group-item list-group-item-action" 
                            v-for="unidade in unidadesFiltradas" 
                            :key="unidade.id" 
                            @mousedown="selecionarUnidade(unidade)"
                          >
                            {{ unidade.nome }}
                          </button>
                        </div>
                        <div 
                          v-if="mostrarSugestoesUnidade && unidadePesquisa.length >= 1 && unidadesFiltradas.length === 0" 
                          class="list-group position-absolute w-100 z-3 mt-1 shadow"
                        >
                          <div class="list-group-item text-muted">Nenhuma unidade encontrada</div>
                        </div>
                      </div>
                      <small class="text-light" v-if="reserva.unidade_nome">Selecionado: <strong>{{ reserva.unidade_nome }}</strong></small>
                      <div class="invalid-feedback" v-if="v$.unidade_id.$error">Unidade obrigatória.</div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="sala" class="form-label">Sala</label>
                      <div class="position-relative">
                        <input 
                          type="text" 
                          class="form-control" 
                          id="sala" 
                          v-model="salaPesquisa" 
                          @input="pesquisarSala" 
                          @focus="mostrarSugestoesSala = true" 
                          @blur="ocultarSugestoesSala"
                          :disabled="!reserva.jogo_id || !reserva.unidade_id" 
                          :class="{ 'is-invalid': v$.sala_id.$error }" 
                          placeholder="Digite para pesquisar sala..." 
                          autocomplete="off" 
                          required 
                        />
                        <div 
                          v-if="mostrarSugestoesSala && salasFiltradas.length > 0" 
                          class="list-group position-absolute w-100 z-3 mt-1 shadow" 
                          style="max-height: 200px; overflow-y: auto;"
                        >
                          <button 
                            type="button" 
                            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
                            v-for="sala in salasFiltradas" 
                            :key="sala.id" 
                            @mousedown="selecionarSala(sala)"
                          >
                            <span>Sala {{ sala.nome }}</span>
                            <small class="text-muted">Capacidade: {{ sala.capacidade }}</small>
                          </button>
                        </div>
                        <div 
                          v-if="mostrarSugestoesSala && salaPesquisa.length >= 1 && salasFiltradas.length === 0 && reserva.jogo_id && reserva.unidade_id" 
                          class="list-group position-absolute w-100 z-3 mt-1 shadow"
                        >
                          <div class="list-group-item text-muted">Nenhuma sala encontrada</div>
                        </div>
                      </div>
                      <div class="invalid-feedback" v-if="v$.sala_id.$error">Sala obrigatória.</div>
                      <div class="text-warning mt-1" v-if="reserva.sala_id && reserva.numero_jogadores > capacidadeSalaSelecionada">Atenção: Número de jogadores excede a capacidade da sala!</div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="cliente" class="form-label">Cliente</label>
                      <div class="position-relative">
                        <input 
                          type="text" 
                          class="form-control" 
                          id="cliente" 
                          v-model="clientePesquisa" 
                          @input="pesquisarCliente" 
                          @focus="mostrarSugestoesCliente = true" 
                          @blur="ocultarSugestoesCliente"
                          placeholder="Digite para pesquisar cliente..." 
                          :class="{ 'is-invalid': v$.cliente_id.$error }" 
                          autocomplete="off" 
                          required 
                        />
                        <div 
                          v-if="mostrarSugestoesCliente && clientesFiltrados.length > 0" 
                          class="list-group position-absolute w-100 z-3 mt-1 shadow" 
                          style="max-height: 200px; overflow-y: auto;"
                        >
                          <button 
                            type="button" 
                            class="list-group-item list-group-item-action" 
                            v-for="cliente in clientesFiltrados" 
                            :key="cliente.id" 
                            @mousedown="selecionarCliente(cliente)"
                          >
                            {{ cliente.pessoa.nome }}
                          </button>
                        </div>
                        <div 
                          v-if="mostrarSugestoesCliente && clientePesquisa.length >= 1 && clientesFiltrados.length === 0" 
                          class="list-group position-absolute w-100 z-3 mt-1 shadow"
                        >
                          <div class="list-group-item text-muted">Nenhum cliente encontrado</div>
                        </div>
                      </div>
                      <small class="text-light" v-if="reserva.cliente_nome">Selecionado: <strong>{{ reserva.cliente_nome }}</strong></small>
                      <div class="invalid-feedback" v-if="v$.cliente_id.$error">Cliente obrigatório.</div>
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
                      <option value="Pix">PIX</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Cartao">Cartão</option>
                    </select>
                    <div class="invalid-feedback" v-if="v$.forma_pagamento?.$error">Forma de pagamento obrigatória.</div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <button type="submit" class="btn btn-success me-2" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
                      </button>
                      <button type="button" class="btn btn-danger" @click="excluirReserva" :disabled="loading">
                        Excluir
                      </button>
                    </div>
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

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, maxLength, helpers } from '@vuelidate/validators'
import Swal from 'sweetalert2'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import { api } from '@/common/http'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const reserva = reactive({
  data_reserva: '',
  hora_reserva: '',
  numero_jogadores: 1,
  valor_total: '0,00',
  status: '',
  jogo_id: null,
  jogo_nome: '',
  sala_id: null,
  cliente_id: null,
  cliente_nome: '',
  unidade_id: '',
  unidade_nome: '',
  observacoes: '',
  forma_pagamento: ''
})

const loading = ref(false)

const jogoPesquisa = ref('')
const jogosFiltrados = ref([])
const jogoSelecionado = ref(null)
const mostrarSugestoesJogo = ref(false)

const unidadePesquisa = ref('')
const unidadesFiltradas = ref([])
const mostrarSugestoesUnidade = ref(false)

const salaPesquisa = ref('')
const salasFiltradas = ref([])
const mostrarSugestoesSala = ref(false)

const clientePesquisa = ref('')
const clientesFiltrados = ref([])
const mostrarSugestoesCliente = ref(false)

const listaSalas = ref([])
const listaUnidades = ref([])
const listaSalaJogo = ref([])
const listaJogos = ref([])
const listaClientes = ref([])
const salasDisponiveis = ref([])

const formatarMoeda = (valor) =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const capacidadeSalaSelecionada = computed(() => {
  const sala = salasDisponiveis.value.find(s => s.id === reserva.sala_id)
  return sala?.capacidade || Infinity
})

const calcularValorTotal = () => {
  if (!jogoSelecionado.value) {
    reserva.valor_total = '0,00'
    return
  }
  const total = reserva.numero_jogadores * jogoSelecionado.value.preco
  reserva.valor_total = formatarMoeda(total)
}

const pesquisarJogo = () => {
  if (jogoPesquisa.value.length < 1) {
    jogosFiltrados.value = []
    mostrarSugestoesJogo.value = false
    return
  }

  setTimeout(() => {
    jogosFiltrados.value = listaJogos.value.filter(jogo =>
      jogo.nome.toLowerCase().includes(jogoPesquisa.value.toLowerCase())
    )
    mostrarSugestoesJogo.value = true
  }, 200)
}

const selecionarJogo = (jogo) => {
  reserva.jogo_id = jogo.id
  reserva.jogo_nome = jogo.nome
  jogoPesquisa.value = jogo.nome
  jogoSelecionado.value = jogo
  mostrarSugestoesJogo.value = false
  calcularValorTotal()
  
  reserva.sala_id = null
  salaPesquisa.value = ''
  filtrarSalasPorJogoEUnidade()
}

const ocultarSugestoesJogo = () => {
  setTimeout(() => {
    mostrarSugestoesJogo.value = false
  }, 200)
}

const pesquisarUnidade = () => {
  if (unidadePesquisa.value.length < 1) {
    unidadesFiltradas.value = []
    mostrarSugestoesUnidade.value = false
    return
  }

  setTimeout(() => {
    unidadesFiltradas.value = listaUnidades.value.filter(unidade =>
      unidade.nome.toLowerCase().includes(unidadePesquisa.value.toLowerCase())
    )
    mostrarSugestoesUnidade.value = true
  }, 200)
}

const selecionarUnidade = (unidade) => {
  reserva.unidade_id = unidade.id
  reserva.unidade_nome = unidade.nome
  unidadePesquisa.value = unidade.nome
  mostrarSugestoesUnidade.value = false
  
  reserva.sala_id = null
  salaPesquisa.value = ''
  filtrarSalasPorJogoEUnidade()
}

const ocultarSugestoesUnidade = () => {
  setTimeout(() => {
    mostrarSugestoesUnidade.value = false
  }, 200)
}

const pesquisarSala = () => {
  if (!reserva.jogo_id || !reserva.unidade_id) {
    salasFiltradas.value = []
    mostrarSugestoesSala.value = false
    return
  }

  setTimeout(() => {
    salasFiltradas.value = salasDisponiveis.value.filter(s =>
      s.nome.toLowerCase().includes(salaPesquisa.value.toLowerCase())
    )
    mostrarSugestoesSala.value = true
  }, 200)
}

const selecionarSala = (sala) => {
  reserva.sala_id = sala.id
  salaPesquisa.value = sala.nome
  mostrarSugestoesSala.value = false
}

const ocultarSugestoesSala = () => {
  setTimeout(() => {
    mostrarSugestoesSala.value = false
  }, 200)
}

const pesquisarCliente = () => {
  if (clientePesquisa.value.length < 1) {
    clientesFiltrados.value = []
    mostrarSugestoesCliente.value = false
    return
  }

  setTimeout(() => {
    clientesFiltrados.value = listaClientes.value.filter(cliente =>
      cliente.pessoa.nome.toLowerCase().includes(clientePesquisa.value.toLowerCase())
    )
    mostrarSugestoesCliente.value = true
  }, 200)
}

const selecionarCliente = (cliente) => {
  reserva.cliente_id = cliente.id
  reserva.cliente_nome = cliente.pessoa.nome
  clientePesquisa.value = cliente.pessoa.nome
  mostrarSugestoesCliente.value = false
}

const ocultarSugestoesCliente = () => {
  setTimeout(() => {
    mostrarSugestoesCliente.value = false
  }, 200)
}

const carregarSalas = async () => {
  try {
    const res = await api.get('/api/Sala')
    listaSalas.value = res.data
  } catch (e) {
    console.error('Erro ao carregar salas:', e)
    listaSalas.value = []
  }
}

const carregarUnidades = async () => {
  try {
    const res = await api.get('/api/Unidade')
    listaUnidades.value = res.data
  } catch (e) {
    console.error('Erro ao carregar unidades:', e)
    listaUnidades.value = []
  }
}

const carregarSalaJogo = async () => {
  try {
    const res = await api.get('/api/SalaJogo')
    listaSalaJogo.value = res.data
  } catch (e) {
    console.error('Erro ao carregar sala-jogo:', e)
    listaSalaJogo.value = []
  }
}

const carregarJogos = async () => {
  try {
    const res = await api.get('/api/Jogo')
    listaJogos.value = res.data
  } catch (e) {
    console.error('Erro ao carregar jogos:', e)
    listaJogos.value = []
  }
}

const carregarClientes = async () => {
  try {
    const res = await api.get('/api/Cliente')
    listaClientes.value = res.data
  } catch (e) {
    console.error('Erro ao carregar clientes:', e)
    listaClientes.value = []
  }
}

const filtrarSalasPorJogoEUnidade = () => {
  if (!reserva.jogo_id || !reserva.unidade_id) {
    salasDisponiveis.value = []
    return
  }

  const idsSalasComJogo = listaSalaJogo.value
    .filter(assoc => assoc.fkJogo === reserva.jogo_id)
    .map(assoc => assoc.fkSala)

  salasDisponiveis.value = listaSalas.value.filter(sala =>
    sala.fkUnidade === reserva.unidade_id && 
    idsSalasComJogo.includes(sala.id) &&
    sala.ativa === true 
  )
}

const carregarReserva = async () => {
  try {
    const res = await api.get(`/api/Reserva/${id}`)
    const d = res.data

    reserva.data_reserva = d.dataReserva ? d.dataReserva.split('T')[0] : ''
    reserva.hora_reserva = d.horaReserva ? d.horaReserva.substring(0, 5) : ''
    reserva.numero_jogadores = d.numeroJogadores || 1
    reserva.valor_total = d.valorTotal ? d.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'
    reserva.status = d.status || ''
    reserva.observacoes = d.observacoes || ''
    reserva.forma_pagamento = d.formaPagamento || ''

    console.log('Status recebido da API:', d.status)

    if (d.fkCliente) {
      reserva.cliente_id = d.fkCliente
      const cliente = listaClientes.value.find(c => c.id === d.fkCliente)
      if (cliente) {
        reserva.cliente_nome = cliente.pessoa.nome
        clientePesquisa.value = cliente.pessoa.nome
      }
    }

    if (d.fkSalaJogo) {
      const salaJogo = listaSalaJogo.value.find(sj => sj.id === d.fkSalaJogo)
      if (salaJogo) {
        reserva.jogo_id = salaJogo.fkJogo
        reserva.sala_id = salaJogo.fkSala

        const jogo = listaJogos.value.find(j => j.id === salaJogo.fkJogo)
        if (jogo) {
          jogoSelecionado.value = jogo
          reserva.jogo_nome = jogo.nome
          jogoPesquisa.value = jogo.nome
        }

        const sala = listaSalas.value.find(s => s.id === salaJogo.fkSala)
        if (sala) {
          reserva.unidade_id = sala.fkUnidade
          salaPesquisa.value = sala.nome

          const unidade = listaUnidades.value.find(u => u.id === sala.fkUnidade)
          if (unidade) {
            reserva.unidade_nome = unidade.nome
            unidadePesquisa.value = unidade.nome
          }
        }
      }
    }

    filtrarSalasPorJogoEUnidade()
  } catch (error) {
    console.error('Erro ao carregar reserva:', error)
    Swal.fire({ icon: 'error', title: 'Erro', text: 'Falha ao carregar dados da reserva.' })
    router.push('/reservas')
  }
}

const rules = {
  data_reserva: { required },
  hora_reserva: { required },
  numero_jogadores: {
    required,
    minValue: minValue(1),
    maxValue: helpers.withMessage(
      () => `Excede capacidade da sala (${capacidadeSalaSelecionada.value})`,
      val => val <= capacidadeSalaSelecionada.value
    )
  },
  valor_total: {
    required,
    valorValido: helpers.withMessage('Valor deve ser maior que zero', value => {
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

const salvarAlteracoes = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    Swal.fire({
      icon: 'error',
      title: 'Corrija os erros do formulário.',
      text: 'Verifique todos os campos obrigatórios.'
    })
    return
  }

  if (reserva.numero_jogadores > capacidadeSalaSelecionada.value) {
    Swal.fire({
      icon: 'error',
      title: 'Capacidade da sala excedida!',
      text: 'O número de jogadores é maior do que a sala suporta.'
    })
    return
  }

  loading.value = true

  try {
    const salaJogo = listaSalaJogo.value.find(sj =>
      sj.fkSala === reserva.sala_id && sj.fkJogo === reserva.jogo_id
    )

    if (!salaJogo) {
      Swal.fire({
        icon: 'error',
        title: 'Associação inválida',
        text: 'Não foi encontrada uma relação entre a sala e o jogo selecionados.'
      })
      loading.value = false
      return
    }

    const dataFormatada = reserva.data_reserva + 'T00:00:00'
    const horaFormatada = reserva.hora_reserva + ':00'
    const valorFormatado = parseFloat(reserva.valor_total.replace('.', '').replace(',', '.'))
    const observacoesFormatadas = reserva.observacoes.trim() === '' ? null : reserva.observacoes

    const payload = {
      id: id,
      dataReserva: dataFormatada,
      horaReserva: horaFormatada,
      numeroJogadores: reserva.numero_jogadores,
      valorTotal: valorFormatado,
      status: reserva.status,
      observacoes: observacoesFormatadas,
      formaPagamento: reserva.forma_pagamento,
      fkCliente: reserva.cliente_id,
      fkSalaJogo: salaJogo.id
    }

    await api.put(`/api/Reserva/${id}`, payload)

    Swal.fire({
      icon: 'success',
      title: 'Reserva atualizada com sucesso!'
    })
    router.push('/reservas')

  } catch (e) {
    console.error('Erro ao salvar reserva:', e)
    const errorMessage = e.response?.data || e.message || 'Erro desconhecido.'
    Swal.fire({ icon: 'error', title: 'Erro ao salvar', text: errorMessage })
  } finally {
    loading.value = false
  }
}

const excluirReserva = async () => {
  const confirm = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação é irreversível!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })

  if (confirm.isConfirmed) {
    try {
      await api.delete(`/api/Reserva/${id}`)
      await Swal.fire('Excluído!', 'A reserva foi removida.', 'success')
      router.push('/reservas')
    } catch (error) {
      console.error('Erro ao excluir:', error)
      Swal.fire('Erro', 'Erro ao excluir a reserva.', 'error')
    }
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      carregarSalas(),
      carregarUnidades(),
      carregarSalaJogo(),
      carregarJogos(),
      carregarClientes()
    ])
    
    await carregarReserva()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    Swal.fire({ icon: 'error', title: 'Erro', text: 'Falha ao carregar dados iniciais.' })
  } finally {
    document.getElementById('spinner')?.classList.remove('show')
    loading.value = false
  }
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

.list-group {
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.list-group-item {
  border-color: #495057;
  background-color: #6c757d;
  color: #fff;
}

.list-group-item:hover {
  background-color: #5a6268;
  color: #fff;
}

.list-group-item.text-muted {
  background-color: #495057;
  color: #adb5bd !important;
}
</style>
