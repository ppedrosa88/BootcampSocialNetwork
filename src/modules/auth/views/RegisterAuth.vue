<template>
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <div>
                <div class="close-container">
                    <h2 class="col title">Regístrate</h2>
                    <router-link :to="{name: 'login'}">
                        <i class="bi bi-x-circle-fill"></i>
                    </router-link>
                </div>
                <p class="mb-3">Es rápido y fácil</p>
            </div>
            <hr class="mb-3">
            <form @keyup="changeStatus"   @submit.prevent="onSubmit">
                <div class="mb-3 mt-3">
                    <input v-model="userForm.name" pattern="[A-Za-z]+" class="form-control" type="text" placeholder="Nombre" required>
                    <small class="ms-1 small-message">El nombre no puede contener números</small>
                </div>
                <div class="mb-3">
                    <input v-model="userForm.email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"  class="form-control" type="email" placeholder="Email" required>
                    <p v-if="emailError" class="messageError ms-1">Credenciales no válidas</p>
                </div>
                <div class="mb-3">
                    <input v-model="userForm.password" class="form-control" type="password" placeholder="Contraseña" required>
                    <p v-if="shortPassword" class="messageError ms-1">La contraseña debe tener al menos 4 caracteres</p>
                </div>
                <button type="submit" class="login-btn btn">Comenzamos</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">

import { Ref , ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import type { UsersData } from '../helpers/UsersData';
import axios from 'axios';
import { toast } from 'vue3-toastify';

const userForm: Ref<UsersData> = ref({
    name: '',
    email: '',
    password: ''
})

const router = useRouter()
let emailError = ref(false)
let shortPassword = ref(false)
const baseUrl = 'https://bootcamp-api.itexon.net/api'
const onSubmit = async() => {

    if(userForm.value.password.length < 4){
        shortPassword.value = true
    } else {
        axios.post(`${baseUrl}/register`, userForm.value)
            .then(data => {
                if (data.status === 200) {
                    router.push({name: 'login'})
                    toast.success("¡Se ha registrado con exito!", {
                        autoClose:1000,
                    })
                } else {
                    throw new Error('error')
                }
            })
            .catch((err) => {
                if(err.response.status === 422) {   
                    emailError.value = true
                }
            })
    }

}

const changeStatus = () => {
    if(shortPassword.value === true || emailError.value === true){
        shortPassword.value = false
        emailError.value = false
    } 
} 

</script>

<style lang="scss" scoped>

.title {
    color: #1c1e21;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 32px;
    line-height: 38px;
    margin-bottom: 0px;
}

.card-body {
    border-radius: 15px;
    border: none !important;
    background-color: #f9fbff;
    box-shadow: 1px 2px 10px #accbf7, -1px -2px 10px #accbf7, 2px 3px 10px #accbf7, -2px -3px 10px #accbf7 !important; 
}
.card {
    border: 0;
    border-radius: 15px;
    transition: all 0.4s;
}

.close-container {
    display: flex;
    justify-content: right;

    i {
        color:#ffab02;
        font-size: larger;
        font-weight:bold;
    }

}

input:focus {
    box-shadow: none;
    border-color: #ffab02;
}

.login-btn {
    float: right;
    background-color: transparent;
    border: 2px solid #ffab02;
    transition: all 0.4s;

    &:hover{
        background-color: #fce3b2;
        transition: all 0.4s;
    }
}

.small-message {
    font-size: 12px;
}

.messageError {
    color: red;
    font-size: 12px;
}


</style>