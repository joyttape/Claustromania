<template>
  <div class="sidebar pe-4 pb-3">
    <nav class="navbar bg-secondary navbar-dark">
      <div class="navbar-nav w-100">

        <router-link
          v-if="cargo === 'Estagiário' || cargo === 'Gerente'"
          to="/relatorios"
          class="nav-item nav-link"
        >
          <i class="fa fa-chart-line me-2"></i>Relatórios
        </router-link>

        <router-link to="/reservas" class="nav-item nav-link">
          <i class="fa fa-calendar-check me-2"></i>Reservas
        </router-link>

        <router-link to="/clientes" class="nav-item nav-link">
          <i class="fa fa-users me-2"></i>Jogadores
        </router-link>

        <router-link
          v-if="cargo !== 'Estagiário'"
          to="/caixa"
          class="nav-item nav-link"
        >
          <i class="fa fa-cash-register me-2"></i>Caixa
        </router-link>

        <router-link to="/salas" class="nav-item nav-link">
          <i class="fa fa-door-open me-2"></i>Salas
        </router-link>

        <router-link
          v-if="cargo === 'Gerente'"
          to="/funcionarios"
          class="nav-item nav-link"
        >
          <i class="fa fa-user-tie me-2"></i>Funcionários
        </router-link>

        <router-link to="/unidades" class="nav-item nav-link">
          <i class="fa fa-building me-2"></i>Unidades
        </router-link>

        <router-link to="/jogos" class="nav-item nav-link">
          <i class="fa fa-puzzle-piece me-2"></i>Jogos
        </router-link>

      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'NavSideBar',
  setup() {
    const cargo = ref('')

    onMounted(() => {
      const cargoSalvo = localStorage.getItem('cargoFuncionario')
      cargo.value = cargoSalvo ? cargoSalvo.trim() : ''
    })

    return { cargo }
  },
})
</script>

