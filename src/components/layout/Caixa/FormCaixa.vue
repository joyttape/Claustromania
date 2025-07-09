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
                <h6 class="mb-4">Cadastro de Caixa</h6>

                <form @submit.prevent="cadastrarCaixa" novalidate>
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
                        :disabled="caixa.status !== 'fechado'"
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
                        :disabled="caixa.status !== 'fechado'"
                        @input="aplicarMascaraValorFechamento"
                      />
                      <div class="invalid-feedback" v-if="v$.valor_fechamento.$error">
                        Valor de fechamento deve ser maior que zero.
                      </div>
                    </div>
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
                        <option value="aberto">Aberto</option>
                        <option value="fechado">Fechado</option>
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
                            {{ func.nome }}
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

                  <button type="submit" class="btn btn-primary">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Salvando...' : 'Salvar' }}
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
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minValue, maxLength, helpers } from '@vuelidate/validators'
import axios from 'axios'
import Swal from 'sweetalert2'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const router = useRouter()

const caixa = reactive({
  data_abertura: '',
  valor_abertura_formatado: '',
  valor_abertura: null as number | null,
  data_fechamento: '',
  valor_fechamento_formatado: '',
  valor_fechamento: null as number | null,
  status: '',
  observacao: '',
  funcionario_id: null as number | null,
  funcionario_nome: ''
})

const loading = ref(false)
const funcionarioPesquisa = ref('')
const mostrarSugestoes = ref(false)
const funcionariosFiltrados = ref<Array<{id: number, nome: string}>>([])
const listaFuncionarios = ref<Array<{id: number, nome: string}>>([])

const rules = {
  data_abertura: { required },
  valor_abertura: { 
    required,
    valorValido: helpers.withMessage('Valor deve ser maior que zero', (value: number | null) => {
      return value !== null && value > 0
    })
  },
  data_fechamento: {
    valido: helpers.withMessage('Data de fechamento deve ser posterior à abertura', (value: string) => {
      if (!value || caixa.status !== 'fechado') return true
      return new Date(value) > new Date(caixa.data_abertura)
    })
  },
  valor_fechamento: {
    valido: helpers.withMessage('Valor deve ser maior que zero', (value: number | null) => {
      if (caixa.status !== 'fechado') return true
      return value !== null && value > 0
    })
  },
  status: { required },
  funcionario_id: { required },
  observacao: { maxLength: maxLength(500) }
}

const v$ = useVuelidate(rules, caixa)

const pesquisarFuncionario = async () => {
  if (funcionarioPesquisa.value.length < 2) {
    funcionariosFiltrados.value = []
    return
  }

  try {
    if (listaFuncionarios.value.length > 0) {
      funcionariosFiltrados.value = listaFuncionarios.value.filter(func => 
        func.nome.toLowerCase().includes(funcionarioPesquisa.value.toLowerCase())
      )
    } else {
      const response = await axios.get(`http://localhost/funcionarios?nome=${funcionarioPesquisa.value}`)
      funcionariosFiltrados.value = response.data
    }
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error)
    funcionariosFiltrados.value = []
  }
}

const selecionarFuncionario = (funcionario: {id: number, nome: string}) => {
  caixa.funcionario_id = funcionario.id
  caixa.funcionario_nome = funcionario.nome
  funcionarioPesquisa.value = funcionario.nome
  mostrarSugestoes.value = false
}

const aplicarMascaraValorAbertura = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value === '') {
    caixa.valor_abertura_formatado = '';
    caixa.valor_abertura = null;
    return;
  }
  
  const numero = parseInt(value);
  
  const valorEmReais = numero / 100;
  
  caixa.valor_abertura_formatado = 'R$ ' + valorEmReais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  caixa.valor_abertura = valorEmReais;
}

const aplicarMascaraValorFechamento = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value === '') {
    caixa.valor_fechamento_formatado = '';
    caixa.valor_fechamento = null;
    return;
  }
  
  const numero = parseInt(value);
  
  const valorEmReais = numero / 100;
  
  caixa.valor_fechamento_formatado = 'R$ ' + valorEmReais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  caixa.valor_fechamento = valorEmReais;
}

const cadastrarCaixa = async () => {
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
      data_abertura: caixa.data_abertura,
      valor_abertura: caixa.valor_abertura,
      data_fechamento: caixa.status === 'fechado' ? caixa.data_fechamento : null,
      valor_fechamento: caixa.status === 'fechado' ? caixa.valor_fechamento : null,
      status: caixa.status,
      observacao: caixa.observacao,
      funcionario_id: caixa.funcionario_id
    }

    const response = await axios.post('http://localhost:3000/caixas', dados)

    if (response.status === 201) {
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Caixa cadastrado com sucesso.',
        timer: 2000,
        showConfirmButton: false
      })
      limparFormulario()
      router.push('/caixa')
    }
  } catch (error) {
    let errorMessage = 'Erro ao cadastrar caixa'
    
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage += `: ${error.response.data.message}`
    }

    await Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: errorMessage,
    })
  } finally {
    loading.value = false
  }
}

const limparFormulario = () => {
  Object.assign(caixa, {
    data_abertura: '',
    valor_abertura_formatado: '',
    valor_abertura: null,
    data_fechamento: '',
    valor_fechamento_formatado: '',
    valor_fechamento: null,
    status: '',
    observacao: '',
    funcionario_id: null,
    funcionario_nome: ''
  })
  funcionarioPesquisa.value = ''
  v$.value.$reset()
}

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/funcionarios')
    listaFuncionarios.value = response.data
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error)
  }
  
  document.getElementById('spinner')?.classList.remove('show')
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
