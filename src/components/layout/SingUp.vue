<template>
  <div class="container-fluid position-relative d-flex p-0">
    <div class="container-fluid">
      <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh">
        <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          <div class="bg-secondary rounded p-4 p-sm-5 my-4 mx-3 text-light">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <img class="logo" src="../imgs/logo1.png" alt="Logo" />
              <h3>Sign Up</h3>
            </div>

            <form @submit.prevent="handleSignUp">
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="floatingText"
                  placeholder="Nome"
                  v-model="username"
                  disabled
                />
                <label for="floatingText">Nome</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  type="email"
                  class="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  v-model="email"
                  disabled
                />
                <label for="floatingInput">E-mail</label>
              </div>

              <div class="form-floating mb-4">
                <input
                  type="password"
                  class="form-control"
                  id="floatingPassword"
                  placeholder="Senha"
                  v-model="senha"
                  :class="{ 'is-invalid': senhaError }"
                />
                <label for="floatingPassword">Senha</label>
                <div class="invalid-feedback">{{ senhaError }}</div>
              </div>

              <button type="submit" class="btn btn-primary py-3 w-100 mb-4">Sign Up</button>
            </form>

            <p class="text-center mb-0">
              Já possui uma conta?
              <router-link to="/">Faça login aqui</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()

const username = ref('')
const email = ref('')
const senha = ref('')
const lembrar = ref(false)

const senhaError = ref('')

onMounted(() => {
  const emailFromQuery = route.query.email as string
  if (emailFromQuery) {
    email.value = emailFromQuery
    buscarFuncionario(emailFromQuery)
  }
})

const buscarFuncionario = async (emailProcurado: string) => {
  try {
    const response = await axios.get('http://localhost:3000/funcionarios')
    const funcionarios = response.data
    const funcionario = funcionarios.find((f: any) => f.email === emailProcurado)

    if (funcionario) {
      username.value = funcionario.nome || ''
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Funcionário não encontrado',
        text: 'Verifique o link ou entre em contato com o administrador.',
      })
      router.push('/')
    }
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao buscar dados',
      text: 'Tente novamente mais tarde.',
    })
  }
}

const handleSignUp = async () => {
  senhaError.value = ''

  if (!senha.value) {
    senhaError.value = 'Informe uma senha.'
    return
  }

  try {
    const response = await axios.get('http://localhost:3000/funcionarios')
    const funcionario = response.data.find((f: any) => f.email === email.value)

    if (!funcionario) {
      Swal.fire({
        icon: 'error',
        title: 'Funcionário não encontrado',
        text: 'Não foi possível cadastrar a senha.',
      })
      return
    }

    await axios.patch(`http://localhost:3000/funcionarios/${funcionario.id}`, {
      senha: senha.value,
    })

    Swal.fire({
      icon: 'success',
      title: 'Senha cadastrada com sucesso!',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      router.push('/')
    })
  } catch (error) {
    console.error('Erro ao salvar senha:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao salvar',
      text: 'Tente novamente mais tarde.',
    })
  }
}
</script>

<style scoped>
::v-deep input.form-control:disabled {
  background-color: black !important;
  color: inherit !important;
  opacity: 1;
}
</style>
