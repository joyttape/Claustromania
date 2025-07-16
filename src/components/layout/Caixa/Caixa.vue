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
                    <h3 class="text-white mb-0">{{ listaCaixas.length }}</h3>
                    <p class="text-white-50 mb-0">Total de Caixas</p>
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
                    <h3 class="text-white mb-0">{{ caixasAbertos }}</h3>
                    <p class="text-white-50 mb-0">Caixas Abertos</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="abertosCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-warning">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ totalTransacoes }}</h3>
                    <p class="text-white-50 mb-0">Total em Transações</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="transacoesCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-info">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ mediaTransacoes }}</h3>
                    <p class="text-white-50 mb-0">Média por Caixa</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="mediaCanvas" width="60" height="60"></canvas>
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
                    <i class="fa fa-chart-pie me-2 text-primary"></i>Status dos Caixas
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
                    <i class="fa fa-chart-bar me-2 text-primary"></i>Valores por Caixa
                  </h5>
                </div>
                <div class="card-body">
                  <canvas ref="valoresChart" width="300" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>

          <div class="row bg-secondary rounded mx-0 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="mb-0 text-white">
                <i class="fa fa-cash-register me-2 text-primary"></i>Caixas
                <span class="badge bg-primary ms-2">{{ caixasFiltrados.length }}</span>
              </h2>
              
              <router-link to="/caixa/form" class="btn btn-primary ms-auto enhanced-btn">
                <i class="fa fa-plus me-2"></i>Abrir Caixa
              </router-link>
            </div>

            <div class="filter-indicators mb-3" v-if="searchTerm || selectedStatus || filtroHoje">
              <div class="d-flex flex-wrap gap-2">
                <span v-if="searchTerm" class="badge bg-info">
                  <i class="fa fa-search me-1"></i>Busca: "{{ searchTerm }}"
                  <button @click="searchTerm = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                </span>
                <span v-if="selectedStatus" class="badge bg-warning">
                  <i class="fa fa-filter me-1"></i>Status: {{ selectedStatus }}
                  <button @click="selectedStatus = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                </span>
                <span v-if="filtroHoje" class="badge bg-success">
                  <i class="fa fa-calendar me-1"></i>Abertos hoje
                  <button @click="filtroHoje = false" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
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
                  placeholder="Pesquisar por ID ou funcionário..."
                />
                <div class="search-pulse" v-if="searchTerm"></div>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Status:</label>
                <select v-model="selectedStatus" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="Aberto">Aberto</option>
                  <option value="Fechado">Fechado</option>
                </select>
              </div>

              <div class="form-check text-white ms-3">
                <input class="form-check-input enhanced-checkbox" type="checkbox" v-model="filtroHoje" id="hojeCheck" />
                <label class="form-check-label" for="hojeCheck">Abertos hoje</label>
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
                          <canvas ref="aberturaHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                          Abertura
                        </div>
                      </th>
                      <th>Fechamento</th>
                      <th>
                        <div class="d-flex align-items-center">
                          <canvas ref="valorHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                          Valor Inicial
                        </div>
                      </th>
                      <th>Valor Final</th>
                      <th>
                        <div class="d-flex align-items-center">
                          <canvas ref="transacaoHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                          Total Transações
                        </div>
                      </th>
                      <th>
                        <div class="d-flex align-items-center">
                          <canvas ref="statusHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                          Status
                        </div>
                      </th>
                      <th>Funcionário</th>
                      <th>Unidade</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(caixa, index) in caixasFiltrados" :key="index" class="enhanced-row">
                      <td>
                        <div class="d-flex align-items-center">
                          <canvas :ref="`rowCanvas${index}`" width="30" height="30" class="me-2"></canvas>
                          {{ caixa.id }}
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="cash-indicator me-2" :class="getStatusClass(caixa.status)"></div>
                          {{ caixa.nome }}
                        </div>
                      </td>
                      <td>
                        <span class="datetime-badge">
                          <i class="fa fa-clock me-1"></i>{{ formatDateTime(caixa.dataHoraAbertura) }}
                        </span>
                      </td>
                      <td>
                        <span v-if="caixa.dataHoraFechamento" class="datetime-badge">
                          <i class="fa fa-clock me-1"></i>{{ formatDateTime(caixa.dataHoraFechamento) }}
                        </span>
                        <span v-else class="text-muted">-</span>
                      </td>
                      <td>
                        <div class="value-container">
                          <span class="value-badge initial">
                            {{ formatCurrency(caixa.valorInicial ?? 0) }}
                          </span>
                          <div class="value-bar">
                            <div class="value-fill initial" :style="{ width: getValuePercentage(caixa.valorInicial ?? 0) + '%' }"></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="value-container">
                          <span class="value-badge final">
                            {{ formatCurrency(caixa.valorFinal ?? 0) }}
                          </span>
                          <div class="value-bar">
                            <div class="value-fill final" :style="{ width: getValuePercentage(caixa.valorFinal ?? 0) + '%' }"></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="transaction-container">
                          <span class="transaction-badge">
                            <i class="fa fa-exchange-alt me-1"></i>{{ formatCurrency(caixa.totalTransacoes ?? 0) }}
                          </span>
                          <div class="transaction-bar">
                            <div class="transaction-fill" :style="{ width: getTransactionPercentage(caixa.totalTransacoes ?? 0) + '%' }"></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="status-badge" :class="getStatusBadgeClass(caixa.status)">
                          <i :class="getStatusIcon(caixa.status)" class="me-1"></i>{{ caixa.status }}
                        </span>
                      </td>
                      <td>
                        <span class="employee-badge">
                          <i class="fa fa-user me-1"></i>{{ caixa.funcionario?.pessoa.nome }}
                        </span>
                      </td>
                      <td>
                        <span class="unit-badge">
                          <i class="fa fa-building me-1"></i>{{ caixa.unidade?.nome }}
                        </span>
                      </td>
                      <td>
                        <router-link 
                          :to="`/caixa/detalhe/${caixa.id}`" 
                          class="btn btn-sm btn-outline-light enhanced-btn-sm"
                        >
                          <i class="fa fa-eye me-1"></i>Visualizar
                        </router-link>
                      </td>
                    </tr>
                    <tr v-if="caixasFiltrados.length === 0">
                      <td colspan="11" class="text-center text-white py-5">
                        <div class="empty-state">
                          <canvas ref="emptyStateCanvas" width="100" height="100" class="mb-3"></canvas>
                          <h5 class="text-muted">Nenhum caixa encontrado</h5>
                          <p class="text-muted">Tente ajustar os filtros ou abra um novo caixa.</p>
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
import { api } from '@/common/http'

enum StatusCaixa {
  Aberto = 'Aberto',
  Fechado = 'Fechado'
}

interface CaixaResponse {
  id: string
  nome?: string
  dataHoraAbertura: string
  dataHoraFechamento?: string | null
  valorInicial?: number
  valorFinal?: number
  totalTransacoes?: number
  status?: string
  observacoes?: string
  unidade?: {
    id: string
    nome: string
  }
  funcionario?: {
    id: string
    pessoa: {
      nome: string
    }
  }
}

export default defineComponent({
  name: 'Caixas',
  data() {
    return {
      carregando: true,
      listaCaixas: [] as CaixaResponse[],
      searchTerm: '',
      selectedStatus: '',
      filtroHoje: false
    }
  },
  computed: {
    caixasFiltrados(): CaixaResponse[] {
      let resultado = [...this.listaCaixas]

      const termo = this.searchTerm.toLowerCase().trim()
      if (termo) {
        resultado = resultado.filter(
          (caixa) =>
            caixa.id.toLowerCase().includes(termo) ||
            caixa.nome?.toLowerCase().includes(termo) ||
            caixa.funcionario?.pessoa?.nome.toLowerCase().includes(termo)
        )
      }

      if (this.selectedStatus) {
        resultado = resultado.filter(
          (caixa) => caixa.status?.toLowerCase() === this.selectedStatus.toLowerCase()
        )
      }

      if (this.filtroHoje) {
        const hoje = new Date().toISOString().split('T')[0]
        resultado = resultado.filter((caixa) => {
          const data = new Date(caixa.dataHoraAbertura).toISOString().split('T')[0]
          return data === hoje
        })
      }

      resultado.sort(
        (a, b) =>
          new Date(b.dataHoraAbertura).getTime() - new Date(a.dataHoraAbertura).getTime()
      )

      return resultado
    },

    caixasAbertos() {
      return this.listaCaixas.filter(c => c.status === 'Aberto').length
    },

    totalTransacoes() {
      const total = this.listaCaixas.reduce((sum, c) => sum + (c.totalTransacoes ?? 0), 0)
      return this.formatCurrency(total)
    },

    mediaTransacoes() {
      if (this.listaCaixas.length === 0) return 'R$ 0,00'
      const total = this.listaCaixas.reduce((sum, c) => sum + (c.totalTransacoes ?? 0), 0)
      const media = total / this.listaCaixas.length
      return this.formatCurrency(media)
    },

    maxValor() {
      if (this.listaCaixas.length === 0) return 1000
      const valores = this.listaCaixas.flatMap(c => [c.valorInicial ?? 0, c.valorFinal ?? 0])
      return Math.max(...valores, 1000)
    },

    maxTransacao() {
      if (this.listaCaixas.length === 0) return 1000
      const transacoes = this.listaCaixas.map(c => c.totalTransacoes ?? 0)
      return Math.max(...transacoes, 1000)
    }
  },
  methods: {
    async buscarCaixas() {
      try {
        const response = await api.get<CaixaResponse[]>('/api/Caixa', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.status === 200) {
          this.listaCaixas = response.data.map((item) => ({
            id: item.id,
            nome: item.nome || 'Caixa sem nome',
            dataHoraAbertura: item.dataHoraAbertura,
            dataHoraFechamento: item.dataHoraFechamento || null,
            valorInicial: item.valorInicial || 0,
            valorFinal: item.valorFinal || 0,
            totalTransacoes: item.totalTransacoes || 0,
            status: this.determinarStatusCaixa(item),
            observacoes: item.observacoes || '',
            unidade: item.unidade || { id: '', nome: 'N/A' },
            funcionario: item.funcionario || { id: '', pessoa: { nome: 'N/A' } }
          }))

          this.$nextTick(() => {
            this.drawAllCharts()
          })
        }
      } catch (error) {
        console.error('Erro ao buscar caixas:', error)
      } finally {
        this.carregando = false
      }
    },

    determinarStatusCaixa(caixa: CaixaResponse): string {
      if (!caixa.dataHoraFechamento) return StatusCaixa.Aberto
      return caixa.status || StatusCaixa.Fechado
    },

    formatDateTime(dateTimeString: string): string {
      if (!dateTimeString) return '-'
      const date = new Date(dateTimeString)
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatCurrency(value: number): string {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      })
    },

    getStatusClass(status?: string): string {
      return status === 'Aberto' ? 'open' : 'closed'
    },

    getStatusBadgeClass(status?: string): string {
      return status === 'Aberto' ? 'status-open' : 'status-closed'
    },

    getStatusIcon(status?: string): string {
      return status === 'Aberto' ? 'fa fa-unlock' : 'fa fa-lock'
    },

    getValuePercentage(value: number): number {
      return (value / this.maxValor) * 100
    },

    getTransactionPercentage(value: number): number {
      return (value / this.maxTransacao) * 100
    },

    drawAllCharts() {
      this.drawStatsIcons()
      this.drawStatusChart()
      this.drawValoresChart()
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
        ctx.fillRect(15, 25, 30, 20)
        ctx.fillRect(20, 20, 20, 5)
        ctx.fillRect(25, 30, 10, 10)
        ctx.fillRect(18, 32, 4, 6)
        ctx.fillRect(38, 32, 4, 6)
      }

      const abertosCanvas = this.$refs.abertosCanvas as HTMLCanvasElement
      if (abertosCanvas) {
        const ctx = abertosCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(30, 25, 8, Math.PI, 0, false)
        ctx.stroke()
        ctx.fillRect(22, 30, 16, 12)
        ctx.fillStyle = 'rgba(40, 167, 69, 1)'
        ctx.beginPath()
        ctx.arc(30, 36, 3, 0, 2 * Math.PI)
        ctx.fill()
      }

      const transacoesCanvas = this.$refs.transacoesCanvas as HTMLCanvasElement
      if (transacoesCanvas) {
        const ctx = transacoesCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.font = '24px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('$', 30, 37)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(15, 15)
        ctx.lineTo(25, 15)
        ctx.moveTo(22, 12)
        ctx.lineTo(25, 15)
        ctx.lineTo(22, 18)
        ctx.stroke()
      }

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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ;[{x: 10, y: 45}, {x: 20, y: 35}, {x: 30, y: 25}, {x: 40, y: 30}, {x: 50, y: 20}].forEach(point => {
          ctx.beginPath()
          ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
          ctx.fill()
        })
      }
    },

    drawStatusChart() {
      const canvas = this.$refs.statusChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 80

      const abertos = this.caixasAbertos
      const fechados = this.listaCaixas.length - abertos
      const total = this.listaCaixas.length

      if (total === 0) return

      const abertosAngle = (abertos / total) * 2 * Math.PI
      const fechadosAngle = (fechados / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, 0, abertosAngle)
      ctx.closePath()
      ctx.fillStyle = '#28a745'
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, abertosAngle, abertosAngle + fechadosAngle)
      ctx.closePath()
      ctx.fillStyle = '#dc3545'
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = '14px Arial'
      ctx.fillText(`Abertos: ${abertos}`, centerX + 100, centerY - 10)
      ctx.fillText(`Fechados: ${fechados}`, centerX + 100, centerY + 20)
    },

    drawValoresChart() {
      const canvas = this.$refs.valoresChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const maxHeight = 150
      const barWidth = 40
      const spacing = 10

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      this.listaCaixas.slice(0, 5).forEach((caixa, index) => {
        const x = 20 + index * (barWidth + spacing)
        const valorInicial = caixa.valorInicial ?? 0
        const valorFinal = caixa.valorFinal ?? 0
        
        const heightInicial = (valorInicial / this.maxValor) * maxHeight
        const heightFinal = (valorFinal / this.maxValor) * maxHeight
        
        const yInicial = canvas.height - heightInicial - 20
        const yFinal = canvas.height - heightFinal - 20

        ctx.fillStyle = '#17a2b8'
        ctx.fillRect(x, yInicial, barWidth / 2 - 2, heightInicial)

        ctx.fillStyle = '#28a745'
        ctx.fillRect(x + barWidth / 2 + 2, yFinal, barWidth / 2 - 2, heightFinal)

        ctx.fillStyle = '#ffffff'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`C${index + 1}`, x + barWidth / 2, canvas.height - 5)
      })

      ctx.fillStyle = '#17a2b8'
      ctx.fillRect(20, 10, 10, 10)
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px Arial'
      ctx.fillText('Inicial', 35, 19)
      
      ctx.fillStyle = '#28a745'
      ctx.fillRect(80, 10, 10, 10)
      ctx.fillStyle = '#ffffff'
      ctx.fillText('Final', 95, 19)
    },

    drawHeaderIcons() {
      const icons = [
        { ref: 'idHeaderCanvas', symbol: '#' },
        { ref: 'nomeHeaderCanvas', symbol: '💰' },
        { ref: 'aberturaHeaderCanvas', symbol: '🔓' },
        { ref: 'valorHeaderCanvas', symbol: '$' },
        { ref: 'transacaoHeaderCanvas', symbol: '↔' },
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
      this.caixasFiltrados.forEach((caixa, index) => {
        const canvas = this.$refs[`rowCanvas${index}`] as HTMLCanvasElement
        if (canvas) {
          const ctx = canvas.getContext('2d')!
          ctx.clearRect(0, 0, 30, 30)
          
          ctx.beginPath()
          ctx.arc(15, 15, 12, 0, 2 * Math.PI)
          ctx.fillStyle = caixa.status === 'Aberto' ? '#28a745' : '#dc3545'
          ctx.fill()
          
          ctx.fillStyle = '#ffffff'
          ctx.font = '12px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('$', 15, 19)
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
        ctx.strokeRect(25, 40, 50, 35)
        ctx.strokeRect(35, 30, 30, 10)
        ctx.strokeRect(45, 50, 10, 15)
        ctx.strokeRect(30, 55, 8, 10)
        ctx.strokeRect(62, 55, 8, 10)
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

    this.buscarCaixas()
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

.cash-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.cash-indicator.open {
  background-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.6);
}

.cash-indicator.closed {
  background-color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.6);
}

.datetime-badge, .employee-badge, .unit-badge {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.value-container, .transaction-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.value-badge, .transaction-badge {
  font-size: 0.85rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 8px;
}

.value-badge.initial {
  background-color: rgba(23, 162, 184, 0.2);
  color: #17a2b8;
}

.value-badge.final {
  background-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.transaction-badge {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.value-bar, .transaction-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.value-fill.initial {
  height: 100%;
  background: linear-gradient(90deg, #17a2b8, #20c997);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.value-fill.final {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.transaction-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffc107, #fd7e14);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-open {
  background-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.status-closed {
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.enhanced-checkbox {
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.enhanced-checkbox:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
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

  .value-container, .transaction-container {
    align-items: flex-start;
  }
}
</style>