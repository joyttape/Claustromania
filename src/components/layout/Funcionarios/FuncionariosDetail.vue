<template>
  <div>
    <div
      id="spinner"
      class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
      v-if="loading"
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

      <div class="content flex-grow-1" v-if="!loading">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/funcionarios" class="btn btn-outline-light mb-3">
            ← Voltar
          </router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                
                <div class="d-flex align-items-start gap-4">
                  <form @submit.prevent="salvarAlteracoes" class="flex-grow-1" novalidate>
                    <h6 class="mb-3">Dados Pessoais</h6>
                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="nome" class="form-label">Nome</label>
                        <input
                          type="text"
                          id="nome"
                          class="form-control"
                          v-model="funcionario.nome"
                          :class="{ 'is-invalid': $v.funcionario.nome.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="$v.funcionario.nome.$error">
                          Nome é obrigatório e deve ter pelo menos 3 caracteres.
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="cpf" class="form-label">CPF</label>
                        <input
                          type="text"
                          id="cpf"
                          class="form-control"
                          v-model="funcionario.cpf"
                          @input="aplicarMascaraCPF"
                          :class="{ 'is-invalid': $v.funcionario.cpf.$error }"
                          maxlength="14"
                          placeholder="000.000.000-00"
                        />
                        <div class="invalid-feedback" v-if="$v.funcionario.cpf.$error">
                          CPF inválido.
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                        <input
                          type="date"
                          id="dataNascimento"
                          class="form-control"
                          v-model="funcionario.dataNascimento"
                          :class="{ 'is-invalid': $v.funcionario.dataNascimento.$error }"
                        />
                        <div class="invalid-feedback" v-if="$v.funcionario.dataNascimento.$error">
                          Data de nascimento é obrigatória.
                        </div>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="sexo" class="form-label">Sexo</label>
                        <select
                          id="sexo"
                          class="form-select"
                          v-model="funcionario.sexo"
                          :class="{ 'is-invalid': $v.funcionario.sexo.$error }"
                        >
                          <option disabled value="">Selecione</option>
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                          <option value="outro">Outro</option>
                        </select>
                        <div class="invalid-feedback" v-if="$v.funcionario.sexo.$error">
                          Selecione o sexo.
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="email" class="form-label">Email</label>
                        <input
                          type="email"
                          id="email"
                          class="form-control"
                          v-model="funcionario.email"
                          :class="{ 'is-invalid': $v.funcionario.email.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="$v.funcionario.email.$error">
                          Email inválido.
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="telefone" class="form-label">Telefone</label>
                        <input
                          type="text"
                          id="telefone"
                          class="form-control"
                          v-model="funcionario.telefone"
                          @input="aplicarMascaraTelefone"
                          :class="{ 'is-invalid': $v.funcionario.telefone.$error }"
                          maxlength="15"
                          placeholder="(00) 00000-0000"
                        />
                        <div class="invalid-feedback" v-if="$v.funcionario.telefone.$error">
                          Telefone inválido.
                        </div>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="cargo" class="form-label">Cargo</label>
                        <input
                          type="text"
                          id="cargo"
                          class="form-control"
                          v-model="funcionario.cargo"
                          :class="{ 'is-invalid': $v.funcionario.cargo.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="$v.funcionario.cargo.$error">
                          Cargo é obrigatório.
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="salario" class="form-label">Salário</label>
                        <input
                          type="text"
                          id="salario"
                          class="form-control"
                          v-model="funcionario.salarioFormatado"
                          @input="aplicarMascaraSalario"
                          placeholder="R$ 0,00"
                        />
                      </div>

                      <div class="col-md-4">
                        <label for="dataContratacao" class="form-label">Data da Contratação</label>
                        <input
                          type="date"
                          id="dataContratacao"
                          class="form-control"
                          v-model="funcionario.dataContratacao"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="turno" class="form-label">Turno</label>
                        <select
                          id="turno"
                          class="form-select"
                          v-model="funcionario.turno"
                          :class="{ 'is-invalid': $v.funcionario.turno.$error }"
                        >
                          <option disabled value="">Selecione</option>
                          <option value="manha">Manhã</option>
                          <option value="tarde">Tarde</option>
                          <option value="noite">Noite</option>
                          <option value="integral">Integral</option>
                        </select>
                        <div class="invalid-feedback" v-if="$v.funcionario.turno.$error">
                          Selecione o turno.
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="status" class="form-label">Status</label>
                        <select
                          id="status"
                          class="form-select"
                          v-model="funcionario.status"
                          :class="{ 'is-invalid': $v.funcionario.status.$error }"
                        >
                          <option disabled value="">Selecione</option>
                          <option :value="true">Ativo</option>
                          <option :value="false">Inativo</option>
                        </select>
                        <div class="invalid-feedback" v-if="$v.funcionario.status.$error">
                          Selecione o status.
                        </div>
                      </div>
                    </div>

                    <h6 class="mb-3 mt-4">Endereço</h6>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="logradouro" class="form-label">Logradouro</label>
                        <input
                          type="text"
                          id="logradouro"
                          class="form-control"
                          v-model="funcionario.logradouro"
                        />
                      </div>
                      <div class="col-md-2">
                        <label for="numero" class="form-label">Número</label>
                        <input
                          type="text"
                          id="numero"
                          class="form-control"
                          v-model="funcionario.numero"
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="complemento" class="form-label">Complemento</label>
                        <input
                          type="text"
                          id="complemento"
                          class="form-control"
                          v-model="funcionario.complemento"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-3">
                        <label for="bairro" class="form-label">Bairro</label>
                        <input
                          type="text"
                          id="bairro"
                          class="form-control"
                          v-model="funcionario.bairro"
                        />
                      </div>
                      <div class="col-md-3">
                        <label for="cidade" class="form-label">Cidade</label>
                        <input
                          type="text"
                          id="cidade"
                          class="form-control"
                          v-model="funcionario.cidade"
                        />
                      </div>
                      <div class="col-md-3">
                        <label for="estado" class="form-label">Estado</label>
                        <select
                          id="estado"
                          class="form-select"
                          v-model="funcionario.estado"
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
                      </div>
                      <div class="col-md-3">
                        <label for="cep" class="form-label">CEP</label>
                        <input
                          type="text"
                          id="cep"
                          class="form-control"
                          v-model="funcionario.cep"
                          @input="aplicarMascaraCEP"
                          maxlength="9"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>

                    <div class="d-flex justify-content-start mt-4">
                      <button
                        type="submit"
                        class="btn btn-success me-2"
                        :disabled="$v.funcionario.$invalid"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger"
                        @click="cancelarAlteracoes"
                      >
                        Excluir
                      </button>
                    </div>
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

import useVuelidate from '@vuelidate/core'
import {
  required,
  minLength,
  email,
  helpers,
  numeric,
  between,
} from '@vuelidate/validators'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const funcionarioId = route.params.id as string

const funcionario = reactive({
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  telefone: '',
  cargo: '',
  salario: 0,
  salarioFormatado: '',
  dataContratacao: '',
  turno: '',
  status: null as boolean | null,

  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
})

const loading = ref(true)

const cpfValido = helpers.withMessage(
  'CPF inválido',
  (value: string) => {
    if (!value) return true 
    const cpfLimpo = value.replace(/\D/g, '')
    
    if (cpfLimpo.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
    
    return true;
  }
)

const telefoneValido = helpers.withMessage(
  'Telefone inválido',
  (value: string) => {
    if (!value) return true;
    const telefone = value.replace(/\D/g, '');
    return telefone.length === 10 || telefone.length === 11;
  }
)

const rules = {
  funcionario: {
    nome: { required, minLength: minLength(3) },
    cpf: { cpfValido },
    dataNascimento: { required },
    sexo: { required },
    email: { required, email },
    telefone: { telefoneValido },
    cargo: { required },
    turno: { required },
    status: { required },
  },
}

const $v = useVuelidate(rules, { funcionario })

function aplicarMascaraCPF(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  funcionario.cpf = value;
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
  
  funcionario.telefone = value;
}

function aplicarMascaraCEP(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length <= 8) {
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  
  funcionario.cep = value;
}

function aplicarMascaraSalario(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value === '') {
    funcionario.salarioFormatado = '';
    funcionario.salario = 0;
    return;
  }
  
  const numero = parseInt(value);
  
  const valorEmReais = numero / 100;
  
  funcionario.salarioFormatado = 'R$ ' + valorEmReais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  funcionario.salario = valorEmReais;
}

function formatarCPF(cpf: string): string {
  if (!cpf) return '';
  const apenasNumeros = cpf.replace(/\D/g, '');
  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
}

function formatarTelefone(telefone: string): string {
  if (!telefone) return '';
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  if (apenasNumeros.length === 10) {
    return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}

function formatarCEP(cep: string): string {
  if (!cep) return '';
  const apenasNumeros = cep.replace(/\D/g, '');
  if (apenasNumeros.length === 8) {
    return apenasNumeros.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  return cep;
}

function formatarSalario(salario: number): string {
  if (!salario && salario !== 0) return '';
  return 'R$ ' + salario.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function removerMascaras(dados: any) {
  return {
    ...dados,
    cpf: dados.cpf ? dados.cpf.replace(/\D/g, '') : '',
    telefone: dados.telefone ? dados.telefone.replace(/\D/g, '') : '',
    cep: dados.cep ? dados.cep.replace(/\D/g, '') : '',
    salario: dados.salario || 0
  };
}

const carregarFuncionario = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:3000/funcionarios/${funcionarioId}`)
    const dados = response.data

    funcionario.nome = dados.nome || ''
    funcionario.cpf = formatarCPF(dados.cpf || '')
    funcionario.dataNascimento = dados.dataNascimento || ''
    funcionario.sexo = dados.sexo || ''
    funcionario.email = dados.email || ''
    funcionario.telefone = formatarTelefone(dados.telefone || '')
    funcionario.cargo = dados.cargo || ''
    funcionario.salario = dados.salario || 0
    funcionario.salarioFormatado = formatarSalario(dados.salario || 0)
    funcionario.dataContratacao = dados.dataContratacao || ''
    funcionario.turno = dados.turno || ''
    funcionario.status = typeof dados.status === 'boolean' ? dados.status : null

    funcionario.logradouro = dados.logradouro || ''
    funcionario.numero = dados.numero || ''
    funcionario.complemento = dados.complemento || ''
    funcionario.bairro = dados.bairro || ''
    funcionario.cidade = dados.cidade || ''
    funcionario.estado = dados.estado || ''
    funcionario.cep = formatarCEP(dados.cep || '')
  } catch (error) {
    console.error('Erro ao carregar funcionário:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao carregar funcionário',
      text: 'Tente novamente mais tarde.',
    })
  } finally {
    loading.value = false
  }
}

const salvarAlteracoes = async () => {
  $v.value.$touch()
  if ($v.value.$invalid) {
    Swal.fire({
      icon: 'error',
      title: 'Formulário inválido',
      text: 'Por favor, corrija os erros antes de salvar.',
    })
    return
  }

  try {
    const dadosParaSalvar = removerMascaras(funcionario);
    
    await axios.put(`http://localhost:3000/funcionarios/${funcionarioId}`, dadosParaSalvar)
    await Swal.fire({
      icon: 'success',
      title: 'Salvo com sucesso!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    })
    router.push('/funcionarios')
  } catch (error) {
    console.error('Erro ao salvar funcionário:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao salvar!',
      text: 'Tente novamente mais tarde.',
    })
  }
}

const cancelarAlteracoes = async () => {
  const resultado = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não pode ser desfeita.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
  })

  if (resultado.isConfirmed) {
    try {
      await axios.delete(`http://localhost:3000/funcionarios/${funcionarioId}`)
      await Swal.fire({
        icon: 'success',
        title: 'Excluído com sucesso!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      })
      router.push('/funcionarios')
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir!',
        text: 'Tente novamente mais tarde.',
      })
    }
  }
}

onMounted(() => {
  carregarFuncionario()
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

<style>
.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
}
</style>


