<template>
  <div>
    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />

      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/jogos" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Cadastro de Jogo</h6>

                <form @submit.prevent="cadastrarJogo" novalidate>
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="nomeJogo" class="form-label">Nome do Jogo</label>
                      <input
                        type="text"
                        id="nomeJogo"
                        class="form-control"
                        v-model="jogo.nome"
                        :class="{ 'is-invalid': v$.nome.$error }"
                        required
                      />
                      <div class="invalid-feedback" v-if="v$.nome.$error">
                        <div v-if="!v$.nome.required">Nome é obrigatório.</div>
                        <div v-if="!v$.nome.minLength">Mínimo de 3 caracteres.</div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label for="duracao" class="form-label">Duração</label>
                      <input
                        type="text"
                        id="duracao"
                        class="form-control"
                        v-model="jogo.duracao"
                        :class="{ 'is-invalid': v$.duracao.$error }"
                        placeholder="Ex: 60 minutos"
                        required
                      />
                      <div class="invalid-feedback" v-if="v$.duracao.$error">Duração é obrigatória.</div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="dificuldade" class="form-label">Dificuldade</label>
                      <select
                        id="dificuldade"
                        class="form-select"
                        v-model="jogo.dificuldade"
                        :class="{ 'is-invalid': v$.dificuldade.$error }"
                        required
                      >
                        <option disabled value="">Selecione</option>
                        <option value="Fácil">Fácil</option>
                        <option value="Médio">Médio</option>
                        <option value="Difícil">Difícil</option>
                      </select>
                      <div class="invalid-feedback" v-if="v$.dificuldade.$error">Dificuldade é obrigatória.</div>
                    </div>

                    <div class="col-md-6">
                      <label for="preco" class="form-label">Preço</label>
                      <input
                        id="preco"
                        type="text"
                        inputmode="numeric"
                        class="form-control"
                        v-model="precoFormatado"
                        :class="{ 'is-invalid': v$.preco.$error }"
                        required
                      />
                      <div class="invalid-feedback" v-if="v$.preco.$error">
                        Preço é obrigatório e deve ser um número.
                      </div>
                  </div>

                  </div>

                  <div class="mb-3">
                    <label for="descricao" class="form-label">Descrição</label>
                    <textarea
                      id="descricao"
                      class="form-control"
                      rows="4"
                      v-model="jogo.descricao"
                      :class="{ 'is-invalid': v$.descricao.$error }"
                      required
                    ></textarea>
                    <div class="invalid-feedback" v-if="v$.descricao.$error">Descrição é obrigatória.</div>
                  </div>

                  <button type="submit" class="btn btn-primary">Salvar</button>
                </form>
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
import { reactive, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import axios from 'axios'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import { Toast } from '@/components/common/toast'

const router = useRouter()

const jogo = reactive({
  nome: '',
  descricao: '',
  duracao: '',
  dificuldade: '',
  preco: null as number | null,
})

const precoFormatado = ref('')

const rules = {
  nome: { required, minLength: minLength(3) },
  descricao: { required },
  duracao: { required },
  dificuldade: { required },
  preco: { required },
}

const v$ = useVuelidate(rules, jogo)

watch(precoFormatado, (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '')
  const convertido = parseFloat((parseInt(apenasNumeros || '0') / 100).toFixed(2))
  jogo.preco = convertido
})

watch(() => jogo.preco, (valor) => {
  if (valor !== null) {
    precoFormatado.value = valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  } else {
    precoFormatado.value = ''
  }
})

async function cadastrarJogo() {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    Toast.fire({ icon: 'error', title: 'Corrija os erros antes de enviar.' })
    return
  }

  const dadosEnvio = {
    Id: Math.random().toString(36).substring(2, 8),
    NomeJogo: jogo.nome,
    Descricao: jogo.descricao,
    Duracao: jogo.duracao,
    Dificuldade: jogo.dificuldade,
    Preco: jogo.preco
  }

  try {
    const response = await axios.post('http://10.210.8.51:3000/jogos', dadosEnvio)
    if (response.status === 201) {
      Toast.fire({ icon: 'success', title: `Jogo "${jogo.nome}" cadastrado!` })
      limparFormulario()
      router.push('/jogos')
    }
  } catch (error) {
    console.error(error)
    Toast.fire({ icon: 'error', title: 'Erro ao cadastrar jogo.' })
  }
}

function limparFormulario() {
  Object.assign(jogo, {
    nome: '',
    descricao: '',
    duracao: '',
    dificuldade: '',
    preco: null
  })
  precoFormatado.value = ''
  v$.value.$reset()
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
