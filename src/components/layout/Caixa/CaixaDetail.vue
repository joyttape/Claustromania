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
          <router-link to="/caixa" class="btn btn-outline-light mb-3">
            ← Voltar
          </router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <div class="d-flex align-items-start gap-4">
                  <form @submit.prevent="salvarAlteracoes" class="flex-grow-1">
                    <h6 class="mb-3">Dados do Caixa</h6>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="data_abertura" class="form-label">Data de Abertura</label>
                        <input
                          type="datetime-local"
                          class="form-control"
                          id="data_abertura"
                          v-model="caixa.data_abertura"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label for="valor_abertura" class="form-label">Valor de Abertura (R$)</label>
                        <input
                          v-maska="'#,##0.00'"
                          data-maska-tokens="separator:."
                          data-maska-reverse
                          type="text"
                          class="form-control"
                          id="valor_abertura"
                          v-model="caixa.valor_abertura"
                          required
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="data_fechamento" class="form-label">Data de Fechamento</label>
                        <input
                          type="datetime-local"
                          class="form-control"
                          id="data_fechamento"
                          v-model="caixa.data_fechamento"
                        />
                      </div>
                      <div class="col-md-6">
                        <label for="valor_fechamento" class="form-label">Valor de Fechamento (R$)</label>
                        <input
                          v-maska="'#,##0.00'"
                          data-maska-tokens="separator:."
                          data-maska-reverse
                          type="text"
                          class="form-control"
                          id="valor_fechamento"
                          v-model="caixa.valor_fechamento"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="status" class="form-label">Status</label>
                        <select
                          class="form-select"
                          id="status"
                          v-model="caixa.status"
                          required
                        >
                          <option disabled value="">Selecione</option>
                          <option value="aberto">Aberto</option>
                          <option value="fechado">Fechado</option>
                        </select>
                      </div>
                      <div class="col-md-6">
                        <label for="observacao" class="form-label">Observação</label>
                        <textarea
                          class="form-control"
                          id="observacao"
                          rows="2"
                          v-model="caixa.observacao"
                          placeholder="Observações sobre o caixa"
                        ></textarea>
                      </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        <button class="btn btn-success me-2" type="submit">
                          Salvar
                        </button>
                        <button
                          class="btn btn-danger"
                          type="button"
                          @click="excluirCaixa"
                        >
                          Excluir
                        </button>
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
import { reactive, onMounted } from 'vue'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const caixa = reactive({
  data_abertura: '',
  valor_abertura: '',
  data_fechamento: '',
  valor_fechamento: '',
  status: '',
  observacao: ''
})

const salvarAlteracoes = () => {
  console.log('Dados do caixa:', caixa)
  alert('Caixa salvo com sucesso! (simulação)')
}

const excluirCaixa = () => {
  if (confirm('Deseja realmente excluir este caixa?')) {
    alert('Caixa excluído! (simulação)')
    limparFormulario()
  }
}

const limparFormulario = () => {
  Object.assign(caixa, {
    data_abertura: '',
    valor_abertura: '',
    data_fechamento: '',
    valor_fechamento: '',
    status: '',
    observacao: ''
  })
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>
