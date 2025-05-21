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
          <div class="row g-4">
            <div class="col-12">
              <div class="bg-secondary rounded h-100 p-4 text-light">

                <h6 class="mb-4">Cadastro de Unidades</h6>
                
                <div class="d-flex align-items-start gap-4">
                    
                  <form @submit.prevent="cadastrarUnidade" class="flex-grow-1">
                        <h6 class="mb-3">Dados Pessoais</h6>
                        <div class="row mb-3">
                            <div class="col-md-4">
                            <label for="nome" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="nome" v-model="unidade.nome" required />
                            </div>
                            <div class="col-md-4">
                            <label for="cpf" class="form-label">CNPJ</label>
                            <input type="text" class="form-control" id="cpf" v-model="unidade.cpf" @input="aplicarMascaraCNPJ" required />
                            </div>
                            <div class="col-md-4">
                            <label for="telefone" class="form-label">Telefone</label>
                            <input type="text" class="form-control" id="telefone" v-model="unidade.telefone" @input="aplicarMascaraTelefone" required />
                            </div>
                            <div class="col-md-4">
                            <label class="form-label">Status</label>
                            <div class="form-check mt-2">
                                <input class="form-check-input" type="checkbox" id="status" v-model="unidade.status" />
                                <label class="form-check-label" for="status">Unidade ativa</label>
                            </div>
                            </div>
                            <div class="col-md-4">
                            <label for="capacidade" class="form-label">Capacidade</label>
                            <input type="text" class="form-control" id="capacidade" v-model="unidade.capacidade" />
                            </div>
                        </div>

                        <h6 class="mb-3 mt-4">Endereço</h6>
                        <div class="row mb-3">
                            <div class="col-md-6">
                            <label for="logradouro" class="form-label">Logradouro</label>
                            <input type="text" class="form-control" id="logradouro" v-model="unidade.logradouro" />
                            </div>
                            <div class="col-md-2">
                            <label for="numero" class="form-label">Número</label>
                            <input type="text" class="form-control" id="numero" v-model="unidade.numero" />
                            </div>
                            <div class="col-md-4">
                            <label for="complemento" class="form-label">Complemento</label>
                            <input type="text" class="form-control" id="complemento" v-model="unidade.complemento" />
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-3">
                            <label for="bairro" class="form-label">Bairro</label>
                            <input type="text" class="form-control" id="bairro" v-model="unidade.bairro" />
                            </div>
                            <div class="col-md-3">
                            <label for="cidade" class="form-label">Cidade</label>
                            <input type="text" class="form-control" id="cidade" v-model="unidade.cidade" />
                            </div>
                            <div class="col-md-3">
                            <label for="estado" class="form-label">Estado</label>
                            <select class="form-select" id="estado" v-model="unidade.estado" required>
                                <option disabled value="">Selecione</option>
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
                            <input type="text" class="form-control" id="cep" v-model="unidade.cep" @input="aplicarMascaraCep" required />
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary">Salvar</button>
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

const unidade = reactive({
  nome: '',
  cpf: '',
  telefone: '',
  status: false,
  capacidade: '',
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
    if (fotoPreview.value) {
      URL.revokeObjectURL(fotoPreview.value)
    }
    unidade.foto = file
    fotoPreview.value = URL.createObjectURL(file)
  }
}

const limparunidade = () => {
  Object.assign(unidade, {
    nome: '',
    cpf: '',
    telefone: '',
    status: false,
    capacidade: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    foto: null
  })
  if (fotoPreview.value) {
    URL.revokeObjectURL(fotoPreview.value)
  }
  fotoPreview.value = null
}

const cadastrarUnidade = () => {
  console.log('Unidade cadastrada:', unidade)
  alert(`Unidade ${unidade.nome} cadastrada com sucesso!`)
  limparunidade()
}

const aplicarMascaraTelefone = () => {
  let v = unidade.telefone.replace(/\D/g, '')
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
  }
  unidade.telefone = v
}

const aplicarMascaraCep = () => {
  let v = unidade.cep.replace(/\D/g, '')
  v = v.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2')
  unidade.cep = v
}

const aplicarMascaraCNPJ = () => {
  let v = unidade.cpf.replace(/\D/g, '')
  v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, '$1.$2.$3/$4-$5')
  unidade.cpf = v
}

onMounted(() => {
  document.getElementById('spinner')?.classList.remove('show')
  const script = document.createElement('script')
  script.src = '/src/components/js/maincode.js'
  script.async = true
  document.body.appendChild(script)
})

</script>
