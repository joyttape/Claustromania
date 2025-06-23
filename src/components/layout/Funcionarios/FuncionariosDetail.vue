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
                <h6 class="mb-4">Detalhes Funcionário</h6>

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
                          :class="{ 'is-invalid': $v.funcionario.cpf.$error }"
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
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="salario" class="form-label">Salário</label>
                        <input
                          type="number"
                          id="salario"
                          step="0.01"
                          class="form-control"
                          v-model.number="funcionario.salario"
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
                    </div>

                    <div class="row mb-3">
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

                  <div
                    class="position-relative"
                    style="width: 100px; height: 100px; margin-left: 20px; margin-top: -10px;"
                  >
                    <label
                      for="foto"
                      class="d-flex align-items-center justify-content-center bg-dark text-white rounded border border-light w-100 h-100"
                      style="cursor: pointer; overflow: hidden; border-radius: 12px;"
                    >
                      <template v-if="fotoPreview">
                        <img
                          :src="fotoPreview"
                          alt="Preview"
                          class="w-100 h-100"
                          style="object-fit: cover; border-radius: 12px;"
                        />
                      </template>
                      <template v-else>
                        <i class="fa fa-camera" style="font-size: 1.5rem;"></i>
                      </template>
                    </label>
                    <input
                      type="file"
                      id="foto"
                      class="d-none"
                      accept="image/*"
                      @change="onFileChange"
                    />
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

// Vuelidate
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
  cargo: '',
  salario: 0,
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
  foto: null as File | null,
})

const fotoPreview = ref<string | null>(null)
const loading = ref(true)

// CPF simples: só números e tamanho 11
const cpfValido = helpers.withMessage(
  'CPF inválido',
  (value: string) => {
    if (!value) return true // opcional
    const cpfLimpo = value.replace(/\D/g, '')
    return cpfLimpo.length === 11
  }
)

// Validação das regras
const rules = {
  funcionario: {
    nome: { required, minLength: minLength(3) },
    cpf: { cpfValido },
    dataNascimento: { required },
    sexo: { required },
    email: { required, email },
    cargo: { required },
    turno: { required },
    status: { required },
  },
}

const $v = useVuelidate(rules, { funcionario })

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    funcionario.foto = file
    fotoPreview.value = URL.createObjectURL(file)
  }
}

const carregarFuncionario = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:3000/funcionarios/${funcionarioId}`)
    const dados = response.data

    // Preenchendo campo a campo
    funcionario.nome = dados.nome || ''
    funcionario.cpf = dados.cpf || ''
    funcionario.dataNascimento = dados.dataNascimento || ''
    funcionario.sexo = dados.sexo || ''
    funcionario.email = dados.email || ''
    funcionario.cargo = dados.cargo || ''
    funcionario.salario = dados.salario || 0
    funcionario.dataContratacao = dados.dataContratacao || ''
    funcionario.turno = dados.turno || ''
    funcionario.status = typeof dados.status === 'boolean' ? dados.status : null

    funcionario.logradouro = dados.logradouro || ''
    funcionario.numero = dados.numero || ''
    funcionario.complemento = dados.complemento || ''
    funcionario.bairro = dados.bairro || ''
    funcionario.cidade = dados.cidade || ''
    funcionario.estado = dados.estado || ''
    funcionario.cep = dados.cep || ''

    if (dados.foto) {
      fotoPreview.value = dados.foto
    }
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
    // Se precisar enviar foto como multipart/form-data, adapte aqui
    await axios.put(`http://localhost:3000/funcionarios/${funcionarioId}`, funcionario)
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
