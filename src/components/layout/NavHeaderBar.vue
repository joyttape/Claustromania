<template>
  <nav class="navbar navbar-expand bg-secondary navbar-dark sticky-top px-4 py-0">
    <a href="index.html" class="navbar-brand d-flex d-lg-none me-4">
      <h2 class="text-primary mb-0"><i class="fa fa-user-edit"></i></h2>
    </a>
    <a href="#" class="sidebar-toggler flex-shrink-0">
      <i class="fa fa-bars"></i>
    </a>

    <div class="navbar-nav align-items-center ms-auto">
      <div class="nav-item dropdown">
        <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
          <img class="rounded-circle me-lg-2" src="../imgs/profile.png" alt="" style="width: 40px; height: 40px;">
          <span class="d-none d-lg-inline-flex">{{ funcionarioNome }}</span>
        </a>
        <div class="dropdown-menu dropdown-menu-end border-0 rounded-0 rounded-bottom">
          <router-link :to="`/funcionarios/detalhe/${funcionarioId}`" class="dropdown-item">
            Meu Perfil
          </router-link>

          <button @click="confirmarSaida" class="dropdown-item">
            Sair
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const funcionarioId = ref('')
const funcionarioNome = ref('')
const router = useRouter()

onMounted(() => {
  funcionarioId.value = localStorage.getItem('funcionarioId') || ''
  funcionarioNome.value = localStorage.getItem('funcionarioNome') || 'Usuário'
})

function confirmarSaida() {
  Swal.fire({
    title: 'Tem certeza que deseja sair?',
    text: "Você precisará fazer login novamente para acessar o sistema.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, sair',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear()
      router.push('/')
    }
  })
}
</script>
