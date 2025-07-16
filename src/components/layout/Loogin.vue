<template>
  <div class="login-container">
    <div class="black-background"></div>
    
    <div class="background-image">
      <img src="../imgs/sua-imagem.png" alt="" class="bg-png" />
    </div>

    <div class="container-fluid position-relative d-flex p-0">
      <div class="container-fluid">
        <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh">
          <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            
            <div class="login-card bg-secondary rounded p-4 p-sm-5 my-4 mx-3 text-light">
              
              <div class="login-header">
                <div class="logo-container">
                  <img class="logo" src="../imgs/logo1.png" alt="Logo" />
                </div>
                <div class="title-container">
                  <h3 class="login-title mb-0">Log In</h3>
                  <div class="title-accent"></div>
                </div>
              </div>

              <form @submit.prevent="handleLogin" class="login-form">
                
                <div class="form-group">
                  <div class="input-wrapper">
                    <div class="input-icon">
                      <i class="fas fa-envelope"></i>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        type="email"
                        class="form-control custom-input"
                        id="floatingInput"
                        placeholder="name@example.com"
                        v-model="email"
                        :class="{ 'is-invalid': emailError, 'has-value': email }"
                      />
                      <label for="floatingInput">E-mail</label>
                      <div class="invalid-feedback">{{ emailError }}</div>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <div class="input-wrapper">
                    <div class="input-icon">
                      <i class="fas fa-lock"></i>
                    </div>
                    <div class="form-floating mb-4">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control custom-input"
                        id="floatingPassword"
                        placeholder="Password"
                        v-model="senha"
                        :class="{ 'is-invalid': senhaError, 'has-value': senha }"
                      />
                      <label for="floatingPassword">Senha</label>
                      <div class="invalid-feedback">{{ senhaError }}</div>
                    </div>
                    <div class="password-toggle" @click="togglePassword" v-if="senha">
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary py-3 w-100 mb-4 login-btn" :disabled="isLoading">
                  <div class="btn-content">
                    <div v-if="isLoading" class="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span v-else>
                      <i class="fas fa-sign-in-alt me-2"></i>
                      Log In
                    </span>
                  </div>
                </button>

                <div class="form-links">
                  <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">Esqueceu a senha?</a>
                </div>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.black-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  z-index: -2;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}


.bg-png {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  max-height: 80%;
  opacity: 0.1;
  object-fit: contain;
}

.login-card {
  position: relative;
  animation: fadeInUp 0.6s ease-out;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 50px;
  width: auto;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.logo:hover {
  transform: scale(1.05);
}

.title-container {
  position: relative;
}

.login-title {
  color: #ffffff;
  font-weight: 600;
  font-size: 1.5rem;
}

.title-accent {
  width: 30px;
  height: 3px;
  background: #C1000F;
  margin-top: 5px;
  border-radius: 2px;
  animation: expandAccent 0.8s ease-out 0.3s both;
}

@keyframes expandAccent {
  from {
    width: 0;
  }
  to {
    width: 30px;
  }
}

.login-form {
  position: relative;
}

.form-group {
  position: relative;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  color: #6c757d;
  transition: color 0.3s ease;
}

.custom-input {
  padding-left: 45px !important;
  padding-right: 45px !important;
  transition: all 0.3s ease !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.05) !important;
}

.custom-input:focus {
  border-color: #C1000F !important;
  box-shadow: 0 0 0 0.2rem rgba(156, 3, 3, 0.25) !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

.custom-input.has-value,
.custom-input:focus {
  padding-top: 1.625rem !important;
  padding-bottom: 0.625rem !important;
}

.form-floating label {
  left: 45px !important;
  transition: all 0.3s ease !important;
}

.custom-input:focus + label,
.custom-input.has-value + label {
  color: #ffffff !important;
}

.custom-input:focus ~ .input-icon,
.custom-input.has-value ~ .input-icon {
  color: #C1000F;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 20px;
  cursor: pointer;
  color: #6c757d;
  transition: color 0.3s ease;
  z-index: 10;
}

.password-toggle:hover {
  color: #C1000F;
}

.login-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(163, 6, 6, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: #ffffff;
  border-radius: 50%;
  animation: loadingDots 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loadingDots {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.form-links {
  text-align: center;
}

.forgot-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  position: relative;
}

.forgot-link:hover {
  color:#C1000F ;
  text-decoration: none;
}

.forgot-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #C1000F;
  transition: width 0.3s ease;
}

.forgot-link:hover::after {
  width: 100%;
}

.custom-input.is-invalid {
  animation: subtleShake 0.5s ease-in-out;
}

@keyframes subtleShake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

@media (max-width: 768px) {
  .login-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .title-accent {
    margin: 5px auto 0;
  }
  
  .bg-png {
    max-width: 90%;
    max-height: 60%;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { api } from '@/common/http'

const email = ref('')
const senha = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const emailError = ref('')
const senhaError = ref('')

const router = useRouter()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleForgotPassword = async () => {
  await Swal.fire({
    icon: 'info',
    title: 'Esqueceu a senha?',
    html: `
      <p>Para recuperar sua senha, entre em contato com o suporte:</p>
      <br>
      <p><strong>Email:</strong> claustromania@empresa.com</p>
      <p><strong>Telefone:</strong> (69) 90924-0934</p>
      <p><strong>WhatsApp:</strong> (11) 9 90924-0943</p>
      <br>
      <p><small>Horário de atendimento: Segunda a Sexta, 8h às 18h</small></p>
    `,
    confirmButtonText: 'Entendi',
    confirmButtonColor: '#0d6efd'
  })
}

const handleLogin = async () => {
  isLoading.value = true
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

  if (!valid) {
    isLoading.value = false
    return
  }

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
      isLoading.value = false
      return
    }

    if (!funcionario.status) {
      await Swal.fire({
        icon: 'error',
        title: 'Acesso Negado',
        text: 'Funcionário inativo não pode acessar o sistema.'
      })
      isLoading.value = false
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
      isLoading.value = false
      return
    }

    if (funcionario.senha !== senha.value) {
      await Swal.fire({
        icon: 'error',
        title: 'Senha incorreta',
        text: 'Tente novamente.'
      })
      isLoading.value = false
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
  } finally {
    isLoading.value = false
  }
}
</script>


