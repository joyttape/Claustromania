<template>
  <div>
    <!-- Spinner -->
    <div id="spinner" class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <!-- Header -->
    <NavHeaderBarVue />

    <div class="d-flex">
      <!-- Sidebar -->
      <NavSideBarVue />
      
      <!-- Conteúdo principal -->
      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <div class="row g-4">
            <!-- Clientes cadastrados -->
            <div class="col-sm-12 col-xl-6">
              <div class="bg-secondary rounded h-100 p-4">
                <h6 class="mb-4">Clientes Cadastrados</h6>
                <canvas id="clientesChart"></canvas>
              </div>
            </div>

            <!-- Reservas feitas -->
            <div class="col-sm-12 col-xl-6">
              <div class="bg-secondary rounded h-100 p-4">
                <h6 class="mb-4">Reservas Feitas</h6>
                <canvas id="reservasChart"></canvas>
              </div>
            </div>

            <!-- Jogos mais utilizados -->
            <div class="col-sm-12 col-xl-6">
              <div class="bg-secondary rounded h-100 p-4">
                <h6 class="mb-4">Jogos Mais Utilizados</h6>
                <canvas id="jogosChart"></canvas>
              </div>
            </div>

            <!-- Faturamento -->
            <div class="col-sm-12 col-xl-6">
              <div class="bg-secondary rounded h-100 p-4">
                <h6 class="mb-4">Faturamento do Caixa (R$)</h6>
                <canvas id="faturamentoChart"></canvas>
              </div>
            </div>

            <!-- Reservas por sala -->
            <div class="col-sm-12 col-xl-6">
              <div class="bg-secondary rounded h-100 p-4">
                <h6 class="mb-4">Reservas por Sala</h6>
                <canvas id="reservasSalaChart"></canvas>
              </div>
            </div>

            <!-- Reservas por horário -->
            <div class="col-sm-12 col-xl-6">
              <div class="bg-secondary rounded h-100 p-4">
                <h6 class="mb-4">Reservas por Horário</h6>
                <canvas id="reservasHorarioChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <FooterBarVue />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

export default defineComponent({
  name: 'RelatoriosView',
  components: {
    NavHeaderBarVue,
    NavSideBarVue,
    FooterBarVue
  },
  mounted() {
    // Remove o spinner
    setTimeout(() => {
      const spinner = document.getElementById('spinner')
      if (spinner) {
        spinner.classList.remove('show')
      }
    }, 500)

    // Carrega o script principal
    const script = document.createElement('script')
    script.src = '/src/components/js/maincode.js'
    script.async = true
    document.body.appendChild(script)

    // Renderiza os gráficos
    this.renderCharts()
  },
  methods: {
    renderCharts() {
      // Clientes cadastrados
      new Chart(document.getElementById('clientesChart'), {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Clientes',
            data: [120, 150, 180, 200, 220, 250],
            borderColor: '#00FF00',
            backgroundColor: 'rgba(0,255,0,0.1)',
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      })

      // Reservas feitas
      new Chart(document.getElementById('reservasChart'), {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Reservas',
            data: [50, 70, 90, 110, 130, 150],
            backgroundColor: '#FF5733',
            borderColor: '#FF5733',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      })

      // Jogos mais utilizados
      new Chart(document.getElementById('jogosChart'), {
        type: 'pie',
        data: {
          labels: ['Jogo A', 'Jogo B', 'Jogo C', 'Jogo D'],
          datasets: [{
            label: 'Uso dos Jogos',
            data: [30, 50, 15, 5],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#9b59b6'],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      })

      // Faturamento
      new Chart(document.getElementById('faturamentoChart'), {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Faturamento (R$)',
            data: [3000, 4500, 5000, 6000, 7500, 9000],
            borderColor: '#FFD700',
            backgroundColor: 'rgba(255,215,0,0.1)',
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      })

      // Reservas por sala
      new Chart(document.getElementById('reservasSalaChart'), {
        type: 'bar',
        data: {
          labels: ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4'],
          datasets: [{
            label: 'Reservas',
            data: [80, 60, 40, 70],
            backgroundColor: ['#1abc9c', '#3498db', '#9b59b6', '#e67e22'],
            borderColor: ['#1abc9c', '#3498db', '#9b59b6', '#e67e22'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      })

      // Reservas por horário
      new Chart(document.getElementById('reservasHorarioChart'), {
        type: 'bar',
        data: {
          labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
          datasets: [{
            label: 'Reservas',
            data: [20, 30, 40, 25, 15, 10],
            backgroundColor: '#2980b9',
            borderColor: '#2980b9',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      })
    }
  }
})
</script>

<style scoped>
.content {
  min-height: calc(100vh - 80px); 
}
</style>