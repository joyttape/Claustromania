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
                    <button type="submit" class="btn btn-success me-2">Salvar</button>
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
import { reactive } from 'vue'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const jogo = reactive({
  id: 0,
  NomeJogo: '',
  Descricao: '',
  Duracao: '',
  Dificuldade: '',
  Preco: ''
})

const bloquearLetras = (event: KeyboardEvent) => {
  const tecla = event.key
  
  if (!/[\d.,]/.test(tecla)) {
    event.preventDefault()
  }
}

const formatarPreco = (event: Event) => {
  const target = event.target as HTMLInputElement
  let valor = target.value.replace(/\D/g, '')

  valor = (parseInt(valor, 10) / 100).toFixed(2)
  valor = valor.replace('.', ',')
  jogo.Preco = `R$ ${valor}`
}

const salvarAlteracoes = () => {
  alert("Jogo atualizado! (simulação)")
  console.log("Jogo atualizado:", jogo)
}

const cancelarAlteracoes = () => {
  if (confirm("Deseja realmente remover este jogo?")) {
    alert("Jogo deletado! (simulação)")
  }
}

</script>

<style scoped>
textarea {
  resize: none;
}
</style>