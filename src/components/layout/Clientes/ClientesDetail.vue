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
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                          <option value="outro">Outro</option>
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
                        <select class="form-select" id="nivel" v-model="cliente.nivel">
                          <option selected disabled value="">Selecione</option>
                          <option value="Novato">Novato</option>
                          <option value="Intermediario">Intermediário</option>
                          <option value="Experiente">Experiente</option>
                          <option value="Profissional">Profissional</option>
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
import axios from 'axios'
import Swal from 'sweetalert2'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const clienteId = route.params.id as string

const cliente = reactive({
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  telefone: '',
  nivel: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
})

const fotoPreview = ref<string | null>(null)

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

function removerMascaras(dados: any) {
  return {
    ...dados,
    cpf: dados.cpf ? dados.cpf.replace(/\D/g, '') : '',
    telefone: dados.telefone ? dados.telefone.replace(/\D/g, '') : '',
    cep: dados.cep ? dados.cep.replace(/\D/g, '') : ''
  };
}

const carregarCliente = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/clientes/${clienteId}`)
    const dados = response.data

    Object.assign(cliente, {
      nome: dados.nome || dados.Nome || '',
      cpf: formatarCPF(dados.cpf || dados.CPF || ''),
      dataNascimento: dados.dataNascimento || dados.Data || '',
      sexo: dados.sexo || dados.Sexo || '',
      email: dados.email || dados.Email || '',
      telefone: formatarTelefone(dados.telefone || dados.Telefone || ''),
      nivel: dados.nivel || dados.Nivel || '',
      logradouro: dados.logradouro || dados.Logradouro || '',
      numero: dados.numero || dados.Numero || '',
      complemento: dados.complemento || dados.Complemento || '',
      bairro: dados.bairro || dados.Bairro || '',
      cidade: dados.cidade || dados.Cidade || '',
      estado: dados.estado || dados.Estado || '',
      cep: formatarCEP(dados.cep || dados.CEP || '')
    })
  } catch (error) {
    console.error('Erro ao carregar cliente:', error)
  }
}

const salvarAlteracoes = async () => {
  try {
    const dadosParaSalvar = removerMascaras(cliente);
    
    await axios.put(`http://localhost:3000/clientes/${clienteId}`, dadosParaSalvar)
    await Swal.fire({
      icon: 'success',
      title: 'Salvo com sucesso!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    })
    router.push('/clientes')
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao salvar!',
      text: 'Tente novamente mais tarde.',
    })
  }
}

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
      await axios.delete(`http://localhost:3000/clientes/${clienteId}`)
      await Swal.fire({
        icon: 'success',
        title: 'Excluído com sucesso!',
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

