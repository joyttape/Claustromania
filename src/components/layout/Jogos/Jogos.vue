<template>
  <div>
    <div
      id="spinner"
      class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />
      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <div class="row bg-secondary rounded mx-0 p-4">
            <h2 class="mb-4">Jogos Cadastrados</h2>

            <div class="d-flex flex-wrap align-items-center mb-4 gap-2">
              <input
                type="text"
                v-model="searchTerm"
                class="form-control"
                style="min-width: 250px"
                placeholder="Pesquisar por nome ou descrição..."
              />

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Dificuldade:</label>
                <select v-model="selectedDificuldade" class="form-select">
                  <option value="">Todas</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Média">Média</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2">Ordem:</label>
                <select v-model="ordemAlfabetica" class="form-select">
                  <option value="">Padrão</option>
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </div>

              <router-link to="/jogos/form" class="btn btn-primary ms-auto">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Duração</th>
                    <th>Dificuldade</th>
                    <th>Preço</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(jogo, index) in jogosFiltradosOrdenados" :key="index">
                    <th>{{ jogo.id }}</th>
                    <td>{{ jogo.NomeJogo }}</td>
                    <td>{{ jogo.Descricao }}</td>
                    <td>{{ jogo.Duracao }}</td>
                    <td>{{ jogo.Dificuldade }}</td>
                    <td>{{ jogo.Preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
                    <td>
                      <router-link :to="`/jogos/detalhe/${jogo.id}`" class="btn btn-sm btn-outline-light">
                        Visualizar
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <FooterBarVue />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import axios from 'axios'

export default defineComponent({
  name: 'Jogos',
  data() {
    return {
      listajogos: [] as Array<{
        id: number;
        NomeJogo: string;
        Descricao: string;
        Duracao: string;
        Dificuldade: string;
        Preco: number;
      }>,
      searchTerm: '',
      selectedDificuldade: '',
      ordemAlfabetica: ''
    }
  },

  computed: {
    jogosFiltradosOrdenados() {
      let resultado = this.listajogos

      const termo = this.searchTerm.toLowerCase().trim()

      if (termo) {
        resultado = resultado.filter(j =>
          j.NomeJogo.toLowerCase().includes(termo) ||
          j.Descricao.toLowerCase().includes(termo)
        )
      }

      if (this.selectedDificuldade) {
        resultado = resultado.filter(j =>
          j.Dificuldade.toLowerCase().trim() === this.selectedDificuldade.toLowerCase().trim()
        )
      }

      if (this.ordemAlfabetica === 'asc') {
        resultado = resultado.slice().sort((a, b) => a.NomeJogo.localeCompare(b.NomeJogo))
      } else if (this.ordemAlfabetica === 'desc') {
        resultado = resultado.slice().sort((a, b) => b.NomeJogo.localeCompare(a.NomeJogo))
      }

      return resultado
    }
  },

  methods: {
    async buscarjogos() {
      try {
        const response = await axios.get('http://localhost:3000/jogos', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.status === 200) {
          this.listajogos = response.data.map((item: any) => ({
            id: item.id,
            NomeJogo: item.NomeJogo || '',
            Descricao: item.Descricao || '',
            Duracao: item.Duracao || '',
            Dificuldade: item.Dificuldade || '',
            Preco: item.Preco || 0
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar jogos: ', error)
      }
    }
  },

  components: {
    NavHeaderBarVue,
    NavSideBarVue,
    FooterBarVue
  },

  mounted() {
    const script = document.createElement('script')
    script.src = '/src/components/js/maincode.js'
    script.async = true
    document.body.appendChild(script)

    this.buscarjogos()
  }
})
</script>
