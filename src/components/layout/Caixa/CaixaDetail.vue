<template>
  <div>
    <div id="spinner" class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />

      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/caixa" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Detalhes do Caixa</h6>

                <form @submit.prevent="salvarAlteracoes" novalidate>
                  <div class="mb-3">
                    <label for="nome" class="form-label">Nome do Caixa</label>
                    <input 
                      type="text" 
                      id="nome" 
                      class="form-control" 
                      v-model="caixa.nome" 
                      :class="{ 'is-invalid': v$.nome.$error }" 
                      required
                    />
                    <div class="invalid-feedback" v-if="v$.nome.$error">Nome do caixa é obrigatório.</div>
                  </div>

                  <div class="mb-3">
                    <label for="unidade" class="form-label">Unidade</label>
                    <div class="position-relative">
                      <input
                        type="text"
                        id="unidade"
                        class="form-control"
                        v-model="unidadePesquisa"
                        @input="pesquisarUnidade"
                        @focus="mostrarSugestoesUnidade = true"
                        placeholder="Pesquisar unidade..."
                        :class="{ 'is-invalid': v$.unidade_id.$error }"
                        required
                      />
                      <div class="invalid-feedback" v-if="v$.unidade_id.$error">Unidade é obrigatória.</div>
                      <div 
                        v-if="mostrarSugestoesUnidade && unidadesFiltradas.length > 0"
                        class="list-group position-absolute w-100 z-3 mt-1"
                        style="max-height: 200px; overflow-y: auto;"
                      >
                        <button
                          type="button"
                          class="list-group-item list-group-item-action"
                          v-for="uni in unidadesFiltradas"
                          :key="uni.id"
                          @click="selecionarUnidade(uni)"
                        >
                          {{ uni.nome }}
                        </button>
                      </div>
                    </div>
                    <small class="text-light" v-if="caixa.unidade_nome">
                      Selecionada: <strong>{{ caixa.unidade_nome }}</strong>
                    </small>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="data_abertura" class="form-label">Data de Abertura</label>
                      <input 
                        type="datetime-local" 
                        class="form-control" 
                        id="data_abertura" 
                        v-model="caixa.data_abertura" 
                        :class="{ 'is-invalid': v$.data_abertura.$error }"
                        required 
                      />
                      <div class="invalid-feedback" v-if="v$.data_abertura.$error">
                        Data de abertura é obrigatória.
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label for="valor_abertura" class="form-label">Valor de Abertura (R$)</label>
                      <input
                        type="text"
                        class="form-control"
                        id="valor_abertura"
                        v-model="caixa.valor_abertura_formatado"
                        :class="{ 'is-invalid': v$.valor_abertura.$error }"
                        @input="aplicarMascaraValorAbertura"
                        required
                      />
                      <div class="invalid-feedback" v-if="v$.valor_abertura.$error">
                        Valor de abertura é obrigatório e deve ser maior que zero.
                      </div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="data_fechamento" class="form-label">Data de Fechamento</label>
                      <input 
                        type="datetime-local" 
                        class="form-control" 
                        id="data_fechamento" 
                        v-model="caixa.data_fechamento" 
                        :class="{ 'is-invalid': v$.data_fechamento.$error }"
                        :disabled="caixa.status !== 'Fechado'"
                      />
                      <div class="invalid-feedback" v-if="v$.data_fechamento.$error">
                        Data de fechamento deve ser posterior à abertura.
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label for="valor_fechamento" class="form-label">Valor de Fechamento (R$)</label>
                      <input
                        type="text"
                        class="form-control"
                        id="valor_fechamento"
                        v-model="caixa.valor_fechamento_formatado"
                        :class="{ 'is-invalid': v$.valor_fechamento.$error }"
                        :disabled="caixa.status !== 'Fechado'"
                        @input="aplicarMascaraValorFechamento"
                      />
                      <div class="invalid-feedback" v-if="v$.valor_fechamento.$error">
                        Valor de fechamento deve ser maior que zero.
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="total_transacoes" class="form-label">Total de Transações (R$)</label>
                    <input
                      type="text"
                      id="total_transacoes"
                      class="form-control"
                      :value="formatarValorParaExibicao(caixa.totalTransacoes)"
                      @input="aplicarMascaraTransacoes"
                      :disabled="caixa.status !== 'Fechado'"
                    />
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="status" class="form-label">Status</label>
                      <select 
                        class="form-select" 
                        id="status" 
                        v-model="caixa.status" 
                        :class="{ 'is-invalid': v$.status.$error }"
                        required
                      >
                        <option disabled value="">Selecione</option>
                        <option value="Aberto">Aberto</option>
                        <option value="Fechado">Fechado</option>
                      </select>
                      <div class="invalid-feedback" v-if="v$.status.$error">
                        Status é obrigatório.
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label for="funcionario" class="form-label">Funcionário Responsável</label>
                      <div class="position-relative">
                        <input
                          type="text"
                          class="form-control"
                          id="funcionario"
                          v-model="funcionarioPesquisa"
                          @input="pesquisarFuncionario"
                          @focus="mostrarSugestoes = true"
                          placeholder="Pesquisar funcionário..."
                          :class="{ 'is-invalid': v$.funcionario_id.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.funcionario_id.$error">
                          Funcionário responsável é obrigatório.
                        </div>
                        <div 
                          v-if="mostrarSugestoes && funcionariosFiltrados.length > 0"
                          class="list-group position-absolute w-100 z-3 mt-1"
                          style="max-height: 200px; overflow-y: auto;"
                        >
                          <button
                            type="button"
                            class="list-group-item list-group-item-action"
                            v-for="func in funcionariosFiltrados"
                            :key="func.id"
                            @click="selecionarFuncionario(func)"
                          >
                            {{ func.pessoa.nome }}
                          </button>
                        </div>
                      </div>
                      <small class="text-light" v-if="caixa.funcionario_nome">
                        Selecionado: <strong>{{ caixa.funcionario_nome }}</strong>
                      </small>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="observacao" class="form-label">Observação</label>
                      <textarea 
                        class="form-control" 
                        id="observacao" 
                        rows="2" 
                        v-model="caixa.observacao" 
                        placeholder="Observações sobre o caixa"
                        :class="{ 'is-invalid': v$.observacao.$error }"
                      ></textarea>
                      <div class="invalid-feedback" v-if="v$.observacao.$error">
                        Observação não pode exceder 500 caracteres.
                      </div>
                    </div>
                  </div>

                  
                  <div class="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <button type="submit" class="btn btn-success me-2" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
                      </button>
                      <button type="button" class="btn btn-danger" @click="confirmarExclusao" :disabled="loading">
                        Excluir Caixa
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

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'
import Swal from 'sweetalert2'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import { api } from '@/common/http'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const caixa = reactive({
  id: '',
  nome: '',
  data_abertura: '',
  valor_abertura_formatado: '',
  valor_abertura: 0,
  data_fechamento: '',
  valor_fechamento_formatado: '',
  valor_fechamento: 0,
  status: 'Aberto',
  observacao: '',
  funcionario_id: null as number | null,
  funcionario_nome: '',
  unidade_id: '',
  unidade_nome: '',
  totalTransacoes: 0
})

const loading = ref(false)
const funcionarioPesquisa = ref('')
const mostrarSugestoes = ref(false)
const funcionariosFiltrados = ref<FuncionarioComPessoa[]>([])
const listaFuncionarios = ref<FuncionarioComPessoa[]>([])

const unidadePesquisa = ref('')
const mostrarSugestoesUnidade = ref(false)
const unidadesFiltradas = ref<Unidade[]>([])
const listaUnidades = ref<Unidade[]>([])

type FuncionarioComPessoa = {
  id: number
  pessoa: {
    nome: string
  }
}

type Unidade = {
  id: string
  nome: string
}

const rules = {
  nome: { required },
  data_abertura: { required },
  valor_abertura: {
    required,
    valorValido: helpers.withMessage('Valor deve ser maior que zero', (value: number) => value > 0)
  },
  data_fechamento: {
    valido: helpers.withMessage('Data de fechamento deve ser posterior à abertura', (value: string) => {
      if (!value || caixa.status !== 'Fechado') return true
      return new Date(value) > new Date(caixa.data_abertura)
    })
  },
  valor_fechamento: {
    valido: helpers.withMessage('Valor deve ser maior que zero', (value: number) => {
      if (caixa.status !== 'Fechado') return true
      return value > 0
    })
  },
  status: { required },
  funcionario_id: { required },
  unidade_id: { required },
  observacao: { maxLength: maxLength(500) },
  totalTransacoes: {
    minimo: helpers.withMessage('Total de transações não pode ser negativo', (v: number) => v >= 0)
  }
}

const v$ = useVuelidate(rules, caixa)

const carregarDados = async () => {
  try {
    const [caixaRes, funcionariosRes, unidadesRes] = await Promise.all([
      api.get(`/api/Caixa/resumido/${id}`),
      api.get('/api/Funcionario'),
      api.get('/api/Unidade')
    ])

    listaFuncionarios.value = funcionariosRes.data
    listaUnidades.value = unidadesRes.data

    const dados = caixaRes.data
    caixa.id = dados.id
    caixa.nome = dados.nome
    caixa.data_abertura = dados.dataHoraAbertura ? dados.dataHoraAbertura.replace('Z', '') : ''
    caixa.valor_abertura = dados.valorInicial || 0
    caixa.valor_abertura_formatado = formatarValorParaExibicao(dados.valorInicial)
    caixa.data_fechamento = dados.dataHoraFechamento ? dados.dataHoraFechamento.replace('Z', '') : ''
    caixa.valor_fechamento = dados.valorFinal || 0
    caixa.valor_fechamento_formatado = formatarValorParaExibicao(dados.valorFinal)
    caixa.status = dados.status
    caixa.observacao = dados.observacoes || ''
    caixa.funcionario_id = dados.fkFuncionario
    caixa.unidade_id = dados.fkUnidade
    caixa.totalTransacoes = dados.totalTransacoes || 0

    const funcionario = listaFuncionarios.value.find(f => f.id === dados.fkFuncionario)
    if (funcionario) {
      caixa.funcionario_nome = funcionario.pessoa.nome
      funcionarioPesquisa.value = funcionario.pessoa.nome
    }

    const unidade = listaUnidades.value.find(u => u.id === dados.fkUnidade)
    if (unidade) {
      caixa.unidade_nome = unidade.nome
      unidadePesquisa.value = unidade.nome
    }

  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    Swal.fire('Erro', 'Não foi possível carregar os dados do caixa.', 'error')
    router.push('/caixa')
  } finally {
    document.getElementById('spinner')?.classList.remove('show')
  }
}

const aplicarMascaraTransacoes = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const apenasDigitos = input.value.replace(/\D/g, '');
  const valorNumerico = apenasDigitos ? parseFloat(apenasDigitos) / 100 : 0;
  caixa.totalTransacoes = valorNumerico;
  input.value = formatarValorParaExibicao(valorNumerico);
};

const formatarValorParaExibicao = (valor: number | null): string => {
  if (valor === null || isNaN(valor)) return ''
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const formatarDataParaAPI = (dataLocal: string) => {
  if (!dataLocal) return null
  const date = new Date(dataLocal)
  return date.toISOString()
}

const pesquisarFuncionario = () => {
  if (funcionarioPesquisa.value.length < 2) {
    funcionariosFiltrados.value = []
    return
  }
  
  const termo = funcionarioPesquisa.value.toLowerCase()
  funcionariosFiltrados.value = listaFuncionarios.value.filter(f =>
    f.pessoa.nome.toLowerCase().includes(termo)
  )
}

const selecionarFuncionario = (funcionario: FuncionarioComPessoa) => {
  caixa.funcionario_id = funcionario.id
  caixa.funcionario_nome = funcionario.pessoa.nome
  funcionarioPesquisa.value = funcionario.pessoa.nome
  mostrarSugestoes.value = false
}

const pesquisarUnidade = () => {
  if (unidadePesquisa.value.length < 2) {
    unidadesFiltradas.value = []
    return
  }
  
  const termo = unidadePesquisa.value.toLowerCase()
  unidadesFiltradas.value = listaUnidades.value.filter(u =>
    u.nome.toLowerCase().includes(termo)
  )
}

const selecionarUnidade = (unidade: Unidade) => {
  caixa.unidade_id = unidade.id
  caixa.unidade_nome = unidade.nome
  unidadePesquisa.value = unidade.nome
  mostrarSugestoesUnidade.value = false
}

const aplicarMascaraValor = (valor: string, isAbertura: boolean) => {
  const apenasDigitos = valor.replace(/\D/g, '')
  const valorNumerico = apenasDigitos ? parseFloat(apenasDigitos) / 100 : 0

  if (isAbertura) {
    caixa.valor_abertura = valorNumerico
    caixa.valor_abertura_formatado = formatarValorParaExibicao(valorNumerico)
  } else {
    caixa.valor_fechamento = valorNumerico
    caixa.valor_fechamento_formatado = formatarValorParaExibicao(valorNumerico)
  }
}

const aplicarMascaraValorAbertura = (event: Event) => {
  aplicarMascaraValor((event.target as HTMLInputElement).value, true)
}

const aplicarMascaraValorFechamento = (event: Event) => {
  aplicarMascaraValor((event.target as HTMLInputElement).value, false)
}

const salvarAlteracoes = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    Swal.fire({
      icon: 'error',
      title: 'Formulário inválido',
      text: 'Por favor, corrija os erros destacados antes de enviar.',
    })
    return
  }

  loading.value = true

  try {
    const dados = {
      id: caixa.id,
      nome: caixa.nome,
      dataHoraAbertura: formatarDataParaAPI(caixa.data_abertura),
      valorInicial: caixa.valor_abertura,
      status: caixa.status,
      observacoes: caixa.observacao || null,
      fkUnidade: caixa.unidade_id,
      fkFuncionario: caixa.funcionario_id,
      totalTransacoes: caixa.totalTransacoes || 0
    }

    if (caixa.status === 'Fechado') {
      Object.assign(dados, {
        dataHoraFechamento: formatarDataParaAPI(caixa.data_fechamento),
        valorFinal: caixa.valor_fechamento
      })
    }

    console.log('Dados sendo enviados:', JSON.stringify(dados, null, 2))
    
    await api.put(`/api/Caixa/resumido/${caixa.id}`, dados)

    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Caixa atualizado com sucesso.',
      timer: 2000,
      showConfirmButton: false
    })
    
    router.push('/caixa')
  } catch (error) {
    console.error('Erro ao salvar:', error)
    
    const errorMessage = error.response?.data?.title || 
                        error.response?.data?.message || 
                        'Erro ao atualizar caixa. Tente novamente.'

    Swal.fire({
      icon: 'error',
      title: 'Erro',
      html: `<div>${errorMessage}</div>`,
      footer: 'Verifique o console para detalhes'
    })
  } finally {
    loading.value = false
  }
}

const confirmarExclusao = async () => {
  const confirm = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não pode ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  })

  if (confirm.isConfirmed) {
    try {
      loading.value = true
      await api.delete(`/api/Caixa/resumido/${id}`)
      
      await Swal.fire({
        icon: 'success',
        title: 'Excluído!',
        text: 'O caixa foi removido com sucesso.',
        timer: 2000,
        showConfirmButton: false
      })
      
      router.push('/caixa')
    } catch (error) {
      console.error('Erro ao excluir:', error)
      Swal.fire('Erro', 'Falha ao excluir o caixa.', 'error')
    } finally {
      loading.value = false
    }
  }
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
:deep(input.form-control:disabled),
:deep(input[type="datetime-local"]:disabled),
:deep(select.form-select:disabled) {
  background-color: black !important;
  color: inherit !important;
  opacity: 1;
  cursor: not-allowed;
}
</style>
