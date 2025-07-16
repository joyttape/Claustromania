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
          <div class="row mb-4">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-primary">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ listajogos.length }}</h3>
                    <p class="text-white-50 mb-0">Total de Jogos</p>
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
                    <h3 class="text-white mb-0">{{ jogosFaceis }}</h3>
                    <p class="text-white-50 mb-0">Jogos Fáceis</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="faceisCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-warning">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ precoMedio }}</h3>
                    <p class="text-white-50 mb-0">Preço Médio</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="precoCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-info">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ duracaoMedia }}</h3>
                    <p class="text-white-50 mb-0">Duração Média</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="duracaoCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-xl-8 col-lg-7">
              <div class="card bg-secondary">
                <div class="card-header bg-dark">
                  <h5 class="text-white mb-0">
                    <i class="fa fa-chart-pie me-2 text-primary"></i>Distribuição por Dificuldade
                  </h5>
                </div>
                <div class="card-body text-center">
                  <canvas ref="dificuldadeChart" width="400" height="200"></canvas>
                </div>
              </div>
            </div>
            
            <div class="col-xl-4 col-lg-5">
              <div class="card bg-secondary">
                <div class="card-header bg-dark">
                  <h5 class="text-white mb-0">
                    <i class="fa fa-chart-bar me-2 text-primary"></i>Preços dos Jogos
                  </h5>
                </div>
                <div class="card-body">
                  <canvas ref="precoChart" width="300" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>

          <div class="row bg-secondary rounded mx-0 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="mb-0 text-white">
                <i class="fa fa-puzzle-piece me-2 text-primary"></i>Jogos
                <span class="badge bg-primary ms-2">{{ jogosFiltradosOrdenados.length }}</span>
              </h2>

              <router-link to="/jogos/form" class="btn btn-primary ms-auto enhanced-btn">
                <i class="fa fa-plus me-2"></i>Novo Jogo
              </router-link>
            </div>

            <div class="filter-indicators mb-3" v-if="searchTerm || selectedDificuldade !== '' || ordemAlfabetica">
              <div class="d-flex flex-wrap gap-2">
                <span v-if="searchTerm" class="badge bg-info">
                  <i class="fa fa-search me-1"></i>Busca: "{{ searchTerm }}"
                  <button @click="searchTerm = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                </span>
                <span v-if="selectedDificuldade !== ''" class="badge bg-warning">
                  <i class="fa fa-filter me-1"></i>Dificuldade: {{ traduzirDificuldade(selectedDificuldade) }}
                  <button @click="selectedDificuldade = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
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
                  placeholder="Pesquisar por nome ou descrição..."
                />
                <div class="search-pulse" v-if="searchTerm"></div>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Dificuldade:</label>
                <select v-model="selectedDificuldade" class="form-select enhanced-select">
                  <option value="">Todas</option>
                  <option value="0">Fácil</option>
                  <option value="1">Média</option>
                  <option value="2">Difícil</option>
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
                    <th>Descrição</th>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="duracaoHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Duração
                      </div>
                    </th>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="dificuldadeHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Dificuldade
                      </div>
                    </th>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="precoHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Preço
                      </div>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(jogo, index) in jogosFiltradosOrdenados" :key="index" class="enhanced-row">
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas :ref="`rowCanvas${index}`" width="30" height="30" class="me-2"></canvas>
                        {{ jogo.id }}
                      </div>
                    </th>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="game-indicator me-2" :class="getDifficultyClass(jogo.Dificuldade)"></div>
                        {{ jogo.NomeJogo }}
                      </div>
                    </td>
                    <td>
                      <span class="description-text">{{ jogo.Descricao }}</span>
                    </td>
                    <td>
                      <div class="duration-container">
                        <div class="duration-bar">
                          <div class="duration-fill" :style="{ width: getDurationPercentage(jogo.Duracao) + '%' }"></div>
                        </div>
                        <span class="duration-text">{{ jogo.Duracao }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="difficulty-badge" :class="getDifficultyBadgeClass(jogo.Dificuldade)">
                        <i class="fa fa-star me-1"></i>{{ traduzirDificuldade(jogo.Dificuldade) }}
                      </span>
                    </td>
                    <td>
                      <div class="price-container">
                        <span class="price-badge">
                          <i class="fa fa-dollar-sign me-1"></i>{{ jogo.Preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                        </span>
                        <div class="price-bar">
                          <div class="price-fill" :style="{ width: getPricePercentage(jogo.Preco) + '%' }"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <router-link :to="`/jogos/detalhe/${jogo.id}`" class="btn btn-sm btn-outline-light enhanced-btn-sm">
                        <i class="fa fa-eye me-1"></i>Visualizar
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="jogosFiltradosOrdenados.length === 0">
                    <td colspan="7" class="text-center text-white py-5">
                      <div class="empty-state">
                        <canvas ref="emptyStateCanvas" width="100" height="100" class="mb-3"></canvas>
                        <h5 class="text-muted">Nenhum jogo encontrado</h5>
                        <p class="text-muted">Tente ajustar os filtros ou cadastre um novo jogo.</p>
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
import { api } from '@/common/http';

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

      if (this.selectedDificuldade !== '') {
        resultado = resultado.filter(j =>
          Number(j.Dificuldade) === Number(this.selectedDificuldade)
        )
      }

      if (this.ordemAlfabetica === 'asc') {
        resultado = resultado.slice().sort((a, b) => a.NomeJogo.localeCompare(b.NomeJogo))
      } else if (this.ordemAlfabetica === 'desc') {
        resultado = resultado.slice().sort((a, b) => b.NomeJogo.localeCompare(a.NomeJogo))
      }

      return resultado
    },

    jogosFaceis() {
      return this.listajogos.filter(j => Number(j.Dificuldade) === 0).length
    },

    precoMedio() {
      if (this.listajogos.length === 0) return 'R$ 0,00'
      const media = this.listajogos.reduce((total, j) => total + j.Preco, 0) / this.listajogos.length
      return media.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },

    duracaoMedia() {
      if (this.listajogos.length === 0) return '0 min'
      const duracoes = this.listajogos.map(j => parseInt(j.Duracao.replace(/\D/g, '')) || 0)
      const media = duracoes.reduce((total, d) => total + d, 0) / duracoes.length
      return Math.round(media) + ' min'
    },

    maxPreco() {
      if (this.listajogos.length === 0) return 100
      return Math.max(...this.listajogos.map(j => j.Preco))
    },

    maxDuracao() {
      if (this.listajogos.length === 0) return 60
      const duracoes = this.listajogos.map(j => parseInt(j.Duracao.replace(/\D/g, '')) || 0)
      return Math.max(...duracoes)
    }
  },

  methods: {
    async buscarjogos() {
      try {
        const response = await api.get('/api/Jogo', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })
        if (response.status === 200) {
          this.listajogos = response.data.map((item: any) => ({
            id: item.id,
            NomeJogo: item.nome || '',
            Descricao: item.descricao || '',
            Duracao: item.duracao || '',
            Dificuldade: item.dificuldade || '',
            Preco: item.preco || 0
          }))

          this.$nextTick(() => {
            this.drawAllCharts()
          })
        }
      } catch (error) {
        console.error('Erro ao buscar jogos: ', error)
      }
    },

    traduzirDificuldade(valor: string | number) {
      const dificuldade = Number(valor)
      switch (dificuldade) {
        case 0:
          return 'Fácil'
        case 1:
          return 'Média'
        case 2:
          return 'Difícil'
        default:
          return valor
      }
    },

    getDifficultyClass(dificuldade: string | number) {
      const diff = Number(dificuldade)
      switch (diff) {
        case 0: return 'easy'
        case 1: return 'medium'
        case 2: return 'hard'
        default: return 'easy'
      }
    },

    getDifficultyBadgeClass(dificuldade: string | number) {
      const diff = Number(dificuldade)
      switch (diff) {
        case 0: return 'difficulty-easy'
        case 1: return 'difficulty-medium'
        case 2: return 'difficulty-hard'
        default: return 'difficulty-easy'
      }
    },

    getPricePercentage(preco: number) {
      return (preco / this.maxPreco) * 100
    },

    getDurationPercentage(duracao: string) {
      const minutes = parseInt(duracao.replace(/\D/g, '')) || 0
      return (minutes / this.maxDuracao) * 100
    },

    drawAllCharts() {
      this.drawStatsIcons()
      this.drawDifficultyChart()
      this.drawPriceChart()
      this.drawHeaderIcons()
      this.drawRowIcons()
      this.drawEmptyStateIcon()
    },

    drawStatsIcons() {
      const totalCanvas = this.$refs.totalCanvas as HTMLCanvasElement
      if (totalCanvas) {
        const ctx = totalCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fillRect(15, 25, 30, 15)
        ctx.fillRect(10, 30, 10, 5)
        ctx.fillRect(40, 30, 10, 5)
        ctx.beginPath()
        ctx.arc(35, 20, 3, 0, 2 * Math.PI)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(25, 20, 3, 0, 2 * Math.PI)
        ctx.fill()
      }

      const faceisCanvas = this.$refs.faceisCanvas as HTMLCanvasElement
      if (faceisCanvas) {
        const ctx = faceisCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.beginPath()
        ctx.moveTo(30, 10)
        ctx.lineTo(35, 20)
        ctx.lineTo(45, 20)
        ctx.lineTo(37, 28)
        ctx.lineTo(40, 38)
        ctx.lineTo(30, 32)
        ctx.lineTo(20, 38)
        ctx.lineTo(23, 28)
        ctx.lineTo(15, 20)
        ctx.lineTo(25, 20)
        ctx.closePath()
        ctx.fill()
      }

      const precoCanvas = this.$refs.precoCanvas as HTMLCanvasElement
      if (precoCanvas) {
        const ctx = precoCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.font = '24px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('$', 30, 37)
      }

      const duracaoCanvas = this.$refs.duracaoCanvas as HTMLCanvasElement
      if (duracaoCanvas) {
        const ctx = duracaoCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(30, 30, 18, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(30, 30)
        ctx.lineTo(30, 18)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(30, 30)
        ctx.lineTo(40, 30)
        ctx.stroke()
      }
    },

    drawDifficultyChart() {
      const canvas = this.$refs.dificuldadeChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 80

      const faceis = this.listajogos.filter(j => Number(j.Dificuldade) === 0).length
      const medias = this.listajogos.filter(j => Number(j.Dificuldade) === 1).length
      const dificeis = this.listajogos.filter(j => Number(j.Dificuldade) === 2).length
      const total = this.listajogos.length

      if (total === 0) return

      const faceisAngle = (faceis / total) * 2 * Math.PI
      const mediasAngle = (medias / total) * 2 * Math.PI
      const dificeisAngle = (dificeis / total) * 2 * Math.PI

      let currentAngle = 0

      if (faceis > 0) {
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + faceisAngle)
        ctx.closePath()
        ctx.fillStyle = '#28a745'
        ctx.fill()
        currentAngle += faceisAngle
      }

      if (medias > 0) {
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + mediasAngle)
        ctx.closePath()
        ctx.fillStyle = '#ffc107'
        ctx.fill()
        currentAngle += mediasAngle
      }
      if (dificeis > 0) {
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + dificeisAngle)
        ctx.closePath()
        ctx.fillStyle = '#dc3545'
        ctx.fill()
      }

      ctx.fillStyle = '#ffffff'
      ctx.font = '14px Arial'
      ctx.fillText(`Fácil: ${faceis}`, centerX + 100, centerY - 30)
      ctx.fillText(`Média: ${medias}`, centerX + 100, centerY)
      ctx.fillText(`Difícil: ${dificeis}`, centerX + 100, centerY + 30)
    },

    drawPriceChart() {
      const canvas = this.$refs.precoChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const maxHeight = 150
      const barWidth = 40
      const spacing = 10

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      this.listajogos.slice(0, 5).forEach((jogo, index) => {
        const x = 20 + index * (barWidth + spacing)
        const height = (jogo.Preco / this.maxPreco) * maxHeight
        const y = canvas.height - height - 20

        ctx.fillStyle = '#17a2b8'
        ctx.fillRect(x, y, barWidth, height)

        ctx.fillStyle = '#ffffff'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`R$${jogo.Preco}`, x + barWidth / 2, y - 5)
      })
    },

    drawHeaderIcons() {
      const icons = [
        { ref: 'idHeaderCanvas', symbol: '#' },
        { ref: 'nomeHeaderCanvas', symbol: '🎮' },
        { ref: 'duracaoHeaderCanvas', symbol: '⏱' },
        { ref: 'dificuldadeHeaderCanvas', symbol: '⭐' },
        { ref: 'precoHeaderCanvas', symbol: '$' }
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
      this.jogosFiltradosOrdenados.forEach((jogo, index) => {
        const canvas = this.$refs[`rowCanvas${index}`] as HTMLCanvasElement
        if (canvas) {
          const ctx = canvas.getContext('2d')!
          ctx.clearRect(0, 0, 30, 30)
          
          ctx.beginPath()
          ctx.arc(15, 15, 12, 0, 2 * Math.PI)
          const diff = Number(jogo.Dificuldade)
          ctx.fillStyle = diff === 0 ? '#28a745' : diff === 1 ? '#ffc107' : '#dc3545'
          ctx.fill()
          
          ctx.fillStyle = '#ffffff'
          ctx.font = '10px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(jogo.id.toString(), 15, 19)
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
        ctx.strokeRect(25, 35, 50, 25)
        ctx.strokeRect(15, 45, 15, 8)
        ctx.strokeRect(70, 45, 15, 8)
        ctx.beginPath()
        ctx.arc(60, 25, 5, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(40, 25, 5, 0, 2 * Math.PI)
        ctx.stroke()
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

.game-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.game-indicator.easy {
  background-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.6);
}

.game-indicator.medium {
  background-color: #ffc107;
  box-shadow: 0 0 8px rgba(255, 193, 7, 0.6);
}

.game-indicator.hard {
  background-color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.6);
}

.description-text {
  max-width: 250px;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.4;
  display: block;
}

.duration-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.duration-bar {
  flex-grow: 1;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.duration-fill {
  height: 100%;
  background: linear-gradient(90deg, #17a2b8, #20c997);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.duration-text {
  font-weight: bold;
  min-width: 50px;
  font-size: 0.85rem;
}

.difficulty-badge {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.difficulty-easy {
  background-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.difficulty-medium {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.difficulty-hard {
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.price-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.price-badge {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
}

.price-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.price-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #ffc107);
  border-radius: 2px;
  transition: width 0.5s ease;
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

.enhanced-input,
.enhanced-select {
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.enhanced-input:focus,
.enhanced-select:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  color: white;
}

.enhanced-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
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

  .description-text {
    max-width: 200px;
  }
}
</style>

