<template>
 <div class="sidebar pe-4 pb-3">
            <nav class="navbar bg-secondary navbar-dark">
                <a href="index.html" class="navbar-brand mx-4 mb-3">
                    <h3 class="text-primary"><i class="fa fa-user-edit me-2"></i>DarkPan</h3>
                </a>
                
                <div class="d-flex align-items-center ms-4 mb-4">
                    <div class="position-relative">
                        <img class="rounded-circle" src="../imgs/adm.jpg" alt="" style="width: 40px; height: 40px;">
                        <div class="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
                    </div>
                    <div class="ms-3">
                        <h6 class="mb-0">João Pedro</h6>
                        <span>Admin</span>
                    </div>
                </div>
                <div class="navbar-nav w-100">

                        <router-link to="/blank" class="nav-item nav-link">
                        <i class="fa fa-chart-line me-2"></i>Relatórios
                        </router-link>

                        <router-link to="/reservas" class="nav-item nav-link">
                        <i class="fa fa-calendar-check me-2"></i>Reservas
                        </router-link>

                        <router-link to="/clientes" class="nav-item nav-link">
                        <i class="fa fa-users me-2"></i>Jogadores
                        </router-link>

                        <router-link to="/caixa" class="nav-item nav-link">
                        <i class="fa fa-cash-register me-2"></i>Caixa
                        </router-link>

                        <router-link to="/salas" class="nav-item nav-link">
                        <i class="fa fa-door-open me-2"></i>Salas
                        </router-link>

                        <router-link to="/funcionarios" class="nav-item nav-link">
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
import { defineComponent } from 'vue';

export default defineComponent({
    name:'NavSideBar'
});


</script>