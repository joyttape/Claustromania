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
                          :class="{ 'is-invalid': v$.cpf.$error }"
                          required
                        />
                        <div class="invalid-feedback" v-if="v$.cpf.$error">
                          <div v-if="!v$.cpf.required">CPF é obrigatório.</div>
                          <div v-if="!v$.cpf.numeric">CPF deve conter apenas números.</div>
                          <div v-if="!v$.cpf.minLength">CPF deve ter pelo menos 11 dígitos.</div>
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
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                          <option value="outro">Outro</option>
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
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="salario" class="form-label">Salário</label>
                        <input
                          type="number"
                          step="0.01"
                          id="salario"
                          class="form-control"
                          v-model="funcionario.salario"
                          :class="{ 'is-invalid': v$.salario.$error }"
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
                          <option value="manha">Manhã</option>
                          <option value="tarde">Tarde</option>
                          <option value="noite">Noite</option>
                          <option value="integral">Integral</option>
                        </select>
                        <div class="invalid-feedback" v-if="v$.turno.$error">Turno é obrigatório.</div>
                      </div>
                    </div>

                    <div class="row mb-3">
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
                        />
                      </div>
                    </div>

                    <button type="submit" class="btn btn-primary">Salvar</button>
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

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email, numeric } from '@vuelidate/validators'
import axios from 'axios'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import { Toast } from '@/components/common/toast'

// Estado reativo dos dados do funcionário
const funcionario = reactive({
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  cargo: '',
  salario: null as number | null,
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

// Preview da foto
const fotoPreview = ref<string | null>(null)

// Regras de validação
const rules = {
  nome: { required, minLength: minLength(3) },
  cpf: { required, numeric, minLength: minLength(11) },
  dataNascimento: { required },
  sexo: { required },
  email: { required, email },
  cargo: { required },
  salario: { required },
  dataContratacao: { required },
  turno: { required },
  status: { required },
}

const v$ = useVuelidate(rules, funcionario)

const router = useRouter()

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    funcionario.foto = target.files[0]
    fotoPreview.value = URL.createObjectURL(funcionario.foto)
  }
}

function limparFormulario() {
  funcionario.nome = ''
  funcionario.cpf = ''
  funcionario.dataNascimento = ''
  funcionario.sexo = ''
  funcionario.email = ''
  funcionario.cargo = ''
  funcionario.salario = null
  funcionario.dataContratacao = ''
  funcionario.turno = ''
  funcionario.status = null

  funcionario.logradouro = ''
  funcionario.numero = ''
  funcionario.complemento = ''
  funcionario.bairro = ''
  funcionario.cidade = ''
  funcionario.estado = ''
  funcionario.cep = ''

  funcionario.foto = null
  fotoPreview.value = null
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

  const dadosEnvio = {
    id: Math.random().toString(36).substring(2, 8),
    nome: funcionario.nome,
    cpf: funcionario.cpf,
    dataNascimento: funcionario.dataNascimento,
    sexo: funcionario.sexo,
    email: funcionario.email,
    cargo: funcionario.cargo,
    salario: funcionario.salario,
    dataContratacao: funcionario.dataContratacao,
    turno: funcionario.turno,
    status: funcionario.status,

    logradouro: funcionario.logradouro,
    numero: funcionario.numero,
    complemento: funcionario.complemento,
    bairro: funcionario.bairro,
    cidade: funcionario.cidade,
    estado: funcionario.estado,
    cep: funcionario.cep,
  }

  try {
    const response = await axios.post('http://localhost:3000/funcionarios', dadosEnvio, {
      headers: { 'Content-Type': 'application/json' },
    })

    if (response.status === 201) {
      Toast.fire({
        icon: 'success',
        title: `Funcionário ${funcionario.nome} cadastrado com sucesso!`,
      })
      limparFormulario()
      router.push('/funcionarios')
    }
  } catch (error) {
    console.error('Erro ao cadastrar funcionário:', error)
    Toast.fire({
      icon: 'error',
      title: 'Erro ao cadastrar funcionário. Veja o console para mais detalhes.',
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
