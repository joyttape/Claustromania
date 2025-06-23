<template>
  <div>
    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />

      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/salas" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-4">Cadastro de Sala</h6>

                <form @submit.prevent="cadastrarSala">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Número da Sala</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="sala.Numero"
                        :class="{ 'is-invalid': v$.Numero.$error }"
                      />
                      <div class="invalid-feedback" v-if="v$.Numero.$error">
                        Campo obrigatório.
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Capacidade de Jogadores</label>
                      <input
                        type="number"
                        class="form-control"
                        v-model.number="sala.Jogadores"
                        :class="{ 'is-invalid': v$.Jogadores.$error }"
                      />
                      <div class="invalid-feedback" v-if="v$.Jogadores.$error">
                        Deve ser um número maior que 0.
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Status</label>
                    <select class="form-select" v-model="sala.Status">
                      <option :value="true">Ativo</option>
                      <option :value="false">Inativo</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Jogos Associados</label>
                    <select
                      class="form-select"
                      multiple
                      v-model="sala.JogosSelecionados"
                      :class="{ 'is-invalid': v$.JogosSelecionados.$error }"
                    >
                      <option
                        v-for="jogo in listaJogos"
                        :key="jogo.id"
                        :value="jogo"
                      >
                        {{ jogo.NomeJogo }}
                      </option>
                    </select>
                    <div class="invalid-feedback" v-if="v$.JogosSelecionados.$error">
                      Selecione ao menos um jogo.
                    </div>
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

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, minValue } from '@vuelidate/validators'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Toast } from '@/components/common/toast'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

// Estado da sala
const sala = reactive({
  Numero: '',
  Jogadores: null as number | null,
  Status: true,
  JogosSelecionados: [] as Array<{ id: number; NomeJogo: string }>
})

// Lista de jogos
const listaJogos = ref<{ id: number; NomeJogo: string }[]>([])

// Regras de validação
const rules = {
  Numero: { required, minLength: minLength(1) },
  Jogadores: { required, minValue: minValue(1) },
  JogosSelecionados: { required }
}

const v$ = useVuelidate(rules, sala)

const router = useRouter()

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/jogos', {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      listaJogos.value = response.data.map((jogo: any) => ({
        id: jogo.id,
        NomeJogo: jogo.NomeJogo
      }))
    }
  } catch (error) {
    console.error('Erro ao buscar jogos:', error)
    Swal.fire('Erro', 'Não foi possível carregar os jogos.', 'error')
  }
})

const cadastrarSala = async () => {
  const valid = await v$.value.$validate()

  if (!valid) {
  Toast.fire({
    icon: 'error',
    title: 'Corrija os erros no formulário antes de enviar.',
  })
  return
}

  const dadosParaSalvar = {
    id: Math.floor(Math.random() * 100000),
    Numero: sala.Numero,
    Jogadores: sala.Jogadores,
    Status: sala.Status,
    Jogos: sala.JogosSelecionados
  }

  try {
    const response = await axios.post('http://localhost:3000/salas', dadosParaSalvar, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status === 201) {
      Toast.fire({
        icon: 'success',
        title: `Sala ${sala.Numero} cadastrada com sucesso!`,
      })

      limparFormulario()
      router.push('/salas')
    }
  } catch (error) {
    console.error('Erro ao cadastrar sala:', error)
    Swal.fire('Erro', 'Erro ao cadastrar sala.', 'error')
  }
}

const limparFormulario = () => {
  sala.Numero = ''
  sala.Jogadores = null
  sala.Status = true
  sala.JogosSelecionados = []
  v$.value.$reset()
}
</script>
