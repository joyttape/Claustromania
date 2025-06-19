<template>
  <div>
    <div id="spinner" class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <NavHeaderBarVue />

    <div class="d-flex">
      <NavSideBarVue />

      <div class="content flex-grow-1">
        <div class="container-fluid pt-4 px-4">
          <router-link to="/clientes" class="btn btn-outline-light mb-3">← Voltar</router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">
                <div class="d-flex align-items-start gap-4">
                  <form @submit.prevent="salvarAlteracoes" class="flex-grow-1">
                    <h6 class="mb-3">Dados Pessoais</h6>
                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="nome" class="form-label">Nome</label>
                        <input type="text" class="form-control" id="nome" v-model="cliente.nome" required />
                      </div>
                      <div class="col-md-4">
                        <label for="cpf" class="form-label">CPF</label>
                        <input type="text" class="form-control" id="cpf" v-model="cliente.cpf" />
                      </div>
                      <div class="col-md-4">
                        <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                        <input type="date" class="form-control" id="dataNascimento" v-model="cliente.dataNascimento" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="sexo" class="form-label">Sexo</label>
                        <select class="form-select" id="sexo" v-model="cliente.sexo">
                          <option selected disabled value="">Selecione</option>
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                      <div class="col-md-4">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" v-model="cliente.email" required />
                      </div>
                      <div class="col-md-4">
                        <label for="nivel" class="form-label">Nível de Experiência</label>
                        <select class="form-select" id="nivel" v-model="cliente.nivel">
                          <option selected disabled value="">Selecione</option>
                          <option value="Novato">Novato</option>
                          <option value="Intermediario">Intermediário</option>
                          <option value="Experiente">Experiente</option>
                          <option value="Profissional">Profissional</option>
                        </select>
                      </div>
                    </div>

                    <h6 class="mb-3 mt-4">Endereço</h6>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="logradouro" class="form-label">Logradouro</label>
                        <input type="text" class="form-control" id="logradouro" v-model="cliente.logradouro" />
                      </div>
                      <div class="col-md-2">
                        <label for="numero" class="form-label">Número</label>
                        <input type="text" class="form-control" id="numero" v-model="cliente.numero" />
                      </div>
                      <div class="col-md-4">
                        <label for="complemento" class="form-label">Complemento</label>
                        <input type="text" class="form-control" id="complemento" v-model="cliente.complemento" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-3">
                        <label for="bairro" class="form-label">Bairro</label>
                        <input type="text" class="form-control" id="bairro" v-model="cliente.bairro" />
                      </div>
                      <div class="col-md-3">
                        <label for="cidade" class="form-label">Cidade</label>
                        <input type="text" class="form-control" id="cidade" v-model="cliente.cidade" />
                      </div>
                      <div class="col-md-3">
                        <label for="estado" class="form-label">Estado</label>
                        <select class="form-select" id="estado" v-model="cliente.estado">
                          <option selected disabled value="">Selecione</option>
                          <option value="SP">SP</option>
                          <option value="RJ">RJ</option>
                          <!-- ... outros estados ... -->
                        </select>
                      </div>
                      <div class="col-md-3">
                        <label for="cep" class="form-label">CEP</label>
                        <input type="text" class="form-control" id="cep" v-model="cliente.cep" />
                      </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                      <div>
                        <button class="btn btn-success me-2" type="submit">Salvar</button>
                        <button class="btn btn-danger" type="button" @click="excluirCliente">Excluir</button>
                      </div>
                    </div>
                  </form>

                  <!-- Foto -->
                  <div class="position-relative" style="width: 100px; height: 100px; margin-left: 20px;">
                    <label for="foto" class="d-flex align-items-center justify-content-center bg-dark text-white rounded border border-light w-100 h-100" style="cursor: pointer; border-radius: 12px;">
                      <template v-if="fotoPreview">
                        <img :src="fotoPreview" alt="Preview" class="w-100 h-100" style="object-fit: cover; border-radius: 12px;" />
                      </template>
                      <template v-else>
                        <i class="fa fa-camera" style="font-size: 1.5rem;"></i>
                      </template>
                    </label>
                    <input type="file" id="foto" class="d-none" accept="image/*" @change="onFileChange" />
                  </div>

                </div>
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
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const route = useRoute()
const router = useRouter()
const clienteId = route.params.id as string

const cliente = reactive({
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  nivel: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  foto: null as File | null
})

const fotoPreview = ref<string | null>(null)

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    cliente.foto = file
    fotoPreview.value = URL.createObjectURL(file)
  }
}

const carregarCliente = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/clientes/${clienteId}`)
    const dados = response.data

    Object.assign(cliente, {
      nome: dados.nome || dados.Nome || '',
      cpf: dados.cpf || dados.CPF || '',
      dataNascimento: dados.dataNascimento || dados.Data || '',
      sexo: dados.sexo || dados.Sexo || '',
      email: dados.email || dados.Email || '',
      nivel: dados.nivel || dados.Nivel || '',
      logradouro: dados.logradouro || dados.Logradouro || '',
      numero: dados.numero || dados.Numero || '',
      complemento: dados.complemento || dados.Complemento || '',
      bairro: dados.bairro || dados.Bairro || '',
      cidade: dados.cidade || dados.Cidade || '',
      estado: dados.estado || dados.Estado || '',
      cep: dados.cep || dados.CEP || ''
    })
  } catch (error) {
    console.error('Erro ao carregar cliente:', error)
  }
}

const salvarAlteracoes = async () => {
  try {
    await axios.put(`http://localhost:3000/clientes/${clienteId}`, cliente)
    await Swal.fire({
      icon: 'success',
      title: 'Salvo com sucesso!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    })
    router.push('/clientes')
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao salvar!',
      text: 'Tente novamente mais tarde.',
    })
  }
}

const excluirCliente = async () => {
  const resultado = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não pode ser desfeita.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })

  if (resultado.isConfirmed) {
    try {
      await axios.delete(`http://localhost:3000/clientes/${clienteId}`)
      await Swal.fire({
        icon: 'success',
        title: 'Excluído com sucesso!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      })
      router.push('/clientes')
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir!',
        text: 'Tente novamente mais tarde.',
      })
    }
  }
}

onMounted(() => {
  carregarCliente()
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>
