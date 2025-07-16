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
                    <h3 class="text-white mb-0">{{ listaclientes.length }}</h3>
                    <p class="text-white-50 mb-0">Total de Jogadores</p>
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
                    <h3 class="text-white mb-0">{{ jogadoresMasculinos }}</h3>
                    <p class="text-white-50 mb-0">Jogadores Masculinos</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="masculinosCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-warning">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ jogadoresFemininos }}</h3>
                    <p class="text-white-50 mb-0">Jogadoras Femininas</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="femininosCanvas" width="60" height="60"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card stats-card bg-info">
                <div class="card-body d-flex align-items-center">
                  <div class="stats-info flex-grow-1">
                    <h3 class="text-white mb-0">{{ idadeMedia }}</h3>
                    <p class="text-white-50 mb-0">Idade Média</p>
                  </div>
                  <div class="stats-canvas">
                    <canvas ref="idadeCanvas" width="60" height="60"></canvas>
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
                    <i class="fa fa-chart-pie me-2 text-primary"></i>Distribuição por Sexo
                  </h5>
                </div>
                <div class="card-body text-center">
                  <canvas ref="sexoChart" width="400" height="200"></canvas>
                </div>
              </div>
            </div>
            
            <div class="col-xl-4 col-lg-5">
              <div class="card bg-secondary">
                <div class="card-header bg-dark">
                  <h5 class="text-white mb-0">
                    <i class="fa fa-chart-bar me-2 text-primary"></i>Faixas Etárias
                  </h5>
                </div>
                <div class="card-body">
                  <canvas ref="idadeChart" width="300" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>

          <div class="row bg-secondary rounded mx-0 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="mb-0 text-white">
                <i class="fa fa-user-tie me-2 text-primary"></i>Jogadores
                <span class="badge bg-primary ms-2">{{ jogadoresFiltradosOrdenados.length }}</span>
              </h2>

              <router-link to="/clientes/formclientes" class="btn btn-primary ms-auto enhanced-btn">
                <i class="fa fa-plus me-2"></i>Novo Jogador
              </router-link>
            </div>

            <div class="filter-indicators mb-3" v-if="searchTerm || selectedSexo || ordemAlfabetica">
              <div class="d-flex flex-wrap gap-2">
                <span v-if="searchTerm" class="badge bg-info">
                  <i class="fa fa-search me-1"></i>Busca: "{{ searchTerm }}"
                  <button @click="searchTerm = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
                </span>
                <span v-if="selectedSexo" class="badge bg-warning">
                  <i class="fa fa-filter me-1"></i>Sexo: {{ selectedSexo }}
                  <button @click="selectedSexo = ''" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;"></button>
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
                  placeholder="Pesquisar por nome ou CPF..."
                />
                <div class="search-pulse" v-if="searchTerm"></div>
              </div>

              <div class="d-flex align-items-center">
                <label class="text-white me-2 fw-semibold">Sexo:</label>
                <select v-model="selectedSexo" class="form-select enhanced-select">
                  <option value="">Todos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
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
                    <th scope="col">
                      <div class="d-flex align-items-center">
                        <canvas ref="idHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        ID
                      </div>
                    </th>
                    <th scope="col" class="sortable-header" @click="ordenarNome()">
                      <div class="d-flex align-items-center">
                        <canvas ref="nomeHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Nome
                        <i :class="`fa ms-2 ${getSortIcon()}`"></i>
                      </div>
                    </th>
                    <th scope="col">
                      <div class="d-flex align-items-center">
                        <canvas ref="cpfHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        CPF
                      </div>
                    </th>
                    <th scope="col">
                      <div class="d-flex align-items-center">
                        <canvas ref="sexoHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Sexo
                      </div>
                    </th>
                    <th scope="col">
                      <div class="d-flex align-items-center">
                        <canvas ref="nascimentoHeaderCanvas" width="20" height="20" class="me-2"></canvas>
                        Data Nascimento
                      </div>
                    </th>
                    <th scope="col">E-mail</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(jogador, index) in jogadoresFiltradosOrdenados" :key="index" class="enhanced-row">
                    <th scope="col">
                      <div class="d-flex align-items-center">
                        <canvas :ref="`rowCanvas${index}`" width="30" height="30" class="me-2"></canvas>
                        {{ jogador.id }}
                      </div>
                    </th>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="player-indicator me-2" :class="getSexoClass(jogador.sexo)"></div>
                        <div class="player-info">
                          <div class="player-name">{{ jogador.nome }}</div>
                          <div class="player-experience">Nível {{ jogador.nivelExperiencia }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="cpf-badge">
                        <i class="fa fa-id-card me-1"></i>{{ formatarCPF(jogador.cpf) }}
                      </span>
                    </td>
                    <td>
                      <span class="sexo-badge" :class="getSexoBadgeClass(jogador.sexo)">
                        <i :class="getSexoIcon(jogador.sexo)" class="me-1"></i>{{ jogador.sexo }}
                      </span>
                    </td>
                    <td>
                      <div class="date-container">
                        <span class="date-badge">
                          <i class="fa fa-calendar me-1"></i>{{ formatarData(jogador.dataNascimento) }}
                        </span>
                        <div class="age-indicator">
                          <span class="age-text">{{ calcularIdade(jogador.dataNascimento) }} anos</span>
                          <div class="age-bar">
                            <div class="age-fill" :style="{ width: getAgePercentage(jogador.dataNascimento) + '%' }"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="email-badge">
                        <i class="fa fa-envelope me-1"></i>{{ jogador.email }}
                      </span>
                    </td>
                    <td>
                      <router-link :to="`/clientes/detalhe/${jogador.id}`" class="btn btn-sm btn-outline-light enhanced-btn-sm">
                        <i class="fa fa-eye me-1"></i>Visualizar
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="jogadoresFiltradosOrdenados.length === 0">
                    <td colspan="7" class="text-center text-white py-5">
                      <div class="empty-state">
                        <canvas ref="emptyStateCanvas" width="100" height="100" class="mb-3"></canvas>
                        <h5 class="text-muted">Nenhum jogador encontrado</h5>
                        <p class="text-muted">Tente ajustar os filtros ou cadastre um novo jogador.</p>
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
  name: 'Clientes',
  data() {
    return {
      listaclientes: [] as Array<{
        id: string
        nome: string
        cpf: string
        sexo: string
        dataNascimento: string
        email: string
        nivelExperiencia: number
      }>,
      searchTerm: '',
      selectedSexo: '',
      ordemAlfabetica: ''
    }
  },

  computed: {
    jogadoresFiltradosOrdenados() {
      let resultado = this.listaclientes
      const termo = this.searchTerm.toLowerCase().trim()

      if (termo) {
        resultado = resultado.filter(j =>
          j.nome.toLowerCase().includes(termo) || j.cpf.includes(termo))
      }

      if (this.selectedSexo) {
        resultado = resultado.filter(j =>
          j.sexo.toLowerCase().trim() === this.selectedSexo.toLowerCase().trim()
        )
      }

      if (this.ordemAlfabetica === 'asc') {
        resultado = resultado.slice().sort((a, b) => a.nome.localeCompare(b.nome))
      } else if (this.ordemAlfabetica === 'desc') {
        resultado = resultado.slice().sort((a, b) => b.nome.localeCompare(a.nome))
      }

      return resultado
    },

    jogadoresMasculinos() {
      return this.listaclientes.filter(j => j.sexo.toLowerCase() === 'masculino').length
    },

    jogadoresFemininos() {
      return this.listaclientes.filter(j => j.sexo.toLowerCase() === 'feminino').length
    },

    idadeMedia() {
      if (this.listaclientes.length === 0) return '0 anos'
      const idades = this.listaclientes.map(j => this.calcularIdade(j.dataNascimento))
      const media = idades.reduce((total, idade) => total + idade, 0) / idades.length
      return Math.round(media) + ' anos'
    }
  },

  methods: {
    async buscarClientes() {
      try {
        const response = await api.get('/api/Cliente')
        if (response.status === 200) {
          this.listaclientes = response.data.map((item: any) => ({
            id: item.id,
            nome: item.pessoa?.nome || '',
            cpf: item.pessoa?.cpf || '',
            sexo: item.pessoa?.sexo || '',
            dataNascimento: item.pessoa?.dataNascimento || '',
            email: item.pessoa?.email || '',
            nivelExperiencia: item.nivelExperiencia || 0
          }))

          this.$nextTick(() => {
            this.drawAllCharts()
          })
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      }
    },
    
    formatarData(dataISO: string): string {
      if (!dataISO) return '';
      
      try {
        const [dataParte] = dataISO.split('T');
        const [ano, mes, dia] = dataParte.split('-');
        
        if (ano && mes && dia) {
          return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
        }
      } catch (e) {
        console.error('Erro ao formatar data:', e);
      }
      
      return dataISO;
    },

    formatarCPF(cpf: string): string {
      if (!cpf) return '';
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    calcularIdade(dataNascimento: string): number {
      if (!dataNascimento) return 0;
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      return idade;
    },

    getAgePercentage(dataNascimento: string): number {
      const idade = this.calcularIdade(dataNascimento);
      return Math.min((idade / 80) * 100, 100);
    },

    getSexoClass(sexo: string): string {
      return sexo.toLowerCase() === 'masculino' ? 'male' : 'female';
    },

    getSexoBadgeClass(sexo: string): string {
      return sexo.toLowerCase() === 'masculino' ? 'sexo-male' : 'sexo-female';
    },

    getSexoIcon(sexo: string): string {
      return sexo.toLowerCase() === 'masculino' ? 'fa fa-mars' : 'fa fa-venus';
    },
    
    ordenarNome() {
      this.ordemAlfabetica = this.ordemAlfabetica === 'asc' ? 'desc' : 'asc'
    },
    
    getSortIcon() {
      if (this.ordemAlfabetica === 'asc') return 'fa-sort-up text-primary'
      if (this.ordemAlfabetica === 'desc') return 'fa-sort-down text-primary'
      return 'fa-sort text-muted'
    },

    drawAllCharts() {
      this.drawStatsIcons()
      this.drawSexoChart()
      this.drawIdadeChart()
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
        ctx.arc(20, 20, 8, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillRect(15, 28, 10, 15)
        ctx.beginPath()
        ctx.arc(40, 20, 8, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillRect(35, 28, 10, 15)
      }

      const masculinosCanvas = this.$refs.masculinosCanvas as HTMLCanvasElement
      if (masculinosCanvas) {
        const ctx = masculinosCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.beginPath()
        ctx.arc(30, 30, 15, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.lineWidth = 3
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.beginPath()
        ctx.moveTo(40, 20)
        ctx.lineTo(50, 10)
        ctx.moveTo(45, 10)
        ctx.lineTo(50, 10)
        ctx.lineTo(50, 15)
        ctx.stroke()
      }

      const femininosCanvas = this.$refs.femininosCanvas as HTMLCanvasElement
      if (femininosCanvas) {
        const ctx = femininosCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(30, 25, 12, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(30, 37)
        ctx.lineTo(30, 50)
        ctx.moveTo(25, 45)
        ctx.lineTo(35, 45)
        ctx.stroke()
      }

      const idadeCanvas = this.$refs.idadeCanvas as HTMLCanvasElement
      if (idadeCanvas) {
        const ctx = idadeCanvas.getContext('2d')!
        ctx.clearRect(0, 0, 60, 60)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fillRect(15, 15, 30, 25)
        ctx.fillStyle = 'rgba(23, 162, 184, 1)'
        ctx.fillRect(15, 15, 30, 8)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.font = '8px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('AGE', 30, 32)
      }
    },

    drawSexoChart() {
      const canvas = this.$refs.sexoChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 80

      const masculinos = this.jogadoresMasculinos
      const femininos = this.jogadoresFemininos
      const total = this.listaclientes.length

      if (total === 0) return

      const masculinosAngle = (masculinos / total) * 2 * Math.PI
      const femininosAngle = (femininos / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, 0, masculinosAngle)
      ctx.closePath()
      ctx.fillStyle = '#17a2b8'
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, masculinosAngle, masculinosAngle + femininosAngle)
      ctx.closePath()
      ctx.fillStyle = '#e83e8c'
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = '14px Arial'
      ctx.fillText(`Masculino: ${masculinos}`, centerX + 100, centerY - 10)
      ctx.fillText(`Feminino: ${femininos}`, centerX + 100, centerY + 20)
    },

    drawIdadeChart() {
      const canvas = this.$refs.idadeChart as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      const maxHeight = 150
      const barWidth = 50
      const spacing = 10

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const faixas = {
        '18-25': 0,
        '26-35': 0,
        '36-50': 0,
        '50+': 0
      }

      this.listaclientes.forEach(jogador => {
        const idade = this.calcularIdade(jogador.dataNascimento)
        if (idade <= 25) faixas['18-25']++
        else if (idade <= 35) faixas['26-35']++
        else if (idade <= 50) faixas['36-50']++
        else faixas['50+']++
      })

      const maxCount = Math.max(...Object.values(faixas))
      if (maxCount === 0) return

      Object.entries(faixas).forEach(([faixa, count], index) => {
        const x = 20 + index * (barWidth + spacing)
        const height = (count / maxCount) * maxHeight
        const y = canvas.height - height - 30

        ctx.fillStyle = ['#28a745', '#ffc107', '#fd7e14', '#dc3545'][index]
        ctx.fillRect(x, y, barWidth, height)
        ctx.fillStyle = '#ffffff'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(count.toString(), x + barWidth / 2, y - 5)
        ctx.fillText(faixa, x + barWidth / 2, canvas.height - 10)
      })
    },

    drawHeaderIcons() {
      const icons = [
        { ref: 'idHeaderCanvas', symbol: '#' },
        { ref: 'nomeHeaderCanvas', symbol: '👤' },
        { ref: 'cpfHeaderCanvas', symbol: '🆔' },
        { ref: 'sexoHeaderCanvas', symbol: '⚥' },
        { ref: 'nascimentoHeaderCanvas', symbol: '📅' }
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
      this.jogadoresFiltradosOrdenados.forEach((jogador, index) => {
        const canvas = this.$refs[`rowCanvas${index}`] as HTMLCanvasElement
        if (canvas) {
          const ctx = canvas.getContext('2d')!
          ctx.clearRect(0, 0, 30, 30)
          
          ctx.beginPath()
          ctx.arc(15, 15, 12, 0, 2 * Math.PI)
          ctx.fillStyle = jogador.sexo.toLowerCase() === 'masculino' ? '#17a2b8' : '#e83e8c'
          ctx.fill()
          
          ctx.fillStyle = '#ffffff'
          ctx.font = '10px Arial'
          ctx.textAlign = 'center'
          const iniciais = jogador.nome.split(' ').map(n => n[0]).join('').substring(0, 2)
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
        ctx.arc(50, 30, 15, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.strokeRect(35, 45, 30, 35)
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

    this.buscarClientes()
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

.player-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.player-indicator.male {
  background-color: #17a2b8;
  box-shadow: 0 0 8px rgba(23, 162, 184, 0.6);
}

.player-indicator.female {
  background-color: #e83e8c;
  box-shadow: 0 0 8px rgba(232, 62, 140, 0.6);
}

.player-info {
  display: flex;
  flex-direction: column;
}

.player-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.player-experience {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.cpf-badge, .email-badge, .date-badge {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.sexo-badge {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.sexo-male {
  background-color: rgba(23, 162, 184, 0.2);
  color: #17a2b8;
  border: 1px solid rgba(23, 162, 184, 0.3);
}

.sexo-female {
  background-color: rgba(232, 62, 140, 0.2);
  color: #e83e8c;
  border: 1px solid rgba(232, 62, 140, 0.3);
}

.date-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.age-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.age-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  min-width: 50px;
}

.age-bar {
  flex-grow: 1;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.age-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);
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
  letter-spacing: 1px;
}

.enhanced-table thead td {
  gap: 2px;
  letter-spacing: 1px;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}

.sortable-header:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
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

  .player-info {
    align-items: flex-start;
  }

  .date-container {
    align-items: flex-start;
  }
}

.sortable-header:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.enhanced-btn:focus,
.enhanced-btn-sm:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}
</style>


