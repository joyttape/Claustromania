<template>
  <div class="container-fluid position-relative d-flex p-0">
    <!-- Sign Up Start -->
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
                  placeholder="jhondoe"
                  v-model="username"
                  :class="{ 'is-invalid': usernameError }"
                />
                <label for="floatingText">Username</label>
                <div class="invalid-feedback">{{ usernameError }}</div>
              </div>

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

              <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="form-check">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="lembrar" />
                  <label class="form-check-label" for="exampleCheck1">Lembre de mim</label>
                </div>
                <a href="#">Esqueci minha senha</a>
              </div>

              <button type="submit" class="btn btn-primary py-3 w-100 mb-4">Sign Up</button>
            </form>

            <p class="text-center mb-0">
              Já possui uma conta? Faça login
              <router-link to="/">aqui</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const email = ref('')
const senha = ref('')
const lembrar = ref(false)

const usernameError = ref('')
const emailError = ref('')
const senhaError = ref('')

const handleSignUp = () => {
  usernameError.value = ''
  emailError.value = ''
  senhaError.value = ''

  let valid = true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!username.value.trim()) {
    usernameError.value = 'Informe o nome de usuário.'
    valid = false
  }

  if (!email.value || !emailRegex.test(email.value)) {
    emailError.value = 'Informe um e-mail válido.'
    valid = false
  }

  if (!senha.value) {
    senhaError.value = 'Informe uma senha.'
    valid = false
  }

  if (valid) {
    console.log('Cadastro enviado:', {
      username: username.value,
      email: email.value,
      senha: senha.value,
      lembrar: lembrar.value,
    })

    router.push('/')
  }
}
</script>
