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
                        <input type="text" class="form-control" id="nome" v-model="cliente.nome" required />
                      </div>
                      <div class="col-md-4">
                        <label for="cpf" class="form-label">CPF</label>
                        <input 
                          type="text" 
                          class="form-control" 
                          id="cpf" 
                          v-model="cliente.cpf" 
                          @input="aplicarMascaraCPF"
                          maxlength="14"
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                        <input type="date" class="form-control" id="dataNascimento" v-model="cliente.dataNascimento" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="sexo" class="form-label">Sexo</label>
                        <select class="form-select" id="sexo" v-model="cliente.sexo">
                          <option selected disabled value="">Selecione</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                      <div class="col-md-4">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" v-model="cliente.email" required />
                      </div>
                      <div class="col-md-4">
                        <label for="telefone" class="form-label">Telefone</label>
                        <input 
                          type="text" 
                          class="form-control" 
                          id="telefone" 
                          v-model="cliente.telefone" 
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
                        <input type="text" class="form-control" id="logradouro" v-model="cliente.logradouro" />
                      </div>
                      <div class="col-md-2">
                        <label for="numero" class="form-label">Número</label>
                        <input type="text" class="form-control" id="numero" v-model="cliente.numero" />
                      </div>
                      <div class="col-md-4">
                        <label for="complemento" class="form-label">Complemento</label>
                        <input type="text" class="form-control" id="complemento" v-model="cliente.complemento" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-3">
                        <label for="bairro" class="form-label">Bairro</label>
                        <input type="text" class="form-control" id="bairro" v-model="cliente.bairro" />
                      </div>
                      <div class="col-md-3">
                        <label for="cidade" class="form-label">Cidade</label>
                        <input type="text" class="form-control" id="cidade" v-model="cliente.cidade" />
                      </div>
                      <div class="col-md-3">
                        <label for="estado" class="form-label">Estado</label>
                        <select class="form-select" id="estado" v-model="cliente.estado">
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
                          v-model="cliente.cep" 
                          @input="aplicarMascaraCEP"
                          maxlength="9"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        <button class="btn btn-success me-2" type="submit">Salvar</button>
                        <button class="btn btn-danger" type="button" @click="excluirCliente">Excluir</button>
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

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import { api } from '@/common/http'

const route = useRoute()
const router = useRouter()
const clienteId = route.params.id as string


const cliente = reactive({
  id: '',
  nivelExperiencia: null as number | null,
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  telefone: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: ''
})

const aplicarMascaraCPF = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length > 11) value = value.substring(0, 11)
  
  if (value.length > 9) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (value.length > 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
  } else if (value.length > 3) {
    value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2')
  }
  
  cliente.cpf = value
}

const aplicarMascaraTelefone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length > 11) value = value.substring(0, 11)
  
  if (value.length > 10) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (value.length > 6) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  } else if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2')
  } else if (value.length > 0) {
    value = value.replace(/(\d{0,2})/, '($1')
  }
  
  cliente.telefone = value
}

const aplicarMascaraCEP = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length > 8) value = value.substring(0, 8)
  
  if (value.length > 5) {
    value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2')
  }
  
  cliente.cep = value
}

const carregarCliente = async () => {
  try {
    const response = await api.get(`/api/Cliente/${clienteId}`)
    const dados = response.data

    cliente.id = dados.id
    cliente.nivelExperiencia = dados.nivelExperiencia
    cliente.nome = dados.pessoa?.nome || ''
    cliente.cpf = dados.pessoa?.cpf || ''
    cliente.dataNascimento = dados.pessoa?.dataNascimento?.substring(0, 10) || ''
    cliente.sexo = dados.pessoa?.sexo || ''
    cliente.email = dados.pessoa?.email || ''
    cliente.telefone = dados.telefone || ''
    cliente.logradouro = dados.pessoa?.endereco?.logradouro || ''
    cliente.numero = dados.pessoa?.endereco?.numero || ''
    cliente.complemento = dados.pessoa?.endereco?.complemento || ''
    cliente.bairro = dados.pessoa?.endereco?.bairro || ''
    cliente.cidade = dados.pessoa?.endereco?.cidade || ''
    cliente.estado = dados.pessoa?.endereco?.estado || ''
    cliente.cep = dados.pessoa?.endereco?.cep || ''

  } catch (error) {
    console.error('Erro ao carregar cliente:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao carregar cliente',
      text: 'Tente novamente mais tarde.',
    })
  }
}

const salvarAlteracoes = async () => {
  try {
    // 1. Primeiro verifique se a pessoa existe ou crie uma nova
    const pessoaData = {
      nome: cliente.nome,
      cpf: cliente.cpf.replace(/\D/g, ''),
      dataNascimento: cliente.dataNascimento,
      sexo: cliente.sexo,
      email: cliente.email,
      senha: 'senhaPadrao123', // Ou gere uma senha segura
      endereco: {
        logradouro: cliente.logradouro,
        cep: cliente.cep.replace(/\D/g, ''),
        cidade: cliente.cidade,
        numero: cliente.numero,
        estado: cliente.estado,
        bairro: cliente.bairro,
        complemento: cliente.complemento
      }
    };

    if (clienteId) {
      await api.put(`/api/Pessoa/${clienteId}`, pessoaData);
    } else {
      const pessoaResponse = await api.post('/api/Pessoa', pessoaData);
      clienteId = pessoaResponse.data.id;
    }

    const clienteData = {
      id: clienteId,
      nivelExperiencia: cliente.nivelExperiencia || 0,
      fk_pessoa: clienteId
    };

    await api.put(`/api/Cliente/${clienteId}`, clienteData);
    
    await Swal.fire({
      icon: 'success',
      title: 'Cliente salvo com sucesso!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });

    router.push('/clientes');
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    
    let mensagemErro = 'Erro ao salvar cliente';
    if (error.response?.data) {
      mensagemErro += `: ${JSON.stringify(error.response.data)}`;
    } else if (error.message) {
      mensagemErro += `: ${error.message}`;
    }

    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: mensagemErro,
    });
  }
};

const excluirCliente = async () => {
  const resultado = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não pode ser desfeita.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })

  if (resultado.isConfirmed) {
    try {
      await api.delete(`/api/Cliente/${clienteId}`)
      await Swal.fire({
        icon: 'success',
        title: 'Cliente excluído com sucesso!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      })
      router.push('/clientes')
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir!',
        text: 'Tente novamente mais tarde.',
      })
    }
  }
}

onMounted(() => {
  carregarCliente()
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>