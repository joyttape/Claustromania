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
                <router-link to="/funcionarios" class="btn btn-outline-light mb-3">
                                    ← Voltar
                </router-link>

          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">

                <h6 class="mb-4">Detalhes Funcionário</h6>
                
                <div class="d-flex align-items-start gap-4">
                    
                  <form @submit.prevent="salvarAlteracoes" class="flex-grow-1">
                    <h6 class="mb-3">Dados Pessoais</h6>
                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="nome" class="form-label">Nome</label>
                        <input type="text" class="form-control" id="nome" v-model="funcionario.nome" required />
                      </div>
                      <div class="col-md-4">
                        <label for="cpf" class="form-label">CPF</label>
                        <input type="text" class="form-control" id="cpf" v-model="funcionario.cpf" />
                      </div>
                      <div class="col-md-4">
                        <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                        <input type="date" class="form-control" id="dataNascimento" v-model="funcionario.dataNascimento" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="sexo" class="form-label">Sexo</label>
                        <select class="form-select" id="sexo" v-model="funcionario.sexo">
                          <option selected disabled value="">Selecione</option>
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                      <div class="col-md-4">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" v-model="funcionario.email" required />
                      </div>
                      <div class="col-md-4">
                        <label for="cargo" class="form-label">Cargo</label>
                        <input type="text" class="form-control" id="cargo" v-model="funcionario.cargo" required />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-4">
                        <label for="salario" class="form-label">Salário</label>
                        <input type="number" class="form-control" id="salario" step="0.01" v-model="funcionario.salario" />
                      </div>
                      <div class="col-md-4">
                        <label for="dataContratacao" class="form-label">Data da Contratação</label>
                        <input type="date" class="form-control" id="dataContratacao" v-model="funcionario.dataContratacao" />
                      </div>
                      <div class="col-md-4">
                        <label for="turno" class="form-label">Turno</label>
                        <select class="form-select" id="turno" v-model="funcionario.turno">
                          <option selected disabled value="">Selecione</option>
                          <option value="manha">Manhã</option>
                          <option value="tarde">Tarde</option>
                          <option value="noite">Noite</option>
                          <option value="integral">Integral</option>
                        </select>
                      </div>
                    </div>

                    <h6 class="mb-3 mt-4">Endereço</h6>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="logradouro" class="form-label">Logradouro</label>
                        <input type="text" class="form-control" id="logradouro" v-model="funcionario.logradouro" />
                      </div>
                      <div class="col-md-2">
                        <label for="numero" class="form-label">Número</label>
                        <input type="text" class="form-control" id="numero" v-model="funcionario.numero" />
                      </div>
                      <div class="col-md-4">
                        <label for="complemento" class="form-label">Complemento</label>
                        <input type="text" class="form-control" id="complemento" v-model="funcionario.complemento" />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-3">
                        <label for="bairro" class="form-label">Bairro</label>
                        <input type="text" class="form-control" id="bairro" v-model="funcionario.bairro" />
                      </div>
                      <div class="col-md-3">
                        <label for="cidade" class="form-label">Cidade</label>
                        <input type="text" class="form-control" id="cidade" v-model="funcionario.cidade" />
                      </div>
                      <div class="col-md-3">
                        <label for="estado" class="form-label">Estado</label>
                        <select class="form-select" id="estado" v-model="funcionario.estado">
                          <option selected disabled value="">Selecione</option>
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AP">AP</option>
                          <option value="AM">AM</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="MG">MG</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PR">PR</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RS">RS</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="SC">SC</option>
                          <option value="SP">SP</option>
                          <option value="SE">SE</option>
                          <option value="TO">TO</option>
                        </select>
                      </div>
                      <div class="col-md-3">
                        <label for="cep" class="form-label">CEP</label>
                        <input type="text" class="form-control" id="cep" v-model="funcionario.cep" />
                      </div>
                    </div>
                  </form>

                  <div
                    class="position-relative"
                    style="width: 100px; height: 100px; margin-left: 20px; margin-top: -10px;"
                  >
                    <label
                      for="foto"
                      class="d-flex align-items-center justify-content-center bg-dark text-white rounded border border-light w-100 h-100"
                      style="cursor: pointer; overflow: hidden; border-radius: 12px;"
                    >
                      <template v-if="fotoPreview">
                        <img
                          :src="fotoPreview"
                          alt="Preview"
                          class="w-100 h-100"
                          style="object-fit: cover; border-radius: 12px;"
                        />
                      </template>
                      <template v-else>
                        <i class="fa fa-camera" style="font-size: 1.5rem;"></i>
                      </template>
                    </label>
                    <input
                      type="file"
                      id="foto"
                      class="d-none"
                      accept="image/*"
                      @change="onFileChange"
                    />
                  </div>
                </div>

                
                  <div class="d-flex justify-content-start">
                    <button type="submit" class="btn btn-success me-2">Salvar</button>
                    <button type="button" class="btn btn-danger" @click="cancelarAlteracoes">Excluir</button>
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
import { ref, reactive, onMounted } from 'vue'
import NavHeaderBarVue from '@/components/layout/NavHeaderBar.vue'
import NavSideBarVue from '@/components/layout/NavSideBar.vue'
import FooterBarVue from '@/components/layout/FooterBar.vue'

const funcionario = reactive({
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  email: '',
  cargo: '',
  salario: 0,
  dataContratacao: '',
  turno: '',
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
    funcionario.foto = file
    fotoPreview.value = URL.createObjectURL(file)
  }
}

const salvarAlteracoes = () => {
  alert("Dados atualizados! (simulação)")
  console.log("Funcionário atualizado:", funcionario)
}

const cancelarAlteracoes = () => {
  if (confirm("Tem certeza que deseja excluir??")) {
    alert("Funcionário Deletado! (simulação)")
  }
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

