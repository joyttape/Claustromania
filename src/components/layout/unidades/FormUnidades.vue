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
          <router-link to="/unidades" class="btn btn-outline-light mb-3">
            ← Voltar
          </router-link>
          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Cadastro de Unidades</h6>

                <div class="d-flex align-items-start gap-4">
                  <form @submit.prevent="cadastrarUnidade" class="flex-grow-1" novalidate>
                    
                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="nome" class="form-label">Nome</label>
                        <input
                          type="text"
                          class="form-control"
                          id="nome"
                          v-model="unidade.nome"
                          :class="{ 'is-invalid': v$.nome.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.nome.$error">
                          <div v-if="!v$.nome.required">Nome é obrigatório.</div>
                          <div v-if="!v$.nome.minLength">
                            Nome deve ter no mínimo 3 caracteres.
                          </div>
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="cnpj" class="form-label">CNPJ</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cnpj"
                          v-model="unidade.cnpj"
                          @input="aplicarMascaraCNPJ"
                          :class="{ 'is-invalid': v$.cnpj.$error }"
                          maxlength="18"
                          placeholder="00.000.000/0000-00"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.cnpj.$error">
                          <div v-if="!v$.cnpj.required">CNPJ é obrigatório.</div>
                          <div v-if="!v$.cnpj.cnpjValido">
                            CNPJ inválido.
                          </div>
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="telefone" class="form-label">Telefone</label>
                        <input
                          type="text"
                          class="form-control"
                          id="telefone"
                          v-model="unidade.telefone"
                          @input="aplicarMascaraTelefone"
                          :class="{ 'is-invalid': v$.telefone.$error }"
                          maxlength="15"
                          placeholder="(00) 00000-0000"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.telefone.$error">
                          <div v-if="!v$.telefone.required">Telefone é obrigatório.</div>
                          <div v-if="!v$.telefone.telefoneValido">Telefone inválido.</div>
                        </div>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label class="form-label">Status</label>
                        <div class="form-check mt-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="status"
                            v-model="unidade.status"
                          />
                          <label class="form-check-label" for="status">Unidade ativa</label>
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="capacidade" class="form-label">Capacidade</label>
                        <input
                          type="text"
                          class="form-control"
                          id="capacidade"
                          v-model="unidade.capacidade"
                          :class="{ 'is-invalid': v$.capacidade.$error }"
                        />
                        <div class="invalid-feedback" v-if="v$.capacidade.$error">
                          Informe uma capacidade válida.
                        </div>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="diasFuncionamento" class="form-label">Dias de Funcionamento</label>
                        <input
                          type="text"
                          class="form-control"
                          id="diasFuncionamento"
                          v-model="unidade.diasFuncionamento"
                          :class="{ 'is-invalid': v$.diasFuncionamento.$error }"
                          placeholder="Ex: Segunda a Sexta, 9h às 18h / Sábado, 10h às 16h"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.diasFuncionamento.$error">
                          Informe os dias de funcionamento.
                        </div>
                      </div>

                      <div class="col-md-3">
                        <label for="horarioAbertura" class="form-label">Horário de Abertura</label>
                        <input
                          type="time"
                          class="form-control"
                          id="horarioAbertura"
                          v-model="unidade.horarioAbertura"
                          :class="{ 'is-invalid': v$.horarioAbertura.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.horarioAbertura.$error">
                          Horário de abertura é obrigatório.
                        </div>
                      </div>

                      <div class="col-md-3">
                        <label for="horarioFechamento" class="form-label">Horário de Fechamento</label>
                        <input
                          type="time"
                          class="form-control"
                          id="horarioFechamento"
                          v-model="unidade.horarioFechamento"
                          :class="{ 'is-invalid': v$.horarioFechamento.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.horarioFechamento.$error">
                          Horário de fechamento é obrigatório.
                        </div>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="gerente" class="form-label">Gerente</label>
                        <div class="position-relative">
                          <input
                            type="text"
                            class="form-control"
                            id="gerente"
                            v-model="gerentePesquisa"
                            @input="pesquisarGerente"
                            @focus="mostrarSugestoesGerente = true"
                            autocomplete="off"
                            placeholder="Pesquisar gerente..."
                            :class="{ 'is-invalid': v$.gerente_id?.$error }"
                            required
                          />
                          <div
                            v-if="mostrarSugestoesGerente && gerentesFiltrados.length > 0"
                            class="list-group position-absolute w-100 z-3 mt-1"
                            style="max-height: 200px; overflow-y: auto;"
                          >
                            <button
                              type="button"
                              class="list-group-item list-group-item-action"
                              v-for="gerente in gerentesFiltrados"
                              :key="gerente.id"
                              @click="selecionarGerente(gerente)"
                            >
                              {{ gerente.nome }}
                            </button>
                          </div>
                        </div>
                        <small class="text-light" v-if="unidade.gerente_nome">
                          Selecionado: <strong>{{ unidade.gerente_nome }}</strong>
                        </small>
                        <div class="invalid-feedback" v-if="v$.gerente_id?.$error">
                          Gerente é obrigatório.
                        </div>
                      </div>
                    </div>

                    <h6 class="mb-3 mt-4">Endereço</h6>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="logradouro" class="form-label">Logradouro</label>
                        <input
                          type="text"
                          class="form-control"
                          id="logradouro"
                          v-model="unidade.logradouro"
                          :class="{ 'is-invalid': v$.logradouro.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.logradouro.$error">
                          Logradouro é obrigatório.
                        </div>
                      </div>
                      <div class="col-md-2">
                        <label for="numero" class="form-label">Número</label>
                        <input
                          type="text"
                          class="form-control"
                          id="numero"
                          v-model="unidade.numero"
                          :class="{ 'is-invalid': v$.numero.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.numero.$error">
                          Número é obrigatório.
                        </div>
                      </div>
                      <div class="col-md-4">
                        <label for="complemento" class="form-label">Complemento</label>
                        <input
                          type="text"
                          class="form-control"
                          id="complemento"
                          v-model="unidade.complemento"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-3">
                        <label for="bairro" class="form-label">Bairro</label>
                        <input
                          type="text"
                          class="form-control"
                          id="bairro"
                          v-model="unidade.bairro"
                          :class="{ 'is-invalid': v$.bairro.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.bairro.$error">
                          Bairro é obrigatório.
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label for="cidade" class="form-label">Cidade</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cidade"
                          v-model="unidade.cidade"
                          :class="{ 'is-invalid': v$.cidade.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.cidade.$error">
                          Cidade é obrigatória.
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label for="estado" class="form-label">Estado</label>
                        <select
                          class="form-select"
                          id="estado"
                          v-model="unidade.estado"
                          :class="{ 'is-invalid': v$.estado.$error }"
                          required
                        >
                          <option disabled value="">Selecione</option>
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AP">AP</option>
                          <option value="AM">AM</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="MG">MG</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PR">PR</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RS">RS</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="SC">SC</option>
                          <option value="SP">SP</option>
                          <option value="SE">SE</option>
                          <option value="TO">TO</option>
                        </select>
                        <div class="invalid-feedback" v-if="v$.estado.$error">
                          Estado é obrigatório.
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label for="cep" class="form-label">CEP</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cep"
                          v-model="unidade.cep"
                          @input="aplicarMascaraCEP"
                          :class="{ 'is-invalid': v$.cep.$error }"
                          maxlength="9"
                          placeholder="00000-000"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.cep.$error">
                          <div v-if="!v$.cep.required">CEP é obrigatório.</div>
                          <div v-if="!v$.cep.cepValido">CEP inválido.</div>
                        </div>
                      </div>
                    </div>

                    <button type="submit" class="btn btn-primary">
                      Salvar
                    </button>
                  </form>

                </div>
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
import { required, minLength, numeric } from '@vuelidate/validators'
import axios from 'axios'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import { Toast } from '@/components/common/toast'

const unidade = reactive({
  nome: '',
  cnpj: '',
  telefone: '',
  status: false,
  capacidade: '',
  diasFuncionamento: '',
  horarioAbertura: '',
  horarioFechamento: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  gerente_id: null as string | number | null,
  gerente_nome: '',
})

const fotoPreview = ref<string | null>(null)

const listaGerentes = ref<{ id: number; nome: string }[]>([])
const gerentesFiltrados = ref<{ id: number; nome: string }[]>([])
const gerentePesquisa = ref('')
const mostrarSugestoesGerente = ref(false)

const cnpjValido = (value: string) => {
  if (!value) return true;
  
  const cnpj = value.replace(/\D/g, '');
  
  if (cnpj.length !== 14) return false;
  
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
};

const telefoneValido = (value: string) => {
  if (!value) return true;
  
  const telefone = value.replace(/\D/g, '');
  
  return telefone.length === 10 || telefone.length === 11;
};

const cepValido = (value: string) => {
  if (!value) return true;
  
  const cep = value.replace(/\D/g, '');
  
  return cep.length === 8;
};

const rules = {
  nome: {
    required,
    minLength: minLength(3),
  },
  cnpj: {
    required,
    cnpjValido,
  },
  telefone: {
    required,
    telefoneValido,
  },
  logradouro: { required },
  numero: { required },
  bairro: { required },
  cidade: { required },
  estado: { required },
  cep: {
    required,
    cepValido,
  },
  capacidade: {
    numeric,
  },
  diasFuncionamento: {
    required,
    minLength: minLength(3),
  },
  horarioAbertura: { required },
  horarioFechamento: {
    required,
    horarioValido: (value: string) => {
      if (!unidade.horarioAbertura || !value) return true
      return unidade.horarioAbertura < value
    },
  },
  gerente_id: { required },
}

const v$ = useVuelidate(rules, unidade)

const router = useRouter()

function aplicarMascaraCNPJ(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length <= 14) {
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  unidade.cnpj = value;
}

function aplicarMascaraTelefone(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length <= 11) {
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
  }
  
  unidade.telefone = value;
}

function aplicarMascaraCEP(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length <= 8) {
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  
  unidade.cep = value;
}

function limparFormulario() {
  unidade.nome = ''
  unidade.cnpj = ''
  unidade.telefone = ''
  unidade.status = false
  unidade.capacidade = ''
  unidade.diasFuncionamento = ''
  unidade.horarioAbertura = ''
  unidade.horarioFechamento = ''
  unidade.logradouro = ''
  unidade.numero = ''
  unidade.complemento = ''
  unidade.bairro = ''
  unidade.cidade = ''
  unidade.estado = ''
  unidade.cep = ''
  unidade.gerente_id = null
  unidade.gerente_nome = ''
  fotoPreview.value = null
  gerentePesquisa.value = ''
  gerentesFiltrados.value = []
  mostrarSugestoesGerente.value = false
  v$.value.$reset()
}

async function cadastrarUnidade() {
  const isValid = await v$.value.$validate()

  if (!isValid) {
    Toast.fire({
      icon: 'error',
      title: 'Corrija os erros no formulário antes de enviar.',
    })
    return
  }

  const cnpjLimpo = unidade.cnpj.replace(/\D/g, '')
  const telefoneLimpo = unidade.telefone.replace(/\D/g, '')
  const cepLimpo = unidade.cep.replace(/\D/g, '')

  const dadosEnvio = {
    nome: unidade.nome,
    cnpj: cnpjLimpo,
    telefone: telefoneLimpo,
    status: unidade.status ? 1 : 0,
    capacidade: unidade.capacidade ? Number(unidade.capacidade) : null,
    diasFuncionamento: unidade.diasFuncionamento,
    horarioAbertura: unidade.horarioAbertura,
    horarioFechamento: unidade.horarioFechamento,
    logradouro: unidade.logradouro,
    numero: unidade.numero,
    complemento: unidade.complemento,
    bairro: unidade.bairro,
    cidade: unidade.cidade,
    estado: unidade.estado,
    cep: cepLimpo,
    gerente_id: unidade.gerente_id,
  }

  try {
    Toast.fire({
      icon: 'success',
      title: 'Unidade cadastrada com sucesso!',
    })
    limparFormulario()
    router.push('/unidades')
  } catch (error) {
    console.error(error)
    Toast.fire({
      icon: 'error',
      title: 'Erro ao cadastrar unidade. Tente novamente.',
    })
  }
}

const carregarGerentes = async () => {
  try {
    const res = await axios.get('http://localhost:3000/funcionarios?cargo=Gerente')
    listaGerentes.value = res.data
  } catch (error) {
    console.error('Erro ao carregar gerentes:', error)
  }
}

const pesquisarGerente = () => {
  if (gerentePesquisa.value.length < 2) {
    gerentesFiltrados.value = []
    return
  }
  const texto = gerentePesquisa.value.toLowerCase()
  gerentesFiltrados.value = listaGerentes.value.filter(g =>
    g.nome.toLowerCase().includes(texto)
  )
}

const selecionarGerente = (gerente: { id: number; nome: string }) => {
  unidade.gerente_id = gerente.id
  unidade.gerente_nome = gerente.nome
  gerentePesquisa.value = gerente.nome
  mostrarSugestoesGerente.value = false
}

onMounted(() => {
  document.getElementById('spinner')?.classList.remove('show')
  carregarGerentes()
})
</script>

<style>
.list-group.position-absolute {
  z-index: 1000;
}
</style>