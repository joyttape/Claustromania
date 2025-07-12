<template>
  <div>
    <div
      id="spinner"
      class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem;"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />

      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/salas" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <h6 class="mb-3">Dados da sala</h6>
                <form @submit.prevent="salvarAlteracoes">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="numero" class="form-label">Nome da Sala</label>
                      <input
                        type="text"
                        class="form-control"
                        id="numero"
                        v-model="sala.numero"
                        required
                      />
                    </div>

                    <div class="col-md-6">
                      <label for="jogadores" class="form-label">Capacidade de Jogadores</label>
                      <input
                        type="number"
                        class="form-control"
                        id="jogadores"
                        v-model.number="sala.capacidade"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="status" class="form-label">Status</label>
                    <select id="status" class="form-select" v-model="sala.ativa" required>
                      <option :value="true">Ativo</option>
                      <option :value="false">Inativo</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label for="unidade" class="form-label">Unidade</label>
                    <select id="unidade" class="form-select" v-model="sala.unidadeId" required>
                      <option disabled value="">Selecione uma unidade</option>
                      <option v-for="unidade in listaUnidades" :key="unidade.id" :value="unidade.id">
                        {{ unidade.nome }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                      <label class="form-label mb-0">Jogos Associados</label>
                      <button
                        v-if="!modoEdicaoJogos"
                        type="button"
                        class="btn btn-outline-light btn-sm"
                        @click="iniciarEdicaoJogos"
                      >
                        <i class="fa fa-edit me-1"></i> Editar Jogos
                      </button>
                    </div>

                    <div v-if="!modoEdicaoJogos" class="bg-dark rounded p-3">
                      <div class="text-muted small mb-2">
                        {{ jogosSelecionados.length }} jogo{{ jogosSelecionados.length !== 1 ? 's' : '' }} selecionado{{ jogosSelecionados.length !== 1 ? 's' : '' }}
                      </div>
                      <div v-if="jogosSelecionados.length > 0" class="row g-2">
                        <div v-for="jogo in jogosSelecionados" :key="jogo.id" class="col-md-6 col-lg-4">
                          <div class="card bg-success text-white">
                            <div class="card-body p-2">
                              <div class="d-flex align-items-center">
                                <i class="fas fa-check-circle me-2 text-white"></i>
                                <div>
                                  <div class="fw-bold small">{{ jogo.nome }}</div>
                                  <div class="small">
                                    <span class="badge bg-light text-dark me-1">{{ dificuldadeTexto(jogo.dificuldade) || 'N/A' }}</span>
                                    <span class="badge bg-warning text-dark">{{ formatarPreco(jogo.preco) }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center text-muted py-3">
                        <i class="fas fa-gamepad fa-2x mb-2"></i>
                        <p class="mb-0">Nenhum jogo associado a esta sala</p>
                      </div>
                    </div>

                    <div v-else>
                      <div class="text-muted small mb-3">
                        Selecione os jogos que estarão disponíveis nesta sala ({{ jogosSelecionados.length }} selecionado{{ jogosSelecionados.length !== 1 ? 's' : '' }})
                      </div>
                      
                      <div class="mb-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Pesquisar jogos..."
                          v-model="filtroJogos"
                        />
                      </div>

                      <div class="mb-3">
                        <button type="button" class="btn btn-outline-primary btn-sm me-2" @click="selecionarTodos">
                          ✓ Selecionar Todos
                        </button>
                        <button type="button" class="btn btn-outline-primary btn-sm" @click="limparSelecao">
                          ✗ Limpar Seleção
                        </button>
                      </div>

                      <div class="row g-3" style="max-height: 400px; overflow-y: auto;">
                        <div 
                          v-for="jogo in jogosFiltrados" 
                          :key="jogo.id" 
                          class="col-md-6 col-lg-4"
                        >
                          <div 
                            class="card h-100 jogo-card"
                            :class="{ 'jogo-selecionado': isJogoSelecionado(jogo.id) }"
                            @click="toggleJogo(jogo)"
                            style="cursor: pointer; transition: all 0.3s ease;"
                          >
                            <div class="card-body p-3">
                              <div class="d-flex align-items-start">
                                <input
                                  type="checkbox"
                                  class="form-check-input me-3 mt-1"
                                  :checked="isJogoSelecionado(jogo.id)"
                                  @click.stop
                                  @change="toggleJogo(jogo)"
                                  style="transform: scale(1.2);"
                                />
                                <div class="flex-grow-1">
                                  <h6 class="card-title mb-2 text-truncate" :title="jogo.nome">
                                    {{ jogo.nome }}
                                  </h6>
                                  <div class="small text-muted mb-1">
                                    <span class="badge bg-info me-2">{{ dificuldadeTexto(jogo.dificuldade) || 'N/A' }}</span>
                                    <span class="badge bg-success">{{ formatarPreco(jogo.preco) }}</span>
                                  </div>
                                  <div class="small text-white">
                                    ⏱️ {{ jogo.duracao || 'N/A' }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="jogosFiltrados.length === 0" class="text-center text-muted py-4">
                        <i class="fas fa-search fa-2x mb-2"></i>
                        <p>Nenhum jogo encontrado com o filtro "{{ filtroJogos }}"</p>
                      </div>

                      <div class="d-flex gap-2 mt-3">
                        <button
                          type="button"
                          class="btn btn-success"
                          @click="confirmarEdicaoJogos"
                        >
                          <i class="fas fa-check me-1"></i> Confirmar
                        </button>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          @click="cancelarEdicaoJogos"
                        >
                          <i class="fas fa-times me-1"></i> Cancelar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-start mt-3">
                    <button type="submit" class="btn btn-success me-2">
                      <i class="fas fa-save me-1"></i> Salvar
                    </button>
                    <button type="button" class="btn btn-danger" @click="excluirSala">
                      <i class="fas fa-trash me-1"></i> Excluir
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <FooterBarVue />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'
import { api } from '@/common/http'

interface Jogo {
  id: string;
  nome: string;       
  dificuldade?: number; 
  preco?: number;    
  duracao?: string;    
}

interface Unidade {
  id: string;          
  nome: string;
}

const route = useRoute();
const router = useRouter();
const salaId = route.params.id as string;

const sala = reactive({
  numero: '',          
  capacidade: 0,  
  ativa: true,  
  jogosIds: [] as string[],
  unidadeId: ''        
});

const listaJogos = ref<Jogo[]>([]);
const listaUnidades = ref<Unidade[]>([]); 
const filtroJogos = ref('');

const modoEdicaoJogos = ref(false);
const jogosSelecionadosAntes = ref<string[]>([]); 

const jogosFiltrados = computed(() => {
  if (!filtroJogos.value) return listaJogos.value;

  const filtro = filtroJogos.value.toLowerCase();
  return listaJogos.value.filter(jogo =>
    jogo.nome.toLowerCase().includes(filtro) ||
    dificuldadeTexto(jogo.dificuldade).toLowerCase().includes(filtro))
});

const jogosSelecionados = computed(() => {
  return listaJogos.value.filter(jogo => sala.jogosIds.includes(jogo.id));
});

const formatarPreco = (preco?: number) => {
  if (!preco) return 'Grátis';
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const isJogoSelecionado = (jogoId: string) => {
  return sala.jogosIds.includes(jogoId);
};

const toggleJogo = (jogo: Jogo) => {
  const index = sala.jogosIds.findIndex(id => id === jogo.id);
  if (index > -1) {
    sala.jogosIds.splice(index, 1);
  } else {
    sala.jogosIds.push(jogo.id);
  }
};

const selecionarTodos = () => {
  jogosFiltrados.value.forEach(jogo => {
    if (!isJogoSelecionado(jogo.id)) {
      sala.jogosIds.push(jogo.id); 
    }
  });
};

const limparSelecao = () => {
  sala.jogosIds = [];
};

const iniciarEdicaoJogos = () => {
  jogosSelecionadosAntes.value = [...sala.jogosIds];
  modoEdicaoJogos.value = true;
};

const confirmarEdicaoJogos = () => {
  modoEdicaoJogos.value = false;
  filtroJogos.value = '';
};

const cancelarEdicaoJogos = () => {
  sala.jogosIds = [...jogosSelecionadosAntes.value];
  modoEdicaoJogos.value = false;
  filtroJogos.value = '';
};

const buscarJogos = async () => {
  try {
    const response = await api.get('/api/Jogo');
    if (response.status === 200) {
      listaJogos.value = response.data.map((jogo: any) => ({
        id: jogo.id,
        nome: jogo.nome, 
        dificuldade: jogo.dificuldade,
        preco: jogo.preco,
        duracao: jogo.duracao
      }));
    }
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    Swal.fire('Erro', 'Não foi possível carregar os jogos.', 'error');
  }
};

const buscarUnidades = async () => {
  try {
    const response = await api.get('/api/Unidade');
    if (response.status === 200) {
      listaUnidades.value = response.data.map((unidade: any) => ({
        id: unidade.id,
        nome: unidade.nome
      }));
    }
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    Swal.fire('Erro', 'Não foi possível carregar as unidades.', 'error');
  }
};

const carregarSala = async () => {
  try {
    const responseSala = await api.get(`/api/Sala/${salaId}`);
    const dataSala = responseSala.data;

    sala.numero = dataSala.nome ?? ''; 
    sala.capacidade = dataSala.capacidade ?? 0; 
    sala.ativa = dataSala.ativa ?? true;
    sala.unidadeId = dataSala.fkUnidade ?? '';

    const responseSalaJogos = await api.get('/api/SalaJogo');
    sala.jogosIds = responseSalaJogos.data 
      .filter((item: any) => item.fkSala === salaId)
      .map((item: any) => item.fkJogo.toString());

  } catch (error) {
    console.error('Erro ao carregar sala:', error);
    Swal.fire('Erro', 'Falha ao carregar dados da sala', 'error');
  }
};

const salvarAlteracoes = async () => {
  try {
    if (!salaId || !sala.unidadeId) { 
      throw new Error('IDs essenciais não fornecidos');
    }

    const dadosParaSalvar = {
      id: salaId,
      nome: sala.numero,
      capacidade: Number(sala.capacidade), 
      ativa: sala.ativa,
      fkUnidade: sala.unidadeId 
    };

    await api.put(`/api/Sala/${salaId}`, dadosParaSalvar);

    const { data: relacionamentos } = await api.get('/api/SalaJogo');
    
    await Promise.all(
      relacionamentos
        .filter((rel: any) => rel.fkSala === salaId)
        .map((rel: any) => api.delete(`/api/SalaJogo/${rel.id}`))
    );

    if (sala.jogosIds.length > 0) {
      await Promise.all(
        sala.jogosIds.map(jogoId =>
          api.post('/api/SalaJogo', {
            fkSala: salaId,
            fkJogo: jogoId
          })
        )
      );
    }

    await Swal.fire('Sucesso!', 'Sala atualizada com sucesso', 'success');
    router.push('/salas');
  } catch (error) {
    console.error('Erro:', error);
    Swal.fire('Erro', 'Falha ao salvar alterações', 'error');
  }
};

const dificuldadeTexto = (valor: number | undefined) => {
  switch (valor) {
    case 0: return 'Fácil'
    case 1: return 'Médio'
    case 2: return 'Difícil'
    default: return 'N/A'
  }
}

const excluirSala = async () => {
  const confirmacao = await Swal.fire({
    title: 'Confirmar exclusão',
    text: 'Esta ação não pode ser desfeita',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Sim, excluir'
  });

  if (!confirmacao.isConfirmed) return;

  try {
    const { data: relacionamentos } = await api.get('/api/SalaJogo');
    await Promise.all(
      relacionamentos
        .filter((rel: any) => rel.fkSala === salaId)
        .map((rel: any) => api.delete(`/api/SalaJogo/${rel.id}`))
    );

    await api.delete(`/api/Sala/${salaId}`);

    await Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Sala excluída',
      timer: 1500,
      showConfirmButton: false
    });
    
    router.push('/salas');
    
  } catch {
    await Swal.fire({
      icon: 'error',
      title: 'Falha',
      text: 'Não foi possível excluir',
      confirmButtonText: 'Entendi'
    });
  }
};


onMounted(async () => {
  await buscarJogos()
  await carregarSala()
  await buscarUnidades()

  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

<style scoped>
.jogo-card {
  background-color: #292d30;
  border: 2px solid transparent;
  color: white;
}

.jogo-card:hover {
  border-color: #F20519;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.jogo-selecionado {
  border-color: #8a141e !important;
  background-color: #292d30 !important;
}

.jogo-selecionado:hover {
  border-color: #8a141e !important;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.badge {
  font-size: 0.7rem;
}

.row.g-3::-webkit-scrollbar {
  width: 8px;
}

.row.g-3::-webkit-scrollbar-track {
  background: #495057;
  border-radius: 4px;
}

.row.g-3::-webkit-scrollbar-thumb {
  background: #6c757d;
  border-radius: 4px;
}

.row.g-3::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>
