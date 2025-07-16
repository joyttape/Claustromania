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
          <!-- Cards de Estatísticas com Canvas -->
          <div class="row mb-4">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-primary">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ listaunidades.length }}</h3>
                    <p class="text-white-50 mb-0">Total de Unidades</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="totalCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-success">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ unidadesAtivas }}</h3>
                    <p class="text-white-50 mb-0">Unidades Ativas</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="ativasCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-warning">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ capacidadeTotal }}</h3>
                    <p class="text-white-50 mb-0">Capacidade Total</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="capacidadeCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-info">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ mediaCapacidade }}</h3>
                    <p class="text-white-50 mb-0">Média Capacidade</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="mediaCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de Status das Unidades -->
          <div class="row mb-4">
            <div class="col-xl-8 col-lg-7">
              <div class="card bg-secondary">
                <div class="card-header bg-dark">
                  <h5 class="text-white mb-0">
                    <i class="fa fa-chart-pie me-2 text-primary"></i>Distribuição de Status
                  </h5>
                </div>
                <div class="card-body text-center">
                  <canvas ref="statusChart" width="400" height="200"></canvas>
                </div>
              </div>
            </div>
            
            <div class="col-xl-4 col-lg-5">
              <div class="card bg-secondary">
                <div class="card-header bg-dark">
                  <h5 class="text-white mb-0">
                    <i class="fa fa-chart-bar me-2 text-primary"></i>Capacidade por Unidade
                  </h5>
                </div>
                <div class="card-body">
                  <canvas ref="capacityChart" width="300" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>

          <div class="row bg-secondary rounded mx-0 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="mb-0 text-white">
                <i class="fa fa-building me-2 text-primary"></i>Unidades
                <span class="badge bg-primary ms-2">{{ unidadesFiltradasOrdenadas.length }}</span>
              </h2>

              <router-link to="/unidades/form" class="btn btn-primary ms-auto enhanced-btn">
                <i class="fa fa-plus me-2"></i>Nova Unidade
              </router-link>
            </div>

            <!-- Indicadores Visuais de Filtros -->
            <div class="filter-indicators mb-3" v-if="searchTerm || selectedStatus || ordemAlfabetica">
              <div class="d-flex flex-wrap gap-2">
                <span v-if="searchTerm" class="badge bg-info">
                  <i class="fa fa-search me-1"></i>Busca: "{{ searchTerm }}"
                  <button @click="searchTerm = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                </span>
                <span v-if="selectedStatus" class="badge bg-warning">
                  <i class="fa fa-filter me-1"></i>Status: {{ selectedStatus }}
                  <button @click="selectedStatus = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                </span>
                <span v-if="ordemAlfabetica" class="badge bg-success">
                  <i class="fa fa-sort me-1"></i>Ordem: {{ ordemAlfabetica === 'asc' ? 'A → Z' : 'Z → A' }}
                  <button @click="ordemAlfabetica = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                </span>
              </div>
            </div>

            <div class="d-flex flex-wrap align-items-center mb-4 gap-3">
              <div class="search-container position-relative">
                <i class="fa fa-search search-icon text-muted"></i>
                <input
                  type="text"
                  v-model="searchTerm"
                  class="form-control enhanced-input"
                  style="min-width: 250px; padding-left: 2.5rem;"
                  placeholder="Pesquisar por nome ou telefone..."
                />
                <div class="search-pulse" v-if="searchTerm"></div>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Status:</label>
                <select v-model="selectedStatus" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Ordem:</label>
                <select v-model="ordemAlfabetica" class="form-select enhanced-select">
                  <option value="">Padrão</option>
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover text-white enhanced-table">
                <thead class="table-dark">
                  <tr>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="idHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        ID
                      </div>
                    </th>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="nomeHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Nome
                      </div>
                    </th>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="capacidadeHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Capacidade
                      </div>
                    </th>
                    <th>Horário Abertura</th>
                    <th>Horário Fechamento</th>
                    <th>Telefone</th>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="statusHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Status
                      </div>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(unidade, index) in unidadesFiltradasOrdenadas" :key="index" class="enhanced-row">
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas :ref="`rowCanvas${index}`" width="30" height="30" class="me-2"></canvas>
                        {{ unidade.id }}
                      </div>
                    </th>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="unit-indicator me-2" :class="unidade.Status ? 'active' : 'inactive'"></div>
                        {{ unidade.NomeUnidade }}
                      </div>
                    </td>
                    <td>
                      <div class="capacity-bar-container">
                        <div class="capacity-bar">
                          <div class="capacity-fill" :style="{ width: (unidade.Capacidade / maxCapacidade * 100) + '%' }"></div>
                        </div>
                        <span class="capacity-text">{{ unidade.Capacidade }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="time-badge">
                        <i class="fa fa-clock me-1"></i>{{ unidade.Horario_Abert }}
                      </span>
                    </td>
                    <td>
                      <span class="time-badge">
                        <i class="fa fa-clock me-1"></i>{{ unidade.Horario_Fecha }}
                      </span>
                    </td>
                    <td>
                      <span class="phone-badge">
                        <i class="fa fa-phone me-1"></i>{{ unidade.Telefone }}
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" :class="unidade.Status ? 'status-active' : 'status-inactive'">
                        <i class="fa fa-circle me-1"></i>{{ unidade.Status ? 'Ativo' : 'Inativo' }}
                      </span>
                    </td>
                    <td>
                      <router-link :to="`/unidades/detalhe/${unidade.id}`" class="btn btn-sm btn-outline-light enhanced-btn-sm">
                        <i class="fa fa-eye me-1"></i>Visualizar
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="unidadesFiltradasOrdenadas.length === 0">
                    <td colspan="8" class="text-center text-white py-5">
                      <div class="empty-state">
                        <canvas ref="emptyStateCanvas" width="100" height="100" class="mb-3"></canvas>
                        <h5 class="text-muted">Nenhuma unidade encontrada</h5>
                        <p class="text-muted">Tente ajustar os filtros ou cadastre uma nova unidade.</p>
                      </div>
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
import { api } from '@/common/http'

export default defineComponent({
  name: 'Unidades',
  data() {
    return {
      listaunidades: [] as Array<{
        id: number
        NomeUnidade: string
        Capacidade: number
        Horario_Abert: string
        Horario_Fecha: string
        Telefone: string
        Status: boolean
      }>,
      searchTerm: '',
      selectedStatus: '',
      ordemAlfabetica: ''
    }
  },

  computed: {
    unidadesFiltradasOrdenadas() {
      let resultado = this.listaunidades
      const termo = this.searchTerm.toLowerCase().trim()

      if (termo) {
        resultado = resultado.filter(u =>
          u.NomeUnidade.toLowerCase().includes(termo) ||
          u.Telefone.toLowerCase().includes(termo)
        )
      }

      if (this.selectedStatus) {
        resultado = resultado.filter(u =>
          u.Status === (this.selectedStatus === 'Ativo')
        )
      }

      if (this.ordemAlfabetica === 'asc') {
        resultado = resultado.slice().sort((a, b) => a.NomeUnidade.localeCompare(b.NomeUnidade))
      } else if (this.ordemAlfabetica === 'desc') {
        resultado = resultado.slice().sort((a, b) => b.NomeUnidade.localeCompare(a.NomeUnidade))
      }

      return resultado
    },

    unidadesAtivas() {
      return this.listaunidades.filter(u => u.Status).length
    },

    capacidadeTotal() {
      return this.listaunidades.reduce((total, u) => total + u.Capacidade, 0)
    },

    mediaCapacidade() {
      if (this.listaunidades.length === 0) return 0
      return Math.round(this.capacidadeTotal / this.listaunidades.length)
    },

    maxCapacidade() {
      if (this.listaunidades.length === 0) return 100
      return Math.max(...this.listaunidades.map(u => u.Capacidade))
    }
  },

  methods: {
    async buscarUnidades() {
      try {
        const response = await api.get('/api/Unidade', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.status === 200) {
          this.listaunidades = response.data.map((item: any) => ({
            id: item.id,
            NomeUnidade: item.nome || 'Não informado',
            Capacidade: item.capacidade || 0,
            Horario_Abert: item.horarioAbertura || '',
            Horario_Fecha: item.horarioFechamento || '',
            Telefone: item.telefone || '',
            Status: !!item.ativa
          }))

          // Desenhar gráficos após carregar os dados
          this.$nextTick(() => {
            this.drawAllCharts()
          })
        }
      } catch (error) {
        console.error('Erro ao buscar unidades:', error)
      }
    },

    drawAllCharts() {
      this.drawStatsIcons()
      this.drawStatusChart()
      this.drawCapacityChart()
      this.drawHeaderIcons()
      this.drawRowIcons()
      this.drawEmptyStateIcon()
    },

    drawStatsIcons() {
      // Ícone para Total de Unidades
      const totalCanvas = this.$refs.totalCanvas as HTMLCanvasElement
      if (totalCanvas) {
        const ctx = totalCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fillRect(15, 20, 30, 25)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.fillRect(20, 15, 20, 5)
        ctx.fillRect(25, 25, 10, 15)
      }

      // Ícone para Unidades Ativas
      const ativasCanvas = this.$refs.ativasCanvas as HTMLCanvasElement
      if (ativasCanvas) {
        const ctx = ativasCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.beginPath()
        ctx.arc(30, 30, 20, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = 'rgba(40, 167, 69, 1)'
        ctx.font = '20px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('✓', 30, 37)
      }

      // Ícone para Capacidade Total
      const capacidadeCanvas = this.$refs.capacidadeCanvas as HTMLCanvasElement
      if (capacidadeCanvas) {
        const ctx = capacidadeCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            ctx.fillRect(10 + i * 15, 10 + j * 15, 10, 10)
          }
        }
      }

      // Ícone para Média de Capacidade
      const mediaCanvas = this.$refs.mediaCanvas as HTMLCanvasElement
      if (mediaCanvas) {
        const ctx = mediaCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(10, 45)
        ctx.lineTo(20, 35)
        ctx.lineTo(30, 25)
        ctx.lineTo(40, 30)
        ctx.lineTo(50, 20)
        ctx.stroke()
      }
    },

    drawStatusChart() {
      const canvas = this.$refs.statusChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 80

      const ativas = this.unidadesAtivas
      const inativas = this.listaunidades.length - ativas
      const total = this.listaunidades.length

      if (total === 0) return

      const ativasAngle = (ativas / total) * 2 * Math.PI
      const inativasAngle = (inativas / total) * 2 * Math.PI

      // Desenhar fatia das ativas
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, 0, ativasAngle)
      ctx.closePath()
      ctx.fillStyle = '#28a745'
      ctx.fill()

      // Desenhar fatia das inativas
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, ativasAngle, ativasAngle + inativasAngle)
      ctx.closePath()
      ctx.fillStyle = '#dc3545'
      ctx.fill()

      // Legenda
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px Arial'
      ctx.fillText(`Ativas: ${ativas}`, centerX + 100, centerY - 20)
      ctx.fillText(`Inativas: ${inativas}`, centerX + 100, centerY + 10)
    },

    drawCapacityChart() {
      const canvas = this.$refs.capacityChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const maxHeight = 150
      const barWidth = 40
      const spacing = 10

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      this.listaunidades.slice(0, 5).forEach((unidade, index) => {
        const x = 20 + index * (barWidth + spacing)
        const height = (unidade.Capacidade / this.maxCapacidade) * maxHeight
        const y = canvas.height - height - 20

        // Barra
        ctx.fillStyle = '#17a2b8'
        ctx.fillRect(x, y, barWidth, height)

        // Valor
        ctx.fillStyle = '#ffffff'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(unidade.Capacidade.toString(), x + barWidth / 2, y - 5)
      })
    },

    drawHeaderIcons() {
      const icons = [
        { ref: 'idHeaderCanvas', symbol: '#' },
        { ref: 'nomeHeaderCanvas', symbol: 'A' },
        { ref: 'capacidadeHeaderCanvas', symbol: '∑' },
        { ref: 'statusHeaderCanvas', symbol: '●' }
      ]

      icons.forEach(icon => {
        const canvas = this.$refs[icon.ref] as HTMLCanvasElement
        if (canvas) {
          const ctx = canvas.getContext('2d')!
          ctx.clearRect(0, 0, 20, 20)
          ctx.fillStyle = '#0d6efd'
          ctx.font = '12px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(icon.symbol, 10, 14)
        }
      })
    },

    drawRowIcons() {
      this.unidadesFiltradasOrdenadas.forEach((unidade, index) => {
        const canvas = this.$refs[`rowCanvas${index}`] as HTMLCanvasElement
        if (canvas) {
          const ctx = canvas.getContext('2d')!
          ctx.clearRect(0, 0, 30, 30)
          
          // Círculo de fundo
          ctx.beginPath()
          ctx.arc(15, 15, 12, 0, 2 * Math.PI)
          ctx.fillStyle = unidade.Status ? '#28a745' : '#6c757d'
          ctx.fill()
          
          // Número da unidade
          ctx.fillStyle = '#ffffff'
          ctx.font = '10px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(unidade.id.toString(), 15, 19)
        }
      })
    },

    drawEmptyStateIcon() {
      const canvas = this.$refs.emptyStateCanvas as HTMLCanvasElement
      if (canvas) {
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, 100, 100)
        ctx.strokeStyle = '#6c757d'
        ctx.lineWidth = 3
        ctx.strokeRect(20, 30, 60, 40)
        ctx.strokeRect(30, 20, 40, 10)
        ctx.strokeRect(40, 40, 20, 20)
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

    this.buscarUnidades()
  },

  updated() {
    this.$nextTick(() => {
      this.drawRowIcons()
    })
  }
})
</script>

<style scoped>
.stats-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.stats-canvas {
  opacity: 0.8;
}

.filter-indicators {
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-container {
  position: relative;
}

.search-pulse {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #0d6efd;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-50%) scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
}

.unit-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.unit-indicator.active {
  background-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.6);
}

.unit-indicator.inactive {
  background-color: #6c757d;
}

.capacity-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.capacity-bar {
  flex-grow: 1;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.capacity-text {
  font-weight: bold;
  min-width: 30px;
}

.time-badge, .phone-badge {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-active {
  background-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.status-inactive {
  background-color: rgba(108, 117, 125, 0.2);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
}

.enhanced-btn {
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.enhanced-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.enhanced-btn-sm {
  transition: all 0.3s ease;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.enhanced-btn-sm:hover {
  transform: translateY(-1px);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.enhanced-input {
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.enhanced-input:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  color: white;
}

.enhanced-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.enhanced-select {
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.enhanced-select:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  color: white;
}

.enhanced-select option {
  background-color: #6c757d;
  color: white;
}

.enhanced-table {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.enhanced-table thead th {
  background-color: #495057 !important;
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.enhanced-row {
  transition: all 0.3s ease;
}

.enhanced-row:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  transform: scale(1.01);
}

.empty-state {
  padding: 2rem;
}

.empty-state i {
  opacity: 0.3;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.enhanced-table tbody tr {
  animation: fadeIn 0.5s ease-in-out;
}

@media (max-width: 768px) {
  .d-flex.flex-wrap.align-items-center {
    flex-direction: column;
    align-items: stretch !important;
  }

  .d-flex.flex-wrap.align-items-center > * {
    margin-bottom: 0.5rem;
  }

  .enhanced-input {
    min-width: auto !important;
  }

  .stats-card {
    margin-bottom: 1rem;
  }
}
</style>