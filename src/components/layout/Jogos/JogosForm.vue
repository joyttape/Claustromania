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
                        <div v-if="v$.nome.required">Nome é obrigatório.</div>
                        <div v-if="v$.nome.minLength">Mínimo de 3 caracteres.</div>
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
                        <option :value="0">Fácil</option>
                        <option :value="1">Médio</option>
                        <option :value="2">Difícil</option>
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
                        @input="aplicarMascaraDinheiro"
                        :class="{ 'is-invalid': v$.preco.$error }"
                        placeholder="R$ 0,00"
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
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import { Toast } from '@/components/common/toast'
import { api } from '@/common/http'

const router = useRouter()

const jogo = reactive({
  nome: '',
  descricao: '',
  duracao: '',
  dificuldade: null as number | null,
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

const formatarDinheiro = (valor: string) => {
  let v = valor.replace(/\D/g, '')
  
  if (v.length === 0) return ''
  
  const numero = parseInt(v)
  
  const reais = numero / 100
  
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const aplicarMascaraDinheiro = () => {
  const valorFormatado = formatarDinheiro(precoFormatado.value)
  precoFormatado.value = valorFormatado
  
  const apenasNumeros = precoFormatado.value.replace(/\D/g, '')
  if (apenasNumeros) {
    jogo.preco = parseFloat((parseInt(apenasNumeros) / 100).toFixed(2))
  } else {
    jogo.preco = null
  }
}

const formatarPrecoCarregado = (preco: number) => {
  if (preco === null || preco === undefined) return ''
  
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

async function cadastrarJogo() {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    Toast.fire({ icon: 'error', title: 'Corrija os erros antes de enviar.' })
    return
  }

const dadosEnvio = {
  nome: jogo.nome,
  descricao: jogo.descricao,
  duracao: jogo.duracao,
  dificuldade: jogo.dificuldade,
  preco: jogo.preco
}


  try {
    const response = await api.post('/api/Jogo', dadosEnvio)
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


