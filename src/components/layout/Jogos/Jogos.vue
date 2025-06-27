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
            <h2 class="mb-4">Jogos Cadastrados</h2>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                class="form-control w-50"
                placeholder="Pesquisar unidade..."
              />
              <router-link to="/jogos/form" class="btn btn-primary ms-3">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Descricao</th>
                    <th scope="col">Duração</th>
                    <th scope="col">Dificuldade</th>
                    <th scope="col">Preço</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(jogo, index) in listajogos" :key="index">
                    <th scope="row">{{ jogo.id }}</th>
                    <td>{{ jogo.NomeJogo }}</td>
                    <td>{{ jogo.Descricao }}</td>
                    <td>{{ jogo.Duracao }}</td>
                    <td>{{ jogo.Dificuldade }}</td>
                    <td>{{ jogo.Preco }}</td>
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
    }>
  }
  },

  methods:{
    async buscarjogos(){
      
      try{
        const response = await axios.get('http://10.210.8.51:3000/jogos',{
          headers:{
            'Content-Type': 'application/json',
            'ngrok-ship-browser-warning': '69420'
          }
        })

        if(response.status === 200){
          this.listajogos = response.data.map((item:any) => ({
            id: item.id,
            NomeJogo: item.NomeJogo,
            Descricao: item.Descricao,
            Duracao: item.Duracao,
            Dificuldade: item.Dificuldade,
            Preco: item.Preco
          }))
        }
      }catch(error){
        console.error('Eror ao buscar jogos: ', error)
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

    this.buscarjogos();
  }
})
</script>