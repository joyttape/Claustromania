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
                      <select
                        class="form-select"
                        id="dificuldade"
                        v-model.number="jogo.Dificuldade"
                        required
                      >
                        <option disabled value="">Selecione</option>
                        <option :value="0">Fácil</option>
                        <option :value="1">Médio</option>
                        <option :value="2">Difícil</option>
                      </select>
                    </div>

                    <div class="col-md-6">
                      <label for="preco" class="form-label">Preço</label>
                      <input
                        type="text"
                        class="form-control"
                        id="preco"
                        v-model="precoFormatado"
                        @input="aplicarMascaraDinheiro"
                        inputmode="numeric"
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
import { api } from '@/common/http'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const jogoId = route.params.id as string

const jogo = reactive({
  id: 0,
  NomeJogo: '',
  Descricao: null as number | null,
  Duracao: '',
  Dificuldade: '',
  Preco: null as number | null
})

const precoFormatado = ref('')
const loading = ref(true)

const formatarDinheiro = (valor: string | number) => {
  if (valor === null || valor === undefined || valor === '') return ''
  
  let numeroValor: number
  
  if (typeof valor === 'string') {
    const v = valor.replace(/\D/g, '')
    
    if (v.length === 0) return ''
    
    const numero = parseInt(v)
    
    numeroValor = numero / 100
  } else {
    numeroValor = valor
  }
  
  return numeroValor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatarPrecoCarregado = (preco: number | string | null) => {
  if (preco === null || preco === undefined || preco === '') return ''
  
  const numeroPreco = typeof preco === 'string' ? parseFloat(preco) : preco
  
  if (isNaN(numeroPreco)) return ''
  
  return numeroPreco.toLocaleString('pt-BR', {
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
    jogo.Preco = parseFloat((parseInt(apenasNumeros) / 100).toFixed(2))
  } else {
    jogo.Preco = null
  }
}

const carregarJogo = async () => {
  loading.value = true
  try {
    const response = await api.get(`/api/Jogo/${jogoId}`)
    const dados = response.data

    jogo.id = dados.id
    jogo.NomeJogo = dados.nome || ''
    jogo.Duracao = dados.duracao || ''
    jogo.Dificuldade = dados.dificuldade ?? null
    jogo.Descricao = dados.descricao || ''
    jogo.Preco = dados.preco ?? null
    
    precoFormatado.value = dados.preco !== null ? formatarPrecoCarregado(dados.preco) : ''
    
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
    const dadosEnvio = {
      id: jogo.id,
      nome: jogo.NomeJogo,
      descricao: jogo.Descricao,
      duracao: jogo.Duracao,
      dificuldade: jogo.Dificuldade,
      preco: jogo.Preco
    }
    
    await api.put(`/api/Jogo/${jogoId}`, dadosEnvio)
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
      await api.delete(`/api/Jogo/${jogoId}`)
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

