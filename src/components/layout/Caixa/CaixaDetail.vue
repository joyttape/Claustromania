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
          <router-link to="/caixa" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <form @submit.prevent="salvarAlteracoes">
                  <h6 class="mb-3">Dados do Caixa</h6>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="data_abertura" class="form-label">Data de Abertura</label>
                      <input type="datetime-local" class="form-control" v-model="caixa.data_abertura" required />
                    </div>
                    <div class="col-md-6">
                      <label for="valor_abertura" class="form-label">Valor de Abertura (R$)</label>
                      <input
                        v-maska="'#,##0.00'" data-maska-tokens="separator:." data-maska-reverse
                        type="text" class="form-control" v-model="caixa.valor_abertura" required
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="data_fechamento" class="form-label">Data de Fechamento</label>
                      <input type="datetime-local" class="form-control" v-model="caixa.data_fechamento" />
                    </div>
                    <div class="col-md-6">
                      <label for="valor_fechamento" class="form-label">Valor de Fechamento (R$)</label>
                      <input
                        v-maska="'#,##0.00'" data-maska-tokens="separator:." data-maska-reverse
                        type="text" class="form-control" v-model="caixa.valor_fechamento"
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label class="form-label">Status</label>
                      <select class="form-select" v-model="caixa.status" required>
                        <option disabled value="">Selecione</option>
                        <option value="aberto">Aberto</option>
                        <option value="fechado">Fechado</option>
                      </select>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Funcionário Responsável</label>
                      <div class="position-relative">
                        <input
                          type="text"
                          class="form-control"
                          v-model="funcionarioPesquisa"
                          @input="pesquisarFuncionario"
                          @focus="mostrarSugestoes = true"
                          placeholder="Pesquisar funcionário..."
                          required
                        />
                        <div
                          v-if="mostrarSugestoes && funcionariosFiltrados.length > 0"
                          class="list-group position-absolute w-100 z-3 mt-1"
                          style="max-height: 200px; overflow-y: auto;"
                        >
                          <button
                            type="button"
                            class="list-group-item list-group-item-action"
                            v-for="func in funcionariosFiltrados"
                            :key="func.id"
                            @click="selecionarFuncionario(func)"
                          >
                            {{ func.nome }}
                          </button>
                        </div>
                      </div>
                      <small class="text-light" v-if="caixa.funcionario_nome">
                        Selecionado: <strong>{{ caixa.funcionario_nome }}</strong>
                      </small>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="observacao" class="form-label">Observação</label>
                    <textarea class="form-control" id="observacao" rows="2" v-model="caixa.observacao"></textarea>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <button class="btn btn-success me-2" type="submit">Salvar</button>
                      <button class="btn btn-danger" type="button" @click="excluirCaixa">Excluir</button>
                    </div>
                  </div>
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
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const caixa = reactive({
  data_abertura: '',
  valor_abertura: '',
  data_fechamento: '',
  valor_fechamento: '',
  status: '',
  observacao: '',
  funcionario_id: null as number | null,
  funcionario_nome: ''
})

const funcionarioPesquisa = ref('')
const funcionariosFiltrados = ref<Array<{ id: number; nome: string }>>([])
const listaFuncionarios = ref<Array<{ id: number; nome: string }>>([])
const mostrarSugestoes = ref(false)

const buscarCaixa = async () => {
  try {
    const res = await axios.get(`http://10.210.8.51:3000/caixas/${id}`)
    const dados = res.data
    Object.assign(caixa, {
      data_abertura: dados.data_abertura,
      valor_abertura: dados.valor_abertura?.toString().replace('.', ',') ?? '',
      data_fechamento: dados.data_fechamento,
      valor_fechamento: dados.valor_fechamento?.toString().replace('.', ',') ?? '',
      status: dados.status,
      observacao: dados.observacao,
      funcionario_id: dados.funcionario_id
    })
    await carregarFuncionarios()
    const funcionario = listaFuncionarios.value.find(f => f.id == dados.funcionario_id)
    if (funcionario) {
      caixa.funcionario_nome = funcionario.nome
      funcionarioPesquisa.value = funcionario.nome
    }
  } catch (error) {
    console.error(error)
    Swal.fire('Erro', 'Falha ao carregar os dados do caixa.', 'error')
  } finally {
    document.getElementById('spinner')?.classList.remove('show')
  }
}

const carregarFuncionarios = async () => {
  try {
    const res = await axios.get('http://10.210.8.51:3000/funcionarios')
    listaFuncionarios.value = res.data
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error)
  }
}

const pesquisarFuncionario = () => {
  if (funcionarioPesquisa.value.length < 2) {
    funcionariosFiltrados.value = []
    return
  }

  funcionariosFiltrados.value = listaFuncionarios.value.filter(f =>
    f.nome.toLowerCase().includes(funcionarioPesquisa.value.toLowerCase())
  )
}

const selecionarFuncionario = (func: { id: number; nome: string }) => {
  caixa.funcionario_id = func.id
  caixa.funcionario_nome = func.nome
  funcionarioPesquisa.value = func.nome
  mostrarSugestoes.value = false
}

const salvarAlteracoes = async () => {
  try {
    const dados = {
      data_abertura: caixa.data_abertura,
      valor_abertura: parseFloat(caixa.valor_abertura.replace('.', '').replace(',', '.')),
      data_fechamento: caixa.data_fechamento || null,
      valor_fechamento: caixa.valor_fechamento
        ? parseFloat(caixa.valor_fechamento.replace('.', '').replace(',', '.'))
        : null,
      status: caixa.status,
      observacao: caixa.observacao,
      funcionario_id: caixa.funcionario_id
    }

    await axios.put(`http://10.210.8.51:3000/caixas/${id}`, dados)

    Swal.fire('Sucesso', 'Caixa atualizado com sucesso!', 'success')
    router.push('/caixa')
  } catch (error) {
    console.error(error)
    Swal.fire('Erro', 'Falha ao salvar as alterações.', 'error')
  }
}

const excluirCaixa = async () => {
  const confirm = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Essa ação é irreversível!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })

  if (confirm.isConfirmed) {
    try {
      await axios.delete(`http://10.210.8.51:3000/caixas/${id}`)
      Swal.fire('Excluído!', 'O caixa foi removido.', 'success')
      router.push('/caixa')
    } catch (error) {
      console.error(error)
      Swal.fire('Erro', 'Erro ao excluir o caixa.', 'error')
    }
  }
}

onMounted(() => {
  buscarCaixa()
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>
