<template>
  <div>
    <!-- Spinner -->
    <div
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
                  <input type="text" class="form-control" :value="reserva.cliente_nome" disabled />
                </div>
                <div class="col-md-6">
                  <label>Forma de Pagamento</label>
                  <input type="text" class="form-control" :value="reserva.forma_pagamento" disabled />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label>Valor Total</label>
                  <input type="text" class="form-control" :value="formatarMoeda(reserva.valor_total)" disabled />
                </div>

                <div class="col-md-4">
                  <label>Caixa Utilizado</label>
                  <select
                    v-model="transacao.caixa_id"
                    class="form-select"
                    :class="{ 'is-invalid': validacao.caixa_id === false }"
                    required
                  >
                    <option disabled value="">Selecione o caixa</option>
                    <option v-for="caixa in caixasAbertos" :key="caixa.id" :value="caixa.id">
                      ID: {{ caixa.id }} - Funcionário: {{ getNomeFuncionario(caixa.funcionario_id) }}
                    </option>
                  </select>
                  <div class="invalid-feedback">Campo obrigatório</div>
                </div>

                <div class="col-md-4">
                  <label>Quem Pagou</label>
                  <input
                    type="text"
                    v-model="transacao.pagador"
                    class="form-control"
                    :class="{ 'is-invalid': validacao.pagador === false }"
                    required
                  />
                  <div class="invalid-feedback">Campo obrigatório</div>
                </div>
              </div>

              <div v-if="reserva.forma_pagamento === 'dinheiro'" class="row mb-3">
                <div class="col-md-4">
                  <label>Valor Recebido</label>
                  <input
                    type="number"
                    v-model.number="transacao.valor_recebido"
                    class="form-control"
                    :class="{ 'is-invalid': validacao.valor_recebido === false }"
                    required
                    :min="reserva.valor_total"
                    @input="validarValorRecebido"
                  />
                  <div v-if="validacao.valor_recebido === false" class="invalid-feedback">
                    O valor recebido não pode ser menor que o valor total da reserva.
                  </div>
                </div>
                <div class="col-md-4">
                  <label>Troco</label>
                  <input type="text" class="form-control" :value="formatarMoeda(troco)" disabled />
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
import axios from 'axios'
import Swal from 'sweetalert2'

import NavHeaderBar from '@/components/layout/NavHeaderBar.vue'
import NavSideBar from '@/components/layout/NavSideBar.vue'
import FooterBar from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const reservaId = route.params.id

const reserva = reactive({
  cliente_nome: '',
  valor_total: 0,
  forma_pagamento: ''
})

const transacao = reactive({
  caixa_id: '',
  pagador: '',
  valor_recebido: 0
})

const caixasAbertos = ref([])

const validacao = reactive({
  caixa_id: true,
  pagador: true,
  valor_recebido: true
})

const troco = computed(() => {
  if (reserva.forma_pagamento !== 'dinheiro') return 0
  const recebido = transacao.valor_recebido || 0
  const total = reserva.valor_total || 0
  return recebido > total ? recebido - total : 0
})

const formatarMoeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const carregarReserva = async () => {
  const res = await axios.get(`http://localhost:3000/reservas/${reservaId}`)
  const r = res.data
  reserva.cliente_nome = r.cliente_nome
  reserva.valor_total = r.valor_total
  reserva.forma_pagamento = r.forma_pagamento
}

const funcionarios = ref([])

const getNomeFuncionario = (id: string) => {
  const func = funcionarios.value.find(f => f.id === id)
  return func ? func.nome : id
}

const carregarFuncionarios = async () => {
  const res = await axios.get('http://localhost:3000/funcionarios')
  funcionarios.value = res.data
}

const carregarCaixasAbertos = async () => {
  const res = await axios.get('http://localhost:3000/caixas')
  caixasAbertos.value = res.data.filter(c => c.status === 'aberto')
}

const validarCampos = () => {
  validacao.caixa_id = transacao.caixa_id.trim() !== ''
  validacao.pagador = transacao.pagador.trim() !== ''

  if (reserva.forma_pagamento === 'dinheiro') {
    validacao.valor_recebido = transacao.valor_recebido >= reserva.valor_total
  } else {
    validacao.valor_recebido = true
  }

  return validacao.caixa_id && validacao.pagador && validacao.valor_recebido
}

const validarValorRecebido = () => {
  if (reserva.forma_pagamento === 'dinheiro') {
    validacao.valor_recebido = transacao.valor_recebido >= reserva.valor_total
  }
}

const registrarTransacao = async () => {
  if (!validarCampos()) {
    Swal.fire('Erro', 'Preencha todos os campos obrigatórios corretamente.', 'error')
    return
  }

  try {
    await axios.post('http://localhost:3000/transacoes', {
      reserva_id: reservaId,
      cliente_nome: reserva.cliente_nome,
      forma_pagamento: reserva.forma_pagamento,
      valor: reserva.valor_total,
      caixa_id: transacao.caixa_id,
      pagador: transacao.pagador,
      valor_recebido: reserva.forma_pagamento === 'dinheiro' ? transacao.valor_recebido : null,
      troco: reserva.forma_pagamento === 'dinheiro' ? troco.value : 0,
      data: new Date().toISOString()
    })


    await axios.patch(`http://localhost:3000/reservas/${reservaId}`, { status: 'confirmado' })

    await Swal.fire('Sucesso!', 'Transação registrada e reserva confirmada.', 'success')
    router.push('/reservas')
  } catch (error) {
    console.error(error)
    Swal.fire('Erro', 'Falha ao registrar a transação ou atualizar a reserva.', 'error')
  }
}

onMounted(async () => {
  document.getElementById('spinner')?.classList.remove('show')
  await carregarReserva()
  await carregarCaixasAbertos()
  await carregarFuncionarios()
})
</script>
