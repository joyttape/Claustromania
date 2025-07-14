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
          <router-link to="/clientes" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <div class="d-flex align-items-start gap-4">
                  <form @submit.prevent="salvarAlteracoes" class="flex-grow-1">
                    <h6 class="mb-3">Dados Pessoais</h6>
                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="nome" class="form-label">Nome</label>
                        <input type="text" class="form-control" id="nome" v-model="cliente.pessoa.nome" required />
                      </div>
                      <div class="col-md-4">
                        <label for="cpf" class="form-label">CPF</label>
                        <input 
                          type="text" 
                          class="form-control" 
                          id="cpf" 
                          v-model="cliente.pessoa.cpf" 
                          @input="aplicarMascaraCPF"
                          maxlength="14"
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                        <input type="date" class="form-control" id="dataNascimento" v-model="cliente.pessoa.dataNascimento" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="sexo" class="form-label">Sexo</label>
                        <select class="form-select" id="sexo" v-model="cliente.pessoa.sexo">
                          <option selected disabled value="">Selecione</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                      <div class="col-md-4">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" v-model="cliente.pessoa.email" required />
                      </div>
                      <div class="col-md-4">
                        <label for="telefone" class="form-label">Telefone</label>
                        <input 
                          type="text" 
                          class="form-control" 
                          id="telefone" 
                          v-model="cliente.pessoa.telefone" 
                          @input="aplicarMascaraTelefone"
                          maxlength="15"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-12">
                        <label for="nivel" class="form-label">Nível de Experiência</label>
                        <select class="form-select" id="nivel" v-model.number="cliente.nivelExperiencia">
                            <option disabled value="">Selecione</option>
                            <option :value="0">Novato</option>
                            <option :value="1">Intermediário</option>
                            <option :value="2">Experiente</option>
                            <option :value="3">Profissional</option>
                          </select>
                      </div>
                    </div>

                    <h6 class="mb-3 mt-4">Endereço</h6>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="logradouro" class="form-label">Logradouro</label>
                        <input type="text" class="form-control" id="logradouro" v-model="cliente.pessoa.endereco.logradouro" />
                      </div>
                      <div class="col-md-2">
                        <label for="numero" class="form-label">Número</label>
                        <input type="text" class="form-control" id="numero" v-model="cliente.pessoa.endereco.numero" />
                      </div>
                      <div class="col-md-4">
                        <label for="complemento" class="form-label">Complemento</label>
                        <input type="text" class="form-control" id="complemento" v-model="cliente.pessoa.endereco.complemento" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-3">
                        <label for="bairro" class="form-label">Bairro</label>
                        <input type="text" class="form-control" id="bairro" v-model="cliente.pessoa.endereco.bairro" />
                      </div>
                      <div class="col-md-3">
                        <label for="cidade" class="form-label">Cidade</label>
                        <input type="text" class="form-control" id="cidade" v-model="cliente.pessoa.endereco.cidade" />
                      </div>
                      <div class="col-md-3">
                        <label for="estado" class="form-label">Estado</label>
                        <select class="form-select" id="estado" v-model="cliente.pessoa.endereco.estado">
                          <option selected disabled value="">Selecione</option>
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
                          v-model="cliente.pessoa.endereco.cep" 
                          @input="aplicarMascaraCEP"
                          maxlength="9"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        <button class="btn btn-success me-2" type="submit">Salvar</button>
                        <button class="btn btn-danger" type="button" @click="deletarCliente">Excluir</button>
                      </div>
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

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, email } from '@vuelidate/validators';
import Swal from 'sweetalert2';

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue';
import NavSideBarVue from '@/components/layout/NavSideBar.vue';
import FooterBarVue from '@/components/layout/FooterBar.vue';
import { api } from '@/common/http';

const router = useRouter();
const route = useRoute();

const cliente = reactive({
  id: '',
  nivelExperiencia: 0,
  pessoa: {
    id: '',
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    senha: '',
    status: 'Ativo',
    endereco: {
      id: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  }
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
  pessoa: {
    nome: { required, minLength: minLength(3) },
    cpf: { required, cpfValido },
    dataNascimento: { required },
    sexo: { required },
    email: { required, email },
    telefone: { required, telefoneValido },
    endereco: {
      logradouro: { required },
      numero: { required },
      complemento: { required },
      bairro: { required },
      cidade: { required },
      estado: { required },
      cep: { required }
    }
  },
  nivelExperiencia: { required }
};

const v$ = useVuelidate(rules, cliente);

function aplicarMascaraCPF(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  cliente.pessoa.cpf = value;
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
  cliente.pessoa.telefone = value;
}

function aplicarMascaraCEP(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  if (value.length <= 8) {
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  cliente.pessoa.endereco.cep = value;
}

function limparFormulario() {
  cliente.id = '';
  cliente.nivelExperiencia = 0;
  cliente.pessoa.id = '';
  cliente.pessoa.nome = '';
  cliente.pessoa.cpf = '';
  cliente.pessoa.dataNascimento = '';
  cliente.pessoa.sexo = '';
  cliente.pessoa.email = '';
  cliente.pessoa.telefone = '';
  cliente.pessoa.senha = '';
  cliente.pessoa.status = 'Ativo';
  cliente.pessoa.endereco.id = '';
  cliente.pessoa.endereco.logradouro = '';
  cliente.pessoa.endereco.numero = '';
  cliente.pessoa.endereco.complemento = '';
  cliente.pessoa.endereco.bairro = '';
  cliente.pessoa.endereco.cidade = '';
  cliente.pessoa.endereco.estado = '';
  cliente.pessoa.endereco.cep = '';
  v$.value.$reset();
}

async function carregarCliente(id: string) {
  try {
    const { data } = await api.get(`/api/Cliente/${id}`);
    
    cliente.id = data.id;
    cliente.nivelExperiencia = data.nivelExperiencia;
    cliente.pessoa.id = data.pessoa.id;
    cliente.pessoa.nome = data.pessoa.nome;
    
    cliente.pessoa.dataNascimento = formatarDataNascimento(data.pessoa.dataNascimento);
    
    cliente.pessoa.sexo = data.pessoa.sexo;
    cliente.pessoa.email = data.pessoa.email;
    
    cliente.pessoa.cpf = formatarCPF(data.pessoa.cpf);
    
    cliente.pessoa.telefone = formatarTelefone(data.pessoa.telefone);
    
    cliente.pessoa.endereco.cep = formatarCEP(data.pessoa.endereco.cep);

    cliente.pessoa.endereco.id = data.pessoa.endereco.id;
    cliente.pessoa.endereco.logradouro = data.pessoa.endereco.logradouro;
    cliente.pessoa.endereco.numero = data.pessoa.endereco.numero;
    cliente.pessoa.endereco.complemento = data.pessoa.endereco.complemento;
    cliente.pessoa.endereco.bairro = data.pessoa.endereco.bairro;
    cliente.pessoa.endereco.cidade = data.pessoa.endereco.cidade;
    cliente.pessoa.endereco.estado = data.pessoa.endereco.estado;

  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Erro ao carregar cliente',
      text: 'Não foi possível carregar os dados do cliente.',
      confirmButtonColor: '#d33'
    });
    router.push('/clientes');
  }
}

function formatarDataNascimento(data: string) {
  if (!data) return '';
  return data.split('T')[0];
}

function formatarCPF(cpf: string) {
  if (!cpf) return '';
  cpf = cpf.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone: string) {
  if (!telefone) return '';
  telefone = telefone.replace(/\D/g, '');
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

function formatarCEP(cep: string) {
  if (!cep) return '';
  cep = cep.replace(/\D/g, '');
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}


async function salvarAlteracoes() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    await Swal.fire({
      icon: 'warning',
      title: 'Formulário inválido',
      text: 'Por favor, corrija os erros antes de salvar.',
      confirmButtonColor: '#d33'
    });
    return;
  }
  try {
    const dadosEnvio = {
      id: cliente.id,
      nivelExperiencia: cliente.nivelExperiencia,
      pessoa: {
        id: cliente.pessoa.id,
        nome: cliente.pessoa.nome,
        cpf: cliente.pessoa.cpf.replace(/\D/g, ''),
        dataNascimento: cliente.pessoa.dataNascimento,
        sexo: cliente.pessoa.sexo,
        email: cliente.pessoa.email,
        telefone: cliente.pessoa.telefone.replace(/\D/g, ''),
        senha: cliente.pessoa.senha || cliente.pessoa.cpf.replace(/\D/g, ''),
        status: cliente.pessoa.status || 'Ativo',
        endereco: {
          id: cliente.pessoa.endereco.id,
          logradouro: cliente.pessoa.endereco.logradouro,
          numero: cliente.pessoa.endereco.numero,
          complemento: cliente.pessoa.endereco.complemento,
          bairro: cliente.pessoa.endereco.bairro,
          cidade: cliente.pessoa.endereco.cidade,
          estado: cliente.pessoa.endereco.estado,
          cep: cliente.pessoa.endereco.cep.replace(/\D/g, '')
        }
      }
    };
    if (cliente.id) {
      await api.put(`/api/Cliente/${cliente.id}`, dadosEnvio);
      await Swal.fire({
        icon: 'success',
        title: 'Cliente atualizado com sucesso!',
        confirmButtonColor: '#3085d6'
      });
    } else {
      await api.post('/api/Cliente', dadosEnvio);
      await Swal.fire({
        icon: 'success',
        title: 'Cliente criado com sucesso!',
        confirmButtonColor: '#3085d6'
      });
      limparFormulario();
    }
    router.push('/clientes');
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Erro ao salvar cliente',
      text: error.response?.data?.message || 'Ocorreu um erro inesperado.',
      confirmButtonColor: '#d33'
    });
  }
}

async function deletarCliente() {
  const result = await Swal.fire({
    title: 'Tem certeza?',
    text: "Você não poderá reverter isso!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, deletar!'
  });

  if (result.isConfirmed) {
    try {
      const response = await api.delete(`/api/Cliente/${cliente.id}`);
      
      if (response.status === 204) {
        await Swal.fire(
          'Deletado!',
          'O cliente foi removido com sucesso.',
          'success'
        );
        router.push('/clientes');
      } else {
        throw new Error('Resposta inesperada do servidor');
      }
    } catch (error) {
      await Swal.fire(
        'Erro!',
        error.response?.data?.message || 'Erro ao deletar cliente',
        'error'
      );
    }
  }
}

onMounted(() => {
  const id = route.params.id as string;
  if (id) {
    carregarCliente(id);

  const script = document.createElement('script');
  script.src = '/src/components/js/maincode.js';
  script.async = true;
  document.body.appendChild(script);
  }
});
</script>


