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
                  <!-- Formulário -->
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
                          :class="{ 'is-invalid': v$.cpf.$error }"
                        />
                        <div class="invalid-feedback" v-if="v$.cpf.$error">
                          <div v-if="!v$.cpf.required">CPF é obrigatório.</div>
                          <div v-if="!v$.cpf.numeric">CPF deve conter apenas números.</div>
                          <div v-if="!v$.cpf.minLength">
                            CPF deve ter pelo menos 11 dígitos.
                          </div>
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
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                          <option value="outro">Outro</option>
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
                        <label for="nivel" class="form-label">Nível de Experiência</label>
                        <select
                          class="form-select"
                          id="nivel"
                          v-model="cliente.nivel"
                          :class="{ 'is-invalid': v$.nivel.$error }"
                        >
                          <option disabled value="">Selecione</option>
                          <option value="Novato">Novato</option>
                          <option value="Intermediario">Intermediário</option>
                          <option value="Experiente">Experiente</option>
                          <option value="Profissional">Profissional</option>
                        </select>
                        <div class="invalid-feedback" v-if="v$.nivel.$error">
                          Nível de experiência é obrigatório.
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
import { required, minLength, email, numeric } from '@vuelidate/validators';
import axios from 'axios';

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue';
import NavSideBarVue from '@/components/layout/NavSideBar.vue';
import FooterBarVue from '@/components/layout/FooterBar.vue';
import { Toast } from '@/components/common/toast';

const cliente = reactive({
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  nivel: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
});

const fotoPreview = ref<string | null>(null);

const rules = {
  nome: { required, minLength: minLength(3) },
  cpf: { required, numeric, minLength: minLength(11) },
  dataNascimento: { required },
  sexo: { required },
  email: { required, email },
  nivel: { required },
};

const v$ = useVuelidate(rules, cliente);

const router = useRouter();

function limparFormulario() {
  cliente.nome = '';
  cliente.cpf = '';
  cliente.dataNascimento = '';
  cliente.sexo = '';
  cliente.email = '';
  cliente.nivel = '';
  cliente.logradouro = '';
  cliente.numero = '';
  cliente.complemento = '';
  cliente.bairro = '';
  cliente.cidade = '';
  cliente.estado = '';
  cliente.cep = '';
  fotoPreview.value = null;
  v$.value.$reset();
}

async function cadastrarCliente() {
  const isValid = await v$.value.$validate();

  if (!isValid) {
    Toast.fire({
      icon: 'error',
      title: 'Corrija os erros no formulário antes de enviar.',
    });
    return;
  }

  const dadosEnvio = {
    id: Math.random().toString(36).substring(2, 8),
    nome: cliente.nome,
    cpf: cliente.cpf,
    dataNascimento: cliente.dataNascimento,
    sexo: cliente.sexo,
    email: cliente.email,
    nivel: cliente.nivel,
    logradouro: cliente.logradouro,
    numero: cliente.numero,
    complemento: cliente.complemento,
    bairro: cliente.bairro,
    cidade: cliente.cidade,
    estado: cliente.estado,
    cep: cliente.cep,
  };

  try {
    const response = await axios.post('http://localhost:3000/clientes', dadosEnvio, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 201) {
      Toast.fire({
        icon: 'success',
        title: `Cliente ${cliente.nome} cadastrado com sucesso!`,
      });
      limparFormulario();
      router.push('/clientes');
    }
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    Toast.fire({
      icon: 'error',
      title: 'Erro ao cadastrar cliente. Veja o console para mais detalhes.',
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