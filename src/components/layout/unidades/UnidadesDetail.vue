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
          <router-link to="/unidades" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <div class="d-flex align-items-start gap-4">
                  <form @submit.prevent="salvarAlteracoes" class="flex-grow-1" novalidate>
                    <h6 class="mb-3">Dados da Unidade</h6>
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
                          <div v-if="!v$.nome.minLength">Nome deve ter no mínimo 3 caracteres.</div>
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
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.cnpj.$error">
                          <div v-if="!v$.cnpj.required">CNPJ é obrigatório.</div>
                          <div v-if="!v$.cnpj.cnpjValido">CNPJ inválido.</div>
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
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.telefone.$error">
                          Telefone é obrigatório.
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
                          type="number" 
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
                          placeholder="Ex: Segunda a Sexta, 9h às 18h / Sábado 10h às 14h"
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
                          @input="aplicarMascaraCep"
                          :class="{ 'is-invalid': v$.cep.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.cep.$error">
                          <div v-if="!v$.cep.required">CEP é obrigatório.</div>
                          <div v-if="!v$.cep.minLength">CEP deve ter 8 dígitos.</div>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        <button class="btn btn-success me-2" type="submit">Salvar</button>
                        <button class="btn btn-danger" type="button" @click="excluirUnidade">Excluir</button>
                      </div>
                    </div>
                  </form>

                  <!-- Foto -->
                  <div class="position-relative" style="width: 100px; height: 100px; margin-left: 20px;">
                    <label for="foto" class="d-flex align-items-center justify-content-center bg-dark text-white rounded border border-light w-100 h-100" style="cursor: pointer; border-radius: 12px;">
                      <template v-if="fotoPreview">
                        <img :src="fotoPreview" alt="Preview" class="w-100 h-100" style="object-fit: cover; border-radius: 12px;" />
                      </template>
                      <template v-else>
                        <i class="fa fa-camera" style="font-size: 1.5rem;"></i>
                      </template>
                    </label>
                    <input type="file" id="foto" class="d-none" accept="image/*" @change="onFileChange" />
                  </div>
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
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, numeric } from '@vuelidate/validators'
import axios from 'axios'
import Swal from 'sweetalert2'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const unidadeId = route.params.id as string

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
  foto: null as File | null
})

const fotoPreview = ref<string | null>(null)

const rules = {
  nome: { 
    required, 
    minLength: minLength(3) 
  },
  cnpj: { 
    required, 
    cnpjValido: (value: string) => {
      if (!value) return true;
      const cnpjLimpo = value.replace(/\D/g, '');
      return cnpjLimpo.length === 14;
    }
  },
  telefone: { 
    required,
    minLength: minLength(14) // (00) 0000-0000 ou (00) 00000-0000
  },
  diasFuncionamento: { 
    required,
    minLength: minLength(3)
  },
  horarioAbertura: { required },
  horarioFechamento: { 
    required,
    horarioValido: (value: string) => {
      if (!unidade.horarioAbertura || !value) return true;
      return unidade.horarioAbertura < value;
    }
  },
  logradouro: { required },
  numero: { required },
  bairro: { required },
  cidade: { required },
  estado: { required },
  cep: { 
    required,
    minLength: minLength(9) // 00000-000
  },
  capacidade: {
    numeric
  }
}

const v$ = useVuelidate(rules, unidade)

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    unidade.foto = file
    fotoPreview.value = URL.createObjectURL(file)
  }
}

const aplicarMascaraTelefone = () => {
  let v = unidade.telefone.replace(/\D/g, '')
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
  }
  unidade.telefone = v
}

const aplicarMascaraCep = () => {
  let v = unidade.cep.replace(/\D/g, '')
  v = v.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2')
  unidade.cep = v
}

const aplicarMascaraCNPJ = () => {
  let v = unidade.cnpj.replace(/\D/g, '')
  v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, '$1.$2.$3/$4-$5')
  unidade.cnpj = v
}

const carregarUnidade = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/unidades/${unidadeId}`)
    const dados = response.data

    Object.assign(unidade, {
      nome: dados.nome || '',
      cnpj: dados.cnpj || '',
      telefone: dados.telefone || '',
      status: dados.status || false,
      capacidade: dados.capacidade || '',
      diasFuncionamento: dados.diasFuncionamento || '',
      horarioAbertura: dados.horarioAbertura || '',
      horarioFechamento: dados.horarioFechamento || '',
      logradouro: dados.logradouro || dados.endereco?.logradouro || '',
      numero: dados.numero || dados.endereco?.numero || '',
      complemento: dados.complemento || dados.endereco?.complemento || '',
      bairro: dados.bairro || dados.endereco?.bairro || '',
      cidade: dados.cidade || dados.endereco?.cidade || '',
      estado: dados.estado || dados.endereco?.estado || '',
      cep: dados.cep || dados.endereco?.cep || ''
    })

    // Aplicar máscaras após carregar os dados
    if (unidade.cnpj) aplicarMascaraCNPJ()
    if (unidade.telefone) aplicarMascaraTelefone()
    if (unidade.cep) aplicarMascaraCep()
  } catch (error) {
    console.error('Erro ao carregar unidade:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao carregar unidade!',
      text: 'Tente novamente mais tarde.',
    })
  }
}

const salvarAlteracoes = async () => {
  const isValid = await v$.value.$validate()

  if (!isValid) {
    Swal.fire({
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
    status: unidade.status,
    capacidade: unidade.capacidade || 0,
    diasFuncionamento: unidade.diasFuncionamento,
    horarioAbertura: unidade.horarioAbertura,
    horarioFechamento: unidade.horarioFechamento,
    endereco: {
      logradouro: unidade.logradouro,
      numero: unidade.numero,
      complemento: unidade.complemento || '',
      bairro: unidade.bairro,
      cidade: unidade.cidade,
      estado: unidade.estado,
      cep: cepLimpo
    },
    foto: unidade.foto ? 'tem-foto' : null
  }

  try {
    await axios.put(`http://localhost:3000/unidades/${unidadeId}`, dadosEnvio)
    await Swal.fire({
      icon: 'success',
      title: 'Salvo com sucesso!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    })
    router.push('/unidades')
  } catch (error) {
    console.error('Erro ao salvar unidade:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao salvar!',
      text: 'Tente novamente mais tarde.',
    })
  }
}

const excluirUnidade = async () => {
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
      await axios.delete(`http://localhost:3000/unidades/${unidadeId}`)
      await Swal.fire({
        icon: 'success',
        title: 'Excluído com sucesso!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      })
      router.push('/unidades')
    } catch (error) {
      console.error('Erro ao excluir unidade:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir!',
        text: 'Tente novamente mais tarde.',
      })
    }
  }
}

onMounted(() => {
  carregarUnidade()
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>