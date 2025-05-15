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
          <div class="row vh-100 bg-secondary rounded align-items-center justify-content-center mx-0">
            <div class= "">
                <div>
                  <h3>Salas Cadastradas</h3>
                <button> <router-link to="/salas/cadastrosala" class="botao">Cadastar</router-link></button>
                </div>
                  <div class="bg-secondary rounded h-100 p-4">
                            <h6 class="mb-4">Hoverable Table</h6>
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">iD</th>
                                        <th scope="col">Número</th>
                                        <th scope="col">Capacidade Jogadores</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Botão</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(salas, index) in listasalas" :key="index">
                                        <th scope="row">{{ salas.id }}</th>
                                        <td>{{ salas.Numero }}</td>
                                        <td>{{ salas.Jogadores }}</td>
                                        <td>{{ salas.Status ? 'Ativo' : 'Inativo'}}</td>
                                        <td><button>Editar</button></td>
                                    </tr>
                                </tbody>
                            </table>
                  </div>
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
    }>
  }
  },

  methods:{
    buscarSalas(){
        this.listasalas.push({
          id: 1,
          Numero: "0001",
          Jogadores: 10,
          Status: false
        });

        this.listasalas.push({
          id: 2,
          Numero: "0002",
          Jogadores: 20,
          Status: true
        });

        this.listasalas.push({
          id: 3,
          Numero: "0003",
          Jogadores: 12,
          Status: false
        });

        this.listasalas.push({
          id: 4,
          Numero: "0004",
          Jogadores: 6,
          Status: true
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