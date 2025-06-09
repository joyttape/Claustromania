<template>
  <div class="container-fluid position-relative d-flex p-0">
    <!-- Sign In Start -->
    <div class="container-fluid">
      <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh">
        <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          <div class="bg-secondary rounded p-4 p-sm-5 my-4 mx-3 text-light">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <img class="logo" src="../imgs/logo1.png" alt="Logo" />
              <h3>Log In</h3>
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

              <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="form-check">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="lembrar" />
                  <label class="form-check-label" for="exampleCheck1">Lembre de mim</label>
                </div>
                <a href="#">Esqueci minha senha</a>
              </div>

              <button type="submit" class="btn btn-primary py-3 w-100 mb-4">Log In</button>
            </form>

            <p class="text-center mb-0">
              Não possui uma conta?
              <router-link to="/singup">Crie aqui</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Sign In End -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const senha = ref('')
const lembrar = ref(false)

const emailError = ref('')
const senhaError = ref('')

const router = useRouter()

const handleLogin = () => {
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

  if (valid) {
    console.log('Logando com:', {
      email: email.value,
      senha: senha.value,
      lembrar: lembrar.value,
    })
    // Exemplo de redirecionamento após login
    router.push('/blank')
  }
}
</script>
