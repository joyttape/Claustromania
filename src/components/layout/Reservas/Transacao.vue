<template>
  <div>
    <div
      v-if="loading.reserva || loading.caixas"
      id="spinner"
      class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <NavHeaderBar />
    <div class="d-flex">
      <NavSideBar />
      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4 text-light">
          <router-link to="/reservas" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="bg-secondary rounded p-4">
            <h5 class="mb-4">Registrar Transação da Reserva</h5>

            <form @submit.prevent="registrarTransacao" novalidate>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label>Cliente</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    :value="reserva.cliente_nome || 'Carregando...'" 
                    disabled 
                  />
                </div>
                <div class="col-md-6">
                  <label>Forma de Pagamento</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    :value="reserva.forma_pagamento || 'Não informado'" 
                    disabled 
                  />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label>Valor Total</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    :value="formatarMoeda(reserva.valor_total)" 
                    disabled 
                  />
                </div>

                <div class="col-md-4">
                  <label>Caixa Utilizado</label>
                  <template v-if="caixasAbertos.length > 0">
                    <select
                      v-model="transacao.FkCaixa"
                      class="form-select"
                      :class="{ 'is-invalid': !validacao.caixa_id }"
                      required
                    >
                      <option disabled value="">Selecione o caixa</option>
                      <option v-for="caixa in caixasAbertos" :key="caixa.id" :value="caixa.id">
                        {{ caixa.nomeFormatado }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    <div class="alert alert-warning py-2 mb-0">Nenhum caixa aberto disponível</div>
                  </template>
                  <div v-if="!validacao.caixa_id" class="invalid-feedback">Campo obrigatório</div>
                </div>

                <div class="col-md-4">
                  <label>Quem Pagou</label>
                  <input
                    type="text"
                    v-model="transacao.pagador"
                    class="form-control"
                    :class="{ 'is-invalid': !validacao.pagador }"
                    required
                    placeholder="Nome do pagador"
                  />
                  <div v-if="!validacao.pagador" class="invalid-feedback">Campo obrigatório</div>
                </div>
              </div>

              <div v-if="reserva.forma_pagamento === 'Dinheiro'" class="row mb-3">
                <div class="col-md-4">
                  <label>Valor Recebido</label>
                  <input
                    type="number"
                    v-model.number="transacao.valor_recebido"
                    class="form-control"
                    :class="{ 'is-invalid': !validacao.valor_recebido }"
                    required
                    :min="reserva.valor_total"
                    step="0.01"
                  />
                  <div v-if="!validacao.valor_recebido" class="invalid-feedback">
                    O valor recebido não pode ser menor que o valor total da reserva.
                  </div>
                </div>

                <div class="col-md-4">
                  <label>Troco</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    :value="formatarMoeda(troco)" 
                    disabled 
                  />
                </div>
              </div>

              <button class="btn btn-success mt-3">Registrar Transação</button>
            </form>
          </div>
        </div>
        <FooterBar />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

import NavHeaderBar from '@/components/layout/NavHeaderBar.vue'
import NavSideBar from '@/components/layout/NavSideBar.vue'
import FooterBar from '@/components/layout/FooterBar.vue'
import { api } from '@/common/http'

const route = useRoute()
const router = useRouter()
const reservaId = route.params.id as string

const reserva = reactive({
  cliente_nome: '',
  valor_total: 0,
  forma_pagamento: '',
  fkCliente: '',
  fkPessoa: '',
  dataReserva: '',
  horaReserva: '',
  numeroJogadores: 0,
  observacoes: '',
  fkSalaJogo: '',
  fkUnidade: ''
})

const transacao = reactive({
  FkCaixa: '',
  pagador: '',
  valor_recebido: 0
})

interface Caixa {
  id: string
  nomeFormatado: string
}

const caixasAbertos = ref<Caixa[]>([])
const loading = ref({
  reserva: true,
  caixas: true,
  funcionarios: true
})

const validacao = reactive({
  caixa_id: true,
  pagador: true,
  valor_recebido: true
})

const listaSalaJogo = ref<any[]>([])
const listaSalas = ref<any[]>([])

const troco = computed(() => {
  if (reserva.forma_pagamento.toLowerCase() !== 'dinheiro') return 0
  const recebido = transacao.valor_recebido || 0
  const total = reserva.valor_total || 0
  return recebido > total ? recebido - total : 0
})

const formatarMoeda = (valor: number) => {
  if (!valor) return 'R$ 0,00'
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const carregarNomeCliente = async (clienteId: string) => {
  if (!clienteId) return 'Cliente não informado'
  try {
    const res = await api.get(`/api/Cliente/${clienteId}`)
    reserva.fkPessoa = res.data.fkPessoa || res.data.pessoaId || ''
    return res.data.nome || res.data.pessoa?.nome || res.data.clienteNome || res.data.nomeCompleto
  } catch (error) {
    console.error('Erro ao carregar cliente:', error)
    return 'Erro ao carregar'
  }
}

const carregarNomeFuncionario = async (funcionarioId: string) => {
  if (!funcionarioId) return 'Operador não definido'
  try {
    const res = await api.get(`/api/Funcionario/${funcionarioId}`)
    return res.data.nome || res.data.pessoa?.nome || res.data.funcionarioNome || res.data.nomeCompleto
  } catch (error) {
    return 'Erro ao carregar operador'
  }
}

const carregarSalaJogo = async () => {
  const res = await api.get('/api/SalaJogo')
  listaSalaJogo.value = res.data
}

const carregarSalas = async () => {
  const res = await api.get('/api/Sala')
  listaSalas.value = res.data
}

const carregarReserva = async () => {
  try {
    loading.value.reserva = true
    const res = await api.get(`/api/Reserva/${reservaId}`)
    const r = res.data

    reserva.cliente_nome = await carregarNomeCliente(r.fkCliente)
    reserva.valor_total = r.valorTotal || 0
    reserva.forma_pagamento = r.formaPagamento || ''
    reserva.fkCliente = r.fkCliente || ''
    reserva.dataReserva = r.dataReserva || ''
    reserva.horaReserva = r.horaReserva || ''
    reserva.numeroJogadores = r.numeroJogadores || 0
    reserva.observacoes = r.observacoes || ''
    reserva.fkSalaJogo = r.fkSalaJogo || ''

    await Promise.all([carregarSalaJogo(), carregarSalas()])
    const salaJogo = listaSalaJogo.value.find(sj => sj.id === reserva.fkSalaJogo)
    if (salaJogo) {
      const sala = listaSalas.value.find(s => s.id === salaJogo.fkSala)
      if (sala) {
        reserva.fkUnidade = sala.fkUnidade
      }
    }

  } catch (error) {
    console.error('Erro ao carregar reserva:', error)
    Swal.fire('Erro', 'Falha ao carregar os dados da reserva.', 'error')
    router.push('/reservas')
  } finally {
    loading.value.reserva = false
  }
}

const processarCaixas = async (caixas: any[]) => {
  return await Promise.all(
    caixas.map(async (caixa) => {
      let nomeOperador = 'Operador não definido'
      const funcionarioId = caixa.funcionarioId || caixa.fkFuncionario || caixa.responsavelId || caixa.usuarioId
      if (funcionarioId) nomeOperador = await carregarNomeFuncionario(funcionarioId)
      return {
        id: caixa.id,
        nomeFormatado: `ID: ${caixa.id} - ${nomeOperador}`
      }
    })
  )
}

const carregarCaixasAbertos = async () => {
  try {
    loading.value.caixas = true
    const res = await api.get('/api/Caixa/resumido')
    const caixasFiltrados = res.data.filter((c: any) =>
      (c.status?.toLowerCase() === 'aberto' || c.estaAberto === true) &&
      c.fkUnidade === reserva.fkUnidade
    )
    caixasAbertos.value = await processarCaixas(caixasFiltrados)
    console.log('Caixas abertos:', caixasFiltrados)  // <-- Veja o totalTransacoes aqui
  } catch (error) {
    console.error('Erro ao carregar caixas abertos:', error)
    Swal.fire('Erro', 'Falha ao carregar a lista de caixas abertos.', 'error')
  } finally {
    loading.value.caixas = false
  }
}

const validarCampos = () => {
  validacao.caixa_id = transacao.FkCaixa !== ''
  validacao.pagador = transacao.pagador.trim() !== ''
  validacao.valor_recebido =
    reserva.forma_pagamento.toLowerCase() !== 'dinheiro' ||
    transacao.valor_recebido >= reserva.valor_total
  return validacao.caixa_id && validacao.pagador && validacao.valor_recebido
}

const registrarTransacao = async () => {
  if (!validarCampos()) {
    Swal.fire('Erro', 'Preencha todos os campos obrigatórios corretamente.', 'error')
    return
  }

  try {
    const payloadTransacao = {
      valor: reserva.valor_total,
      data: new Date().toISOString(),
      tipo: 'RESERVA',
      formaPagamento: reserva.forma_pagamento,
      pagador: transacao.pagador,
      valorRecebido: reserva.forma_pagamento.toLowerCase() === 'dinheiro'
        ? transacao.valor_recebido
        : reserva.valor_total,
      troco: troco.value,
      FkCaixa: transacao.FkCaixa,
      FkPessoa: reserva.fkPessoa || null,
      FkReserva: reservaId
    }

    const payloadReserva = {
      id: reservaId,
      dataReserva: reserva.dataReserva,
      horaReserva: reserva.horaReserva,
      numeroJogadores: reserva.numeroJogadores,
      valorTotal: reserva.valor_total,
      status: 'CONFIRMADO',
      observacoes: reserva.observacoes,
      formaPagamento: reserva.forma_pagamento,
      fkCliente: reserva.fkCliente,
      fkSalaJogo: reserva.fkSalaJogo
    }

    await api.post('/api/Transacao', payloadTransacao)
    await api.put(`/api/Reserva/${reservaId}`, payloadReserva)

    Swal.fire('Sucesso!', 'Operação concluída com sucesso', 'success')
      .then(() => router.push('/reservas'))

  } catch (error) {
    let errorMessage = error?.response?.data || error.message || 'Erro desconhecido'
    Swal.fire('Erro', errorMessage, 'error')
  }
}

onMounted(async () => {
  await carregarReserva()
  await carregarCaixasAbertos()
  document.getElementById('spinner')?.classList.remove('show')
})
</script>




<style scoped>
::v-deep input.form-control:disabled {
  background-color: black !important;
  color: inherit !important;
  opacity: 1;
}
</style>