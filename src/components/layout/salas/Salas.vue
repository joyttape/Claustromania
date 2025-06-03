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
          <div class="row bg-secondary rounded mx-0 p-4">
            <h2 class="mb-4">Salas</h2>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                class="form-control w-50"
                placeholder="Pesquisar salas..."
              />
              <router-link to="/salas/form" class="btn btn-primary ms-3">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Número</th>
                    <th scope="col">Capacidade Jogadores</th>
                    <th scope="col">Status</th>
                    <th scope="col">Jogos</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sala, index) in listasalas" :key="index">
                    <th scope="row">{{ sala.id }}</th>
                    <td>{{ sala.Numero }}</td>
                    <td>{{ sala.Jogadores }}</td>
                    <td>{{ sala.Status ? 'Ativo' : 'Inativo' }}</td>
                    <td>
                      <ul class="mb-0 ps-3">
                        <li v-for="jogo in sala.Jogos" :key="jogo.id">
                          {{ jogo.NomeJogo }}
                        </li>
                      </ul>
                    </td>
                    <td>
                      <router-link to="/salas/detalhe" class="btn btn-sm btn-outline-light">
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

export default defineComponent({
  name: 'Salas',
  data() {
  return {
    listasalas: [] as Array<{
      id: number;
      Numero: string;
      Jogadores: number;
      Status: boolean;
       Jogos: Array<{ id: number; NomeJogo: string }>;
    }>
  }
  },

  methods:{
    buscarSalas(){
        this.listasalas.push({
          id: 1,
          Numero: "0001",
          Jogadores: 10,
          Status: false,
          Jogos: [
        { id: 1, NomeJogo: 'Mistério no Museu' },
        { id: 2, NomeJogo: 'O Cofre Secreto' }
          ]
        });

        this.listasalas.push({
          id: 2,
          Numero: "0002",
          Jogadores: 20,
          Status: true,
          Jogos: [
        { id: 1, NomeJogo: 'Mistério no Museu' },
        { id: 2, NomeJogo: 'O Cofre Secreto' }
          ]
        });

        this.listasalas.push({
          id: 3,
          Numero: "0003",
          Jogadores: 12,
          Status: false,
          Jogos: [
        { id: 1, NomeJogo: 'Mistério no Museu' },
        { id: 2, NomeJogo: 'O Cofre Secreto' }
          ]
        });

        this.listasalas.push({
          id: 4,
          Numero: "0004",
          Jogadores: 6,
          Status: true,
          Jogos: [
        { id: 1, NomeJogo: 'Mistério no Museu' },
        { id: 2, NomeJogo: 'O Cofre Secreto' }
          ]
        });
        
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

    this.buscarSalas();
  }
})
</script>