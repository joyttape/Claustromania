<template>
  <div>
    <NavHeaderBar />
    <div class="d-flex">
      <NavSideBar />
      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4 text-light">

          <router-link to="/reservas" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="bg-secondary rounded p-4">
            <h5 class="mb-4">Detalhes da Transação</h5>

            <div v-if="loading.reserva || loading.transacao" class="text-center">
              <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="sr-only">Carregando...</span>
              </div>
            </div>

            <div v-else>
              <div v-if="!transacao.id">
                <p>Nenhuma transação encontrada para esta reserva.</p>
              </div>
              <div v-else>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">ID da Transação</label>
                    <input type="text" class="form-control" :value="transacao.id" disabled />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Cliente</label>
                    <input type="text" class="form-control" :value="reserva.cliente_nome" disabled />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Valor</label>
                    <input type="text" class="form-control" :value="formatarMoeda(transacao.valor)" disabled />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Data</label>
                    <input type="text" class="form-control" :value="transacao.data" disabled />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Tipo</label>
                    <input type="text" class="form-control" :value="transacao.tipo" disabled />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Forma de Pagamento</label>
                    <input type="text" class="form-control" :value="transacao.formaPagamento" disabled />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Pagador</label>
                    <input type="text" class="form-control" :value="transacao.pagador" disabled />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Valor Recebido</label>
                    <input type="text" class="form-control" :value="formatarMoeda(transacao.valorRecebido)" disabled />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Troco</label>
                    <input type="text" class="form-control" :value="formatarMoeda(transacao.troco)" disabled />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Caixa (ID)</label>
                    <input type="text" class="form-control" :value="transacao.fkCaixa" disabled />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Reserva (ID)</label>
                    <input type="text" class="form-control" :value="transacao.fkReserva" disabled />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <FooterBar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
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
  fkSalaJogo: ''
})

const transacao = reactive({
  id: '',
  valor: 0,
  data: '',
  tipo: '',
  formaPagamento: '',
  pagador: '',
  valorRecebido: 0,
  troco: 0,
  fkCaixa: '',
  fkPessoa: null,
  fkReserva: ''
})

const loading = reactive({
  reserva: true,
  transacao: true
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
    return res.data.nome ||
           res.data.pessoa?.nome ||
           res.data.clienteNome ||
           res.data.nomeCompleto ||
           `Cliente (ID: ${clienteId.slice(0, 8)}...)`
  } catch (error) {
    console.error(`Erro ao carregar cliente ${clienteId}:`, error)
    return `Cliente (ID: ${clienteId.slice(0, 8)}...)`
  }
}

const carregarReserva = async () => {
  try {
    loading.reserva = true
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
  } catch (error) {
    console.error('Erro ao carregar reserva:', error)
    Swal.fire('Erro', 'Falha ao carregar os dados da reserva.', 'error')
    router.push('/reservas')
  } finally {
    loading.reserva = false
  }
}

const carregarTransacao = async () => {
  try {
    loading.transacao = true
    const res = await api.get('/api/Transacao')
    const transacoes = res.data || []
    const t = transacoes.find((tran: any) => tran.fkReserva === reservaId)

    if (!t) {
      loading.transacao = false
      return
    }

    const resTransacao = await api.get(`/api/Transacao/${t.id}`)
    const data = resTransacao.data

    transacao.id = data.id
    transacao.valor = data.valor
    transacao.data = data.data
    transacao.tipo = data.tipo
    transacao.formaPagamento = data.formaPagamento
    transacao.pagador = data.pagador
    transacao.valorRecebido = data.valorRecebido
    transacao.troco = data.troco
    transacao.fkCaixa = data.fkCaixa
    transacao.fkPessoa = data.fkPessoa
    transacao.fkReserva = data.fkReserva
  } catch (error) {
    console.error('Erro ao carregar transação:', error)
    Swal.fire('Erro', 'Falha ao carregar os dados da transação.', 'error')
    router.push('/reservas')
  } finally {
    loading.transacao = false
  }
}

onMounted(async () => {
  await Promise.all([carregarReserva(), carregarTransacao()])
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