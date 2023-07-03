<template>

<div v-if="change === 'login'" class="card" style="width: 18rem;">
        <div class="card-body">
            <div>
                <div class="close-container">
                    <h2 class="col title">Recupera tu contraseña</h2>
                    <i @click="$emit('toLogin')" class="bi bi-x-circle-fill"></i>
                </div>
            </div>
            <hr class="mb-3">
            <p>Introduce tu email para buscar tu cuenta</p>
            <form @submit.prevent="onSubmit(userForm)">
                
                <div class="mb-2">
                    <input @keyup="changeStatus" v-model="userForm.email" class="form-control" type="email" placeholder="Email" required>
                    <span>
                        <p v-if="showMessage" class="message-forgot ms-1">Revisa tu bandeja de entrada.<br>Te hemos enviado una nueva contraseña</p>
                        <p v-if="showErrorMessage" class="message-forgot-error ms-1">Usuario no encontrado. ¿Estás registrado?<br>
                        <RouterLink :to="{name: 'register'}">Pulsa aquí para registrarte</RouterLink> </p>
                    </span>
                </div>
                
                <button v-if="!showMessage" type="submit" class="login-btn btn">Enviar</button>
                <button v-if="showMessage" @click="$emit('toLogin')" type="submit" class="login-btn btn">Login</button>
            </form>
        </div>
    </div>

</template>

<script setup lang="ts">

import { Ref, ref } from 'vue';
import type { UsersData } from '../helpers/UsersData';
import { forgotPassword } from '../helpers/UsersData';

const userForm: Ref<UsersData> = ref({
        email: '',
})

let showMessage = ref(false)
let showErrorMessage = ref(false)
let change = ref('login')

const onSubmit = async(user:UsersData) => {
    const resp = await forgotPassword( userForm.value )
        .then(() => emailSend())
        .catch(() => {
            emailError()
        })
}

const emailSend = () => {
    showMessage.value = !showMessage.value
}

const checkForm = (user:UsersData) => {
    if (user.email === null){
        emailError()
    }
}

const emailError = () => {
    showErrorMessage.value = !showErrorMessage.value
}

const changeStatus = () => {
    showErrorMessage.value = false
    showMessage.value = false
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
}

input:focus {
    box-shadow: none;
    border-color: #ffab02;
}

.close-container {
    display: flex;
    justify-content: right;

    i {
        color:#ffab02;
        font-size: larger;
        font-weight:bold;
        cursor: pointer;
    }

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

.message-forgot-error {
    color: red;
    font-size: 12px;
}
.message-forgot {
    color: green;
    font-size: 12px;
}

</style>