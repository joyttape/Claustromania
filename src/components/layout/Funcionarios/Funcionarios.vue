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
                    <h3 class="text-white mb-0">{{ listafuncionarios.length }}</h3>
                    <p class="text-white-50 mb-0">Total de Funcionários</p>
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
                    <h3 class="text-white mb-0">{{ funcionariosContratados }}</h3>
                    <p class="text-white-50 mb-0">Funcionários Ativos</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="ativosCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-warning">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ salarioMedio }}</h3>
                    <p class="text-white-50 mb-0">Salário Médio</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="salarioCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-info">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ folhaPagamento }}</h3>
                    <p class="text-white-50 mb-0">Folha de Pagamento</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="folhaCanvas" width="60" height="60"></canvas>
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
                    <i class="fa fa-chart-pie me-2 text-primary"></i>Distribuição por Turno
                  </h5>
                </div>
                <div class="card-body text-center">
                  <canvas ref="turnoChart" width="400" height="200"></canvas>
                </div>
              </div>
            </div>
            
            <div class="col-xl-4 col-lg-5">
              <div class="card bg-secondary">
                <div class="card-header bg-dark">
                  <h5 class="text-white mb-0">
                    <i class="fa fa-chart-bar me-2 text-primary"></i>Salários por Cargo
                  </h5>
                </div>
                <div class="card-body">
                  <canvas ref="salarioChart" width="300" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>

          <div class="row bg-secondary rounded mx-0 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="mb-0 text-white">
                <i class="fa fa-users me-2 text-primary"></i>Funcionários
                <span class="badge bg-primary ms-2">{{ funcionariosFiltrados.length }}</span>
              </h2>
              <router-link to="/funcionarios/form" class="btn btn-primary ms-auto enhanced-btn">
                <i class="fa fa-plus me-2"></i>Novo Funcionário
              </router-link>
            </div>

            <div class="filter-indicators mb-3" v-if="searchTerm || selectedTurno || selectedStatus || ordemAlfabetica">
              <div class="d-flex flex-wrap gap-2">
                <span v-if="searchTerm" class="badge bg-info">
                  <i class="fa fa-search me-1"></i>Busca: "{{ searchTerm }}"
                  <button @click="searchTerm = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                </span>
                <span v-if="selectedTurno" class="badge bg-warning">
                  <i class="fa fa-clock me-1"></i>Turno: {{ selectedTurno }}
                  <button @click="selectedTurno = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                </span>
                <span v-if="selectedStatus" class="badge bg-secondary">
                  <i class="fa fa-user-check me-1"></i>Status: {{ selectedStatus }}
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
                  placeholder="Pesquisar por nome ou cargo..."
                />
                <div class="search-pulse" v-if="searchTerm"></div>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Turno:</label>
                <select v-model="selectedTurno" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                  <option value="Integral">Integral</option>
                </select>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Status:</label>
                <select v-model="selectedStatus" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="Contratado">Contratado</option>
                  <option value="Demitido">Demitido</option>
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
                        <canvas ref="cargoHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Cargo
                      </div>
                    </th>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="salarioHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Salário
                      </div>
                    </th>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="dataHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Data Contratação
                      </div>
                    </th>
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas ref="turnoHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Turno
                      </div>
                    </th>
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
                  <tr
                    v-for="(funcionario, index) in funcionariosFiltrados"
                    :key="index"
                    class="enhanced-row"
                  >
                    <th>
                      <div class="d-flex align-items-center">
                        <canvas :ref="`rowCanvas${index}`" width="30" height="30" class="me-2"></canvas>
                        {{ funcionario.id }}
                      </div>
                    </th>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="employee-indicator me-2" :class="getStatusClass(funcionario.status)"></div>
                        <div class="employee-info">
                          <div class="employee-name">{{ funcionario.nome }}</div>
                          <div class="employee-tenure">{{ calcularTempo(funcionario.dataContratacao) }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="cargo-badge">
                        <i class="fa fa-briefcase me-1"></i>{{ funcionario.cargo }}
                      </span>
                    </td>
                    <td>
                      <div class="salary-container">
                        <span class="salary-badge">
                          {{ funcionario.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                        </span>
                        <div class="salary-bar">
                          <div class="salary-fill" :style="{ width: getSalaryPercentage(funcionario.salario) + '%' }"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="date-badge">
                        <i class="fa fa-calendar me-1"></i>{{ formatarData(funcionario.dataContratacao) }}
                      </span>
                    </td>
                    <td>
                      <span class="turno-badge" :class="getTurnoBadgeClass(funcionario.turno)">
                        <i :class="getTurnoIcon(funcionario.turno)" class="me-1"></i>{{ funcionario.turno }}
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" :class="funcionario.status ? 'status-active' : 'status-inactive'">
                        <i :class="funcionario.status ? 'fa fa-check-circle' : 'fa fa-times-circle'" class="me-1"></i>
                        {{ funcionario.status ? 'Contratado' : 'Demitido' }}
                      </span>
                    </td>
                    <td>
                      <router-link
                        :to="`/funcionarios/detalhe/${funcionario.id}`"
                        class="btn btn-sm btn-outline-light enhanced-btn-sm"
                      >
                        <i class="fa fa-eye me-1"></i>Visualizar
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="funcionariosFiltrados.length === 0">
                    <td colspan="8" class="text-center text-white py-5">
                      <div class="empty-state">
                        <canvas ref="emptyStateCanvas" width="100" height="100" class="mb-3"></canvas>
                        <h5 class="text-muted">Nenhum funcionário encontrado</h5>
                        <p class="text-muted">Tente ajustar os filtros ou adicionar um novo funcionário.</p>
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
  name: 'Funcionarios',
  data() {
    return {
      listafuncionarios: [] as Array<{
        id: string
        nome: string
        cargo: string
        salario: number
        dataContratacao: string
        turno: string
        status: boolean
      }>,
      searchTerm: '',
      selectedTurno: '',
      selectedStatus: '',
      ordemAlfabetica: ''
    }
  },

  computed: {
    funcionariosFiltrados() {
      let resultado = this.listafuncionarios

      const termo = this.searchTerm.toLowerCase().trim()

      if (termo) {
        resultado = resultado.filter((f) =>
          f.nome.toLowerCase().includes(termo) || f.cargo.toLowerCase().includes(termo)
        )
      }

      if (this.selectedTurno) {
        resultado = resultado.filter(
          (f) => f.turno.toLowerCase().trim() === this.selectedTurno.toLowerCase().trim()
        )
      }

      if (this.selectedStatus) {
        resultado = resultado.filter((f) =>
          f.status === (this.selectedStatus === 'Contratado')
        )
      }

      if (this.ordemAlfabetica === 'asc') {
        resultado = resultado.slice().sort((a, b) => a.nome.localeCompare(b.nome))
      } else if (this.ordemAlfabetica === 'desc') {
        resultado = resultado.slice().sort((a, b) => b.nome.localeCompare(a.nome))
      }

      return resultado
    },

    funcionariosContratados() {
      return this.listafuncionarios.filter(f => f.status).length
    },

    salarioMedio() {
      if (this.listafuncionarios.length === 0) return 'R$ 0,00'
      const funcionariosAtivos = this.listafuncionarios.filter(f => f.status)
      if (funcionariosAtivos.length === 0) return 'R$ 0,00'
      const media = funcionariosAtivos.reduce((total, f) => total + f.salario, 0) / funcionariosAtivos.length
      return media.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },

    folhaPagamento() {
      const total = this.listafuncionarios.filter(f => f.status).reduce((total, f) => total + f.salario, 0)
      return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },

    maxSalario() {
      if (this.listafuncionarios.length === 0) return 5000
      return Math.max(...this.listafuncionarios.map(f => f.salario), 5000)
    }
  },

  methods: {
    async buscarFuncionarios() {
      try {
        const response = await api.get('/api/Funcionario', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.status === 200) {
          this.listafuncionarios = response.data.map((item: any) => ({
            id: item.id,
            nome: item.pessoa?.nome || '',
            cargo: item.cargo || '',
            salario: item.salario || 0,
            dataContratacao: item.dataContratacao || '',
            turno: item.turno || '',
            status: Boolean(item.status)
          }))

          this.$nextTick(() => {
            this.drawAllCharts()
          })
        }
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error)
      }
    },

    formatarData(dataISO: string): string {
      if (!dataISO) return ''
      
      const data = new Date(dataISO)
      const dia = String(data.getDate()).padStart(2, '0')
      const mes = String(data.getMonth() + 1).padStart(2, '0')
      const ano = data.getFullYear()
      
      return `${dia}/${mes}/${ano}`
    },

    calcularTempo(dataContratacao: string): string {
      if (!dataContratacao) return ''
      const hoje = new Date()
      const contratacao = new Date(dataContratacao)
      const diffTime = Math.abs(hoje.getTime() - contratacao.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const anos = Math.floor(diffDays / 365)
      const meses = Math.floor((diffDays % 365) / 30)
      
      if (anos > 0) {
        return `${anos} ano${anos > 1 ? 's' : ''}`
      } else if (meses > 0) {
        return `${meses} mês${meses > 1 ? 'es' : ''}`
      } else {
        return `${diffDays} dia${diffDays > 1 ? 's' : ''}`
      }
    },

    getStatusClass(status: boolean): string {
      return status ? 'active' : 'inactive'
    },

    getTurnoBadgeClass(turno: string): string {
      switch (turno.toLowerCase()) {
        case 'manhã': return 'turno-manha'
        case 'tarde': return 'turno-tarde'
        case 'noite': return 'turno-noite'
        case 'integral': return 'turno-integral'
        default: return 'turno-default'
      }
    },

    getTurnoIcon(turno: string): string {
      switch (turno.toLowerCase()) {
        case 'manhã': return 'fa fa-sun'
        case 'tarde': return 'fa fa-cloud-sun'
        case 'noite': return 'fa fa-moon'
        case 'integral': return 'fa fa-clock'
        default: return 'fa fa-clock'
      }
    },

    getSalaryPercentage(salario: number): number {
      return (salario / this.maxSalario) * 100
    },

    drawAllCharts() {
      this.drawStatsIcons()
      this.drawTurnoChart()
      this.drawSalarioChart()
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
        ctx.beginPath()
        ctx.arc(20, 25, 8, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillRect(15, 33, 10, 12)
        ctx.beginPath()
        ctx.arc(40, 25, 8, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillRect(35, 33, 10, 12)
        ctx.beginPath()
        ctx.arc(30, 20, 6, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillRect(27, 26, 6, 10)
      }

      const ativosCanvas = this.$refs.ativosCanvas as HTMLCanvasElement
      if (ativosCanvas) {
        const ctx = ativosCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.beginPath()
        ctx.arc(30, 25, 10, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillRect(23, 35, 14, 15)
        ctx.strokeStyle = 'rgba(40, 167, 69, 1)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(40, 15)
        ctx.lineTo(45, 20)
        ctx.lineTo(52, 10)
        ctx.stroke()
      }

      const salarioCanvas = this.$refs.salarioCanvas as HTMLCanvasElement
      if (salarioCanvas) {
        const ctx = salarioCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fillRect(15, 20, 25, 15)
        ctx.fillRect(20, 25, 25, 15)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 2
        ctx.strokeRect(15, 20, 25, 15)
        ctx.strokeRect(20, 25, 25, 15)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('$', 32, 32)
      }

      const folhaCanvas = this.$refs.folhaCanvas as HTMLCanvasElement
      if (folhaCanvas) {
        const ctx = folhaCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fillRect(20, 15, 20, 30)
        ctx.fillStyle = 'rgba(23, 162, 184, 1)'
        ctx.fillRect(20, 15, 20, 8)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            ctx.fillRect(22 + j * 5, 26 + i * 5, 3, 3)
          }
        }
      }
    },

    drawTurnoChart() {
      const canvas = this.$refs.turnoChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 80

      const turnos = {
        'Manhã': this.listafuncionarios.filter(f => f.turno.toLowerCase() === 'manhã').length,
        'Tarde': this.listafuncionarios.filter(f => f.turno.toLowerCase() === 'tarde').length,
        'Noite': this.listafuncionarios.filter(f => f.turno.toLowerCase() === 'noite').length,
        'Integral': this.listafuncionarios.filter(f => f.turno.toLowerCase() === 'integral').length
      }

      const total = this.listafuncionarios.length
      if (total === 0) return

      const cores = ['#ffc107', '#fd7e14', '#6f42c1', '#17a2b8']
      let currentAngle = 0

      Object.entries(turnos).forEach(([turno, count], index) => {
        if (count > 0) {
          const angle = (count / total) * 2 * Math.PI
          
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
          ctx.closePath()
          ctx.fillStyle = cores[index]
          ctx.fill()
          
          currentAngle += angle
        }
      })

      ctx.fillStyle = '#ffffff'
      ctx.font = '12px Arial'
      Object.entries(turnos).forEach(([turno, count], index) => {
        ctx.fillText(`${turno}: ${count}`, centerX + 100, centerY - 30 + index * 20)
      })
    },

    drawSalarioChart() {
      const canvas = this.$refs.salarioChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const maxHeight = 150
      const barWidth = 50
      const spacing = 10

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cargos: { [key: string]: number[] } = {}
      this.listafuncionarios.forEach(f => {
        if (!cargos[f.cargo]) cargos[f.cargo] = []
        cargos[f.cargo].push(f.salario)
      })

      const cargosSalarios = Object.entries(cargos).slice(0, 4).map(([cargo, salarios]) => ({
        cargo,
        media: salarios.reduce((a, b) => a + b, 0) / salarios.length
      }))

      const maxSalario = Math.max(...cargosSalarios.map(c => c.media))

      cargosSalarios.forEach((item, index) => {
        const x = 20 + index * (barWidth + spacing)
        const height = (item.media / maxSalario) * maxHeight
        const y = canvas.height - height - 30

        ctx.fillStyle = ['#28a745', '#17a2b8', '#ffc107', '#dc3545'][index]
        ctx.fillRect(x, y, barWidth, height)

        ctx.fillStyle = '#ffffff'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        const valor = item.media.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        ctx.fillText(valor, x + barWidth / 2, y - 5)
        ctx.fillText(item.cargo.substring(0, 8), x + barWidth / 2, canvas.height - 10)
      })
    },

    drawHeaderIcons() {
      const icons = [
        { ref: 'idHeaderCanvas', symbol: '#' },
        { ref: 'nomeHeaderCanvas', symbol: '👤' },
        { ref: 'cargoHeaderCanvas', symbol: '💼' },
        { ref: 'salarioHeaderCanvas', symbol: '💰' },
        { ref: 'dataHeaderCanvas', symbol: '📅' },
        { ref: 'turnoHeaderCanvas', symbol: '🕐' },
        { ref: 'statusHeaderCanvas', symbol: '✓' }
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
      this.funcionariosFiltrados.forEach((funcionario, index) => {
        const canvas = this.$refs[`rowCanvas${index}`] as HTMLCanvasElement
        if (canvas) {
          const ctx = canvas.getContext('2d')!
          ctx.clearRect(0, 0, 30, 30)
          
          ctx.beginPath()
          ctx.arc(15, 15, 12, 0, 2 * Math.PI)
          ctx.fillStyle = funcionario.status ? '#28a745' : '#dc3545'
          ctx.fill()
          
          ctx.fillStyle = '#ffffff'
          ctx.font = '10px Arial'
          ctx.textAlign = 'center'
          const iniciais = funcionario.nome.split(' ').map(n => n[0]).join('').substring(0, 2)
          ctx.fillText(iniciais, 15, 19)
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
        ctx.beginPath()
        ctx.arc(50, 35, 15, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.strokeRect(35, 50, 30, 30)
        ctx.beginPath()
        ctx.moveTo(35, 35)
        ctx.lineTo(65, 65)
        ctx.moveTo(65, 35)
        ctx.lineTo(35, 65)
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

    this.buscarFuncionarios()
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

.employee-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.employee-indicator.active {
  background-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.6);
}

.employee-indicator.inactive {
  background-color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.6);
}

.employee-info {
  display: flex;
  flex-direction: column;
}

.employee-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.employee-tenure {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.cargo-badge, .date-badge {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.salary-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.salary-badge {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
}

.salary-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.salary-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffc107, #28a745);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.turno-badge {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.turno-manha {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.turno-tarde {
  background-color: rgba(253, 126, 20, 0.2);
  color: #fd7e14;
  border: 1px solid rgba(253, 126, 20, 0.3);
}

.turno-noite {
  background-color: rgba(111, 66, 193, 0.2);
  color: #6f42c1;
  border: 1px solid rgba(111, 66, 193, 0.3);
}

.turno-integral {
  background-color: rgba(23, 162, 184, 0.2);
  color: #17a2b8;
  border: 1px solid rgba(23, 162, 184, 0.3);
}

.turno-default {
  background-color: rgba(108, 117, 125, 0.2);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
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
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
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

.empty-state {
  padding: 2rem;
}

.empty-state i {
  opacity: 0.3;
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

  .employee-info {
    align-items: flex-start;
  }

  .salary-container {
    align-items: flex-start;
  }
}

.enhanced-btn:focus,
.enhanced-btn-sm:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}
</style>

