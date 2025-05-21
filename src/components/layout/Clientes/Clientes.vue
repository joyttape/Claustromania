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
            <h2 class="mb-4">Jogadores</h2>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                class="form-control w-50"
                placeholder="Pesquisar jogador..."
              />
              <router-link to="/clientes/formclientes" class="btn btn-primary ms-3">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Sexo</th>
                    <th scope="col">Data Nascimento</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Botão</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(jogador, index) in listaclientes" :key="index">
                    <th scope="row">{{ jogador.id }}</th>
                    <td>{{ jogador.Nome }}</td>
                    <td>{{ jogador.CPF }}</td>
                    <td>{{ jogador.Sexo }}</td>
                    <td>{{ jogador.Data }}</td>
                    <td>{{ jogador.Email }}</td>
                    <td><button class="btn btn-sm btn-primary">Editar</button></td>
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
  name: 'Unidades',
  data() {
  return {
    listaclientes: [] as Array<{
      id: number;
      Nome: string;
      CPF: string;
      Sexo: string;
      Data: string;
      Email: string;
    }>
  }
  },

  methods:{
    buscarClientes(){
        this.listaclientes.push({
        id: 1,
        Nome: "Marcos Silva Rocha",
        CPF: "123.456.789-01",
        Sexo: "Masculino",
        Data: "05/08/1995",
        Email: "marcos.rocha@email.com"
        });

        this.listaclientes.push({
        id: 2,
        Nome: "Ana Carolina Mendes",
        CPF: "987.654.321-00",
        Sexo: "Feminino",
        Data: "22/11/2000",
        Email: "ana.mendes@email.com"
        });

        this.listaclientes.push({
        id: 3,
        Nome: "Rafael Pereira Costa",
        CPF: "456.123.789-34",
        Sexo: "Masculino",
        Data: "15/03/1998",
        Email: "rafael.costa@email.com"
        });

        this.listaclientes.push({
        id: 4,
        Nome: "Juliana Santos Oliveira",
        CPF: "321.654.987-99",
        Sexo: "Feminino",
        Data: "30/07/1992",
        Email: "juliana.oliveira@email.com"
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

    this.buscarClientes();
  }
})
</script>