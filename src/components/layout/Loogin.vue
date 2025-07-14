<template>
  <div class="container-fluid position-relative d-flex p-0">
    <div class="container-fluid">
      <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh">
        <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          <div class="bg-secondary rounded p-4 p-sm-5 my-4 mx-3 text-light">

            <div class="d-flex align-items-center justify-content-between mb-3">
              <img class="logo" src="../imgs/logo1.png" alt="Logo" />
              <h3 class="mb-0">Log In</h3>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="form-floating mb-3">
                <input
                  type="email"
                  class="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  v-model="email"
                  :class="{ 'is-invalid': emailError }"
                />
                <label for="floatingInput">E-mail</label>
                <div class="invalid-feedback">{{ emailError }}</div>
              </div>

              <div class="form-floating mb-4">
                <input
                  type="password"
                  class="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  v-model="senha"
                  :class="{ 'is-invalid': senhaError }"
                />
                <label for="floatingPassword">Senha</label>
                <div class="invalid-feedback">{{ senhaError }}</div>
              </div>

              <button type="submit" class="btn btn-primary py-3 w-100 mb-4">Log In</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { api } from '@/common/http'

const email = ref('')
const senha = ref('')

const emailError = ref('')
const senhaError = ref('')


const router = useRouter()

const handleLogin = async () => {
  emailError.value = ''
  senhaError.value = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  let valid = true

  if (!email.value || !emailRegex.test(email.value)) {
    emailError.value = 'Informe um e-mail válido.'
    valid = false
  }

  if (!senha.value) {
    senhaError.value = 'Informe a senha.'
    valid = false
  }

  if (!valid) return

  try {
    const response = await api.get('/api/Funcionario')
    const funcionarios = response.data

    const funcionario = funcionarios.find((f: any) => f.pessoa?.email === email.value)

    if (!funcionario) {
      await Swal.fire({
        icon: 'error',
        title: 'E-mail não encontrado',
        text: 'Verifique se digitou corretamente ou cadastre-se.'
      })
      return
    }

    if (!funcionario.status) {
      await Swal.fire({
        icon: 'error',
        title: 'Acesso Negado',
        text: 'Funcionário inativo não pode acessar o sistema.'
      })
      return
    }

    if (!funcionario.senha || funcionario.senha.trim() === '') {
      await Swal.fire({
        icon: 'info',
        title: 'Senha não cadastrada',
        text: 'Vamos redirecionar para que você cadastre sua senha.',
        confirmButtonText: 'OK'
      })
      router.push({ path: '/singup', query: { email: email.value } })
      return
    }

    if (funcionario.senha !== senha.value) {
      await Swal.fire({
        icon: 'error',
        title: 'Senha incorreta',
        text: 'Tente novamente.'
      })
      return
    }

    await Swal.fire({
      icon: 'success',
      title: 'Login realizado com sucesso!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })

    localStorage.setItem('cargoFuncionario', funcionario.cargo)
    localStorage.setItem('funcionarioId', funcionario.id)
    localStorage.setItem('funcionarioNome', funcionario.pessoa?.nome)

    router.push('/reservas')

  } catch (error) {
    console.error('Erro ao verificar login:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro no login',
      text: 'Tente novamente mais tarde.'
    })
  }
}
</script>

<style scoped>
.logo {
  height: auto;
}
</style>
