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

                <form @submit.prevent="salvarAlteracoes">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="nomeJogo" class="form-label">Nome do Jogo</label>
                      <input
                        type="text"
                        class="form-control"
                        id="nomeJogo"
                        v-model="jogo.NomeJogo"
                        required
                      />
                    </div>

                    <div class="col-md-6">
                      <label for="duracao" class="form-label">Duração</label>
                      <input
                        type="text"
                        class="form-control"
                        id="duracao"
                        placeholder="Ex: 60 minutos"
                        v-model="jogo.Duracao"
                        required
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="dificuldade" class="form-label">Dificuldade</label>
                      <select class="form-select" id="dificuldade" v-model="jogo.Dificuldade" required>
                        <option selected disabled value="">Selecione</option>
                        <option value="Fácil">Fácil</option>
                        <option value="Médio">Médio</option>
                        <option value="Difícil">Difícil</option>
                      </select>
                    </div>

                    <div class="col-md-6">
                      <label for="preco" class="form-label">Preço</label>
                      <input
                        type="text"
                        class="form-control"
                        id="preco"
                        v-model="jogo.Preco"
                        @input="formatarPreco"
                        @keypress="bloquearLetras"
                        placeholder="R$ 0,00"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="descricao" class="form-label">Descrição</label>
                    <textarea
                      class="form-control"
                      id="descricao"
                      rows="4"
                      v-model="jogo.Descricao"
                      required
                    ></textarea>
                  </div>

                </form>

                <div class="d-flex justify-content-start">
                    <button type="submit" class="btn btn-success me-2" @click="salvarAlteracoes">Salvar</button>
                    <button type="button" class="btn btn-danger" @click="cancelarAlteracoes">Excluir</button>
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

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const jogoId = route.params.id as string

const jogo = reactive({
  id: 0,
  NomeJogo: '',
  Descricao: '',
  Duracao: '',
  Dificuldade: '',
  Preco: ''
})

const loading = ref(true)

const formatarPreco = (event: Event) => {
  const target = event.target as HTMLInputElement
  let valor = target.value.replace(/\D/g, '')

  valor = (parseInt(valor, 10) / 100).toFixed(2)
  valor = valor.replace('.', ',')
  jogo.Preco = `R$ ${valor}`
}

const bloquearLetras = (event: KeyboardEvent) => {
  const tecla = event.key
  if (!/[\d.,]/.test(tecla)) {
    event.preventDefault()
  }
}

const carregarJogo = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:3000/jogos/${jogoId}`)
    const dados = response.data

    jogo.id = dados.id
    jogo.NomeJogo = dados.NomeJogo || ''
    jogo.Descricao = dados.Descricao || ''
    jogo.Duracao = dados.Duracao || ''
    jogo.Dificuldade = dados.Dificuldade || ''
    jogo.Preco = dados.Preco || ''
  } catch (error) {
    console.error('Erro ao carregar jogo:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao carregar jogo',
      text: 'Tente novamente mais tarde.',
    })
  } finally {
    loading.value = false
  }
}

const salvarAlteracoes = async () => {
  try {
    await axios.put(`http://10.210.8.51:3000/jogos/${jogoId}`, jogo)
    await Swal.fire({
      icon: 'success',
      title: 'Jogo salvo com sucesso!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    })
    router.push('/jogos')
  } catch (error) {
    console.error('Erro ao salvar jogo:', error)
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
      await axios.delete(`http://localhost:3000/jogos/${jogoId}`)
      await Swal.fire({
        icon: 'success',
        title: 'Jogo excluído com sucesso!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      })
      router.push('/jogos')
    } catch (error) {
      console.error('Erro ao excluir jogo:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir!',
        text: 'Tente novamente mais tarde.',
      })
    }
  }
}

onMounted(() => {
  carregarJogo()
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