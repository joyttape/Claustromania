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
            <h2 class="mb-4">Funcionários</h2>
 
            <div class="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                class="form-control w-50"
                placeholder="Pesquisar funcionário..."
              />
              <router-link to="/funcionarios/form" class="btn btn-primary ms-3">
                <i class="fa fa-plus me-2"></i>Cadastrar
              </router-link>
            </div>

           
            <div class="table-responsive">
              <table class="table table-hover text-white">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Cargo</th>
                    <th scope="col">Salário</th>
                    <th scope="col">Data Contratação</th>
                    <th scope="col">Turno</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(funcionarios, index) in listafuncionarios" :key="index">
                    <th scope="row">{{ funcionarios.id }}</th>
                    <td>{{ funcionarios.Nome }}</td>
                    <td>{{ funcionarios.Cargo }}</td>
                    <td>{{ funcionarios.Salário }}</td>
                    <td>{{ funcionarios.Data }}</td>
                    <td>{{ funcionarios.Turno }}</td>
                    <td>{{ funcionarios.Status ? 'Contratado' : 'Demitido' }}</td>
                    <td>
                      <router-link to="/funcionarios/detalhe" class="btn btn-sm btn-outline-light">
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
  name: 'Funcionarios',
  data() {
  return {
    listafuncionarios: [] as Array<{
      id: number;
      Nome: string;
      Cargo: string;
      Salário: number;
      Data: string;
      Turno: string;
      Status: boolean;
    }>
  }
  },

  methods:{
    buscarFuncionarios(){
        this.listafuncionarios.push({
            id: 1,
            Nome: "Carlos Almeida",
            Cargo: "Game Master",
            Salário: 2200.50,
            Data: "15/03/2022",
            Turno: "Tarde (14h-22h)",
            Status: true
        });

        this.listafuncionarios.push({
        id: 2,
        Nome: "Ana Lúcia Santos",
        Cargo: "Recepcionista",
        Salário: 1800.30,
        Data: "10/01/2023",
        Turno: "Manhã (8h-16h)",
        Status: true
        });

        this.listafuncionarios.push({
        id: 3,
        Nome: "Rafael Costa",
        Cargo: "Técnico de Manutenção",
        Salário: 2500,
        Data: "22/05/2021",
        Turno: "Integral (10h-19h)",
        Status: false
        });

        this.listafuncionarios.push({
        id: 4,
        Nome: "Juliana Oliveira",
        Cargo: "Gerente de Unidade",
        Salário: 3500,
        Data: "05/11/2020",
        Turno: "Administrativo (9h-18h)",
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

    this.buscarFuncionarios();
  }
})
</script>