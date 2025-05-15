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
              <div>
                 <div class="bg-secondary rounded h-100 p-4">
                            <h2 class="mb-4">Unidades Cadastradas</h2>
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">iD</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Capacidade</th>
                                        <th scope="col">Horário_func</th>
                                        <th scope="col">Telefone</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Botão</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(unidades, index) in listaunidades" :key="index">
                                        <th scope="row">{{ unidades.id }}</th>
                                        <td>{{ unidades.NomeUnidade }}</td>
                                        <td>{{ unidades.Capacidade }}</td>
                                        <td>{{ unidades.Horario_Func}}</td>
                                        <td>{{ unidades.Telefone}}</td>
                                        <td>{{ unidades.Status ? 'Ativo' : 'Inativo'}}</td>
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
  name: 'Unidades',
  data() {
  return {
    listaunidades: [] as Array<{
      id: number;
      NomeUnidade: string;
      Capacidade: number;
      Horario_Func: string;
      Telefone: string;
      Status: boolean;
    }>
  }
  },

  methods:{
    buscarUnidades(){
        this.listaunidades.push({
          id: 1,
          NomeUnidade: "Claustromania - Porto Velho",
          Capacidade: 50,
          Horario_Func: "10:00 - 22:00 (Ter-Dom)",
          Telefone: "(69) 3521-5678",
          Status: true
        });

        this.listaunidades.push({
          id: 2,
          NomeUnidade: "Claustromania - Ji-Paraná",
          Capacidade: 40,
          Horario_Func: "10:00 - 22:00 (Ter-Dom)",
          Telefone: "(69) 3521-0982",
          Status: false
        });

        this.listaunidades.push({
          id: 3,
          NomeUnidade: "Claustromania - Ouro Preto do Oeste",
          Capacidade: 60,
          Horario_Func: "10:00 - 22:00 (Ter-Dom)",
          Telefone: "(69) 3521-2345",
          Status: true
        });

        this.listaunidades.push({
          id: 4,
          NomeUnidade: "Claustromania - Jaru",
          Capacidade: 30,
          Horario_Func: "10:00 - 22:00 (Ter-Dom)",
          Telefone: "(69) 3521 - 9856",
          Status: false
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

    this.buscarUnidades();
  }
})
</script>