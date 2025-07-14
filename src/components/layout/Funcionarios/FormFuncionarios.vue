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
          <router-link to="/funcionarios" class="btn btn-outline-light mb-3">
            ← Voltar
          </router-link>
          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Cadastro de Funcionário</h6>

                <div class="d-flex align-items-start gap-4">
                  <form @submit.prevent="cadastrarFuncionario" class="flex-grow-1" novalidate>
                    <h6 class="mb-3">Dados Pessoais</h6>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="nome" class="form-label">Nome</label>
                        <input
                          type="text"
                          id="nome"
                          class="form-control"
                          v-model="funcionario.nome"
                          :class="{ 'is-invalid': v$.nome.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.nome.$error">
                          <div v-if="!v$.nome.required">Nome é obrigatório.</div>
                          <div v-if="!v$.nome.minLength">Nome deve ter no mínimo 3 caracteres.</div>
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
                          :class="{ 'is-invalid': v$.cpf.$error }"
                          maxlength="14"
                          placeholder="000.000.000-00"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.cpf.$error">
                          <div v-if="!v$.cpf.required">CPF é obrigatório.</div>
                          <div v-if="!v$.cpf.cpfValido">CPF inválido.</div>
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                        <input
                          type="date"
                          id="dataNascimento"
                          class="form-control"
                          v-model="funcionario.dataNascimento"
                          :class="{ 'is-invalid': v$.dataNascimento.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.dataNascimento.$error">
                          Data de Nascimento é obrigatória.
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
                          :class="{ 'is-invalid': v$.sexo.$error }"
                          required
                        >
                          <option disabled value="">Selecione</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Outro">Outro</option>
                        </select>
                        <div class="invalid-feedback" v-if="v$.sexo.$error">Sexo é obrigatório.</div>
                      </div>

                      <div class="col-md-4">
                        <label for="email" class="form-label">Email</label>
                        <input
                          type="email"
                          id="email"
                          class="form-control"
                          v-model="funcionario.email"
                          :class="{ 'is-invalid': v$.email.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.email.$error">
                          <div v-if="!v$.email.required">Email é obrigatório.</div>
                          <div v-if="!v$.email.email">Email inválido.</div>
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
                        <label for="cargo" class="form-label">Cargo</label>
                        <input
                          type="text"
                          id="cargo"
                          class="form-control"
                          v-model="funcionario.cargo"
                          :class="{ 'is-invalid': v$.cargo.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.cargo.$error">Cargo é obrigatório.</div>
                      </div>

                      <div class="col-md-4">
                        <label for="salario" class="form-label">Salário</label>
                        <input
                          type="text"
                          id="salario"
                          class="form-control"
                          v-model="funcionario.salarioFormatado"
                          @input="aplicarMascaraSalario"
                          :class="{ 'is-invalid': v$.salario.$error }"
                          placeholder="R$ 0,00"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.salario.$error">Salário é obrigatório.</div>
                      </div>

                      <div class="col-md-4">
                        <label for="dataContratacao" class="form-label">Data da Contratação</label>
                        <input
                          type="date"
                          id="dataContratacao"
                          class="form-control"
                          v-model="funcionario.dataContratacao"
                          :class="{ 'is-invalid': v$.dataContratacao.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.dataContratacao.$error">Data da contratação é obrigatória.</div>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="turno" class="form-label">Turno</label>
                        <select
                          id="turno"
                          class="form-select"
                          v-model="funcionario.turno"
                          :class="{ 'is-invalid': v$.turno.$error }"
                          required
                        >
                          <option disabled value="">Selecione</option>
                          <option value="Manhã">Manhã</option>
                          <option value="Tarde">Tarde</option>
                          <option value="Noite">Noite</option>
                          <option value="Integral">Integral</option>
                        </select>
                        <div class="invalid-feedback" v-if="v$.turno.$error">Turno é obrigatório.</div>
                      </div>

                      <div class="col-md-4">
                        <label for="status" class="form-label">Status</label>
                        <select
                          id="status"
                          class="form-select"
                          v-model="funcionario.status"
                          :class="{ 'is-invalid': v$.status.$error }"
                          required
                        >
                          <option disabled value="">Selecione</option>
                          <option :value="true">Contratado</option>
                          <option :value="false">Demitido</option>
                        </select>
                        <div class="invalid-feedback" v-if="v$.status.$error">Status é obrigatório.</div>
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

                    <button type="submit" class="btn btn-primary">Salvar</button>
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

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email } from '@vuelidate/validators'
import axios from 'axios'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import { Toast } from '@/components/common/toast'
import { api } from '@/common/http'

const funcionario = reactive({
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  telefone: '',
  cargo: '',
  salario: null as number | null,
  salarioFormatado: '',
  dataContratacao: '',
  turno: '',
  status: true,

  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
})

const cpfValido = (value: string) => {
  if (!value) return true;
  
  const cpf = value.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

const telefoneValido = (value: string) => {
  if (!value) return true;
  
  const telefone = value.replace(/\D/g, '');
  
  return telefone.length === 10 || telefone.length === 11;
};

const rules = {
  nome: { required, minLength: minLength(3) },
  cpf: { required, cpfValido },
  dataNascimento: { required },
  sexo: { required },
  email: { required, email },
  telefone: { required, telefoneValido },
  cargo: { required },
  salario: { required },
  dataContratacao: { required },
  turno: { required },
  status: { required },
}

const v$ = useVuelidate(rules, funcionario)

const router = useRouter()

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
    funcionario.salario = null;
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

function limparFormulario() {
  funcionario.nome = ''
  funcionario.cpf = ''
  funcionario.dataNascimento = ''
  funcionario.sexo = ''
  funcionario.email = ''
  funcionario.telefone = ''
  funcionario.cargo = ''
  funcionario.salario = null
  funcionario.salarioFormatado = ''
  funcionario.dataContratacao = ''
  funcionario.turno = ''
  funcionario.status = true

  funcionario.logradouro = ''
  funcionario.numero = ''
  funcionario.complemento = ''
  funcionario.bairro = ''
  funcionario.cidade = ''
  funcionario.estado = ''
  funcionario.cep = ''
  v$.value.$reset()
}

async function cadastrarFuncionario() {
  const isValid = await v$.value.$validate()

  if (!isValid) {
    Toast.fire({
      icon: 'error',
      title: 'Corrija os erros no formulário antes de enviar.',
    })
    return
  }

  const senhaPadrao = "Trocar@123";

  const dadosEnvio = {
    cargo: funcionario.cargo,
    salario: funcionario.salario,
    dataContratacao: funcionario.dataContratacao,
    turno: funcionario.turno,
    status: funcionario.status, 
    senha: senhaPadrao, 
    pessoa: {
      nome: funcionario.nome,
      cpf: funcionario.cpf.replace(/\D/g, ''),
      dataNascimento: funcionario.dataNascimento,
      sexo: funcionario.sexo,
      telefone: funcionario.telefone.replace(/\D/g, ''),
      email: funcionario.email,
      endereco: {
        logradouro: funcionario.logradouro,
        cep: funcionario.cep.replace(/\D/g, ''),
        cidade: funcionario.cidade,
        numero: funcionario.numero,
        estado: funcionario.estado,
        bairro: funcionario.bairro,
        complemento: funcionario.complemento
      }
    }
  }

  try {
    console.log('Dados enviados:', dadosEnvio)
    const response = await api.post('/api/Funcionario', dadosEnvio)

    if (response.status === 201) {
      Toast.fire({
        icon: 'success',
        title: `Funcionário ${funcionario.nome} cadastrado com sucesso!`,
        html: `Senha temporária: <strong>${senhaPadrao}</strong><br>O funcionário deverá trocá-la no primeiro login.`
      })
      limparFormulario()
      router.push('/funcionarios')
    }
  } catch (error) {
    console.error('Erro ao cadastrar funcionário:', error)
    Toast.fire({
      icon: 'error',
      title: 'Erro ao cadastrar funcionário',
      text: error.response?.data?.message || 'Verifique os dados e tente novamente.'
    })
  }
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

