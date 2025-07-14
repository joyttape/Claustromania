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
          <router-link to="/clientes" class="btn btn-outline-light mb-3">
            ← Voltar
          </router-link>
          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Cadastro de Clientes</h6>

                <div class="d-flex align-items-start gap-4">
                  <form @submit.prevent="cadastrarCliente" class="flex-grow-1" novalidate>
                    <h6 class="mb-3">Dados Pessoais</h6>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="nome" class="form-label">Nome</label>
                        <input
                          type="text"
                          class="form-control"
                          id="nome"
                          v-model="cliente.nome"
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
                        <label for="cpf" class="form-label">CPF</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cpf"
                          v-model="cliente.cpf"
                          @input="aplicarMascaraCPF"
                          :class="{ 'is-invalid': v$.cpf.$error }"
                          maxlength="14"
                          placeholder="000.000.000-00"
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
                          class="form-control"
                          id="dataNascimento"
                          v-model="cliente.dataNascimento"
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
                          class="form-select"
                          id="sexo"
                          v-model="cliente.sexo"
                          :class="{ 'is-invalid': v$.sexo.$error }"
                        >
                          <option disabled value="">Selecione</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Outro">Outro</option>
                        </select>
                        <div class="invalid-feedback" v-if="v$.sexo.$error">
                          Sexo é obrigatório.
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label for="email" class="form-label">Email</label>
                        <input
                          type="email"
                          class="form-control"
                          id="email"
                          v-model="cliente.email"
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
                          class="form-control"
                          id="telefone"
                          v-model="cliente.telefone"
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

                    <div class="col-md-12">
                      <label for="nivel" class="form-label">Nível de Experiência</label>
                      <select
                        class="form-select"
                        id="nivel"
                        v-model.number="cliente.nivel"
                        :class="{ 'is-invalid': v$.nivel.$error }"
                      >
                        <option disabled value="">Selecione</option>
                        <option :value="0">Novato</option>
                        <option :value="1">Intermediário</option>
                        <option :value="2">Experiente</option>
                        <option :value="3">Profissional</option>
                      </select>
                      <div class="invalid-feedback" v-if="v$.nivel.$error">
                        Nível de experiência é obrigatório.
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
                          v-model="cliente.logradouro"
                        />
                      </div>
                      <div class="col-md-2">
                        <label for="numero" class="form-label">Número</label>
                        <input
                          type="text"
                          class="form-control"
                          id="numero"
                          v-model="cliente.numero"
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="complemento" class="form-label">Complemento</label>
                        <input
                          type="text"
                          class="form-control"
                          id="complemento"
                          v-model="cliente.complemento"
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
                          v-model="cliente.bairro"
                        />
                      </div>
                      <div class="col-md-3">
                        <label for="cidade" class="form-label">Cidade</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cidade"
                          v-model="cliente.cidade"
                        />
                      </div>
                      <div class="col-md-3">
                        <label for="estado" class="form-label">Estado</label>
                        <select
                          class="form-select"
                          id="estado"
                          v-model="cliente.estado"
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
                          class="form-control"
                          id="cep"
                          v-model="cliente.cep"
                          @input="aplicarMascaraCEP"
                          maxlength="9"
                          placeholder="00000-000"
                        />
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

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, email } from '@vuelidate/validators';
import axios from 'axios';
import Swal from 'sweetalert2'


import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue';
import NavSideBarVue from '@/components/layout/NavSideBar.vue';
import FooterBarVue from '@/components/layout/FooterBar.vue';
import { Toast } from '@/components/common/toast';
import { api } from '@/common/http';

const cliente = reactive({
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  telefone: '',
  nivel: 0,
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  status: null,
  senha: null
});

const cpfValido = (value: string) => {
  if (!value) return true;
  const cpf = value.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = 11 - (soma % 11);
  if (resto >= 10) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = 11 - (soma % 11);
  if (resto >= 10) resto = 0;
  return resto === parseInt(cpf.charAt(10));
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
  nivel: { required },
  logradouro: { required },
  numero: { required },
  complemento: { required },
  bairro: { required },
  cidade: { required },
  estado: { required },
  cep: { required }
};

const v$ = useVuelidate(rules, cliente);
const router = useRouter();

function aplicarMascaraCPF(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  cliente.cpf = value;
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
  cliente.telefone = value;
}

function aplicarMascaraCEP(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  if (value.length <= 8) {
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  cliente.cep = value;
}

function limparFormulario() {
  cliente.nome = '';
  cliente.cpf = '';
  cliente.dataNascimento = '';
  cliente.sexo = '';
  cliente.email = '';
  cliente.telefone = '';
  cliente.nivel = 0;
  cliente.logradouro = '';
  cliente.numero = '';
  cliente.complemento = '';
  cliente.bairro = '';
  cliente.cidade = '';
  cliente.estado = '';
  cliente.cep = '';
  v$.value.$reset();
}

async function cadastrarCliente() {
  try {
    const dadosEnvio = {
  nivelExperiencia: cliente.nivel,
  pessoa: {
    nome: cliente.nome,
    cpf: cliente.cpf.replace(/\D/g, ''),
    dataNascimento: cliente.dataNascimento,
    telefone: cliente.telefone.replace(/\D/g, ''),
    sexo: cliente.sexo,
    email: cliente.email,
    senha: cliente.senha || cliente.cpf.replace(/\D/g, ''),
    status: cliente.status || 'Ativo',
    endereco: {
      logradouro: cliente.logradouro,
      numero: cliente.numero,
      complemento: cliente.complemento,
      bairro: cliente.bairro,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep.replace(/\D/g, '')
    }
  }
};


    console.log('Dados enviados:', dadosEnvio)
    await api.post('/api/Cliente', dadosEnvio);

    await Swal.fire({
      icon: 'success',
      title: 'Salvo com sucesso!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });
    
    limparFormulario();
    router.push('/clientes');

  } catch {
    await Swal.fire({
      icon: 'warning',
      title: 'Ocorreu uma dificuldade',
      text: 'Dados já existem.',
      confirmButtonColor: '#d33'
    });
  }
}

onMounted(() => {
  const script = document.createElement('script');
  script.src = '/src/components/js/maincode.js';
  script.async = true;
  document.body.appendChild(script);
});
</script>