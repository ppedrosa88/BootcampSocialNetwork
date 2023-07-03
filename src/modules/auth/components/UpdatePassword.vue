<template>
    <div class="container-update fade-in">
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <div>
                    <div class="close-container">
                        <h2 class="col title">Cambia tu contraseña</h2>
                        <i @click="$emit('closeUpdate')" class="bi bi-x-circle-fill"></i>
                    </div>
                </div>
                <hr class="mb-3">
                <form @submit.prevent="onSubmit">

                    <div class="mt-3 mb-3">
                        <input @input="wrongPass" v-model="userForm.password" id="password" class="form-control" type="password" placeholder="Contraseña actual" required>
                    </div>
                    <div class="mb-3">
                        <input @keyup="changeStatus" @input="wrongPass" id="newPassword" v-model="userForm.newPassword" class="form-control" type="password" placeholder="Nueva contraseña" required>
                            <p class="wrong-credentials ms-1" v-if="shortPassword">La nueva contraseña debe tener al menos 4 caracteres</p>
                    </div>
                    <button type="submit" class="login-btn btn">Enviar</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { Ref, ref } from 'vue';
import type { UsersData } from '../helpers/UsersData';
import { updatePassword } from '../helpers/UsersData';

const userForm: Ref<UsersData> = ref({
    email: '',
    password: '',
    newPassword: ''
})

const emit = defineEmits(['closeUpdate','changeCorrect'])
let showError = ref(false)
let shortPassword = ref(false)



const onSubmit = async() => {
    if(userForm.value.newPassword?.length < 4){
        shortPassword.value = true
    } else {
        const resp = await updatePassword( userForm.value )
            .then(() => {
                emit('changeCorrect')
            }).catch(() => {
                document.getElementById("password").reset()
            })
    }
}

const wrongPass = () => {
    showError.value = false
}

const changeStatus = () => {
    shortPassword.value = false
} 


</script>

<style lang="scss" scoped>

.container-update {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
}
.fade-in {
  animation: fadeIn ease-out 0.2s;
  -webkit-animation: fadeIn ease-out 0.2s;
  -moz-animation: fadeIn ease-out 0.2s;
  -o-animation: fadeIn ease-out 0.2s;
  -ms-animation: fadeIn ease-out 0.2s;
}

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
    box-shadow: 1px 2px 10px #6d6d6d, -1px -2px 10px #6d6d6d, 2px 3px 10px #6d6d6d, -2px -3px 10px #6d6d6d !important; 
}
.card {
    border: 0;
    border-radius: 15px;
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

.wrong-credentials {
    font-size: 12px;
    color: red;
}

.success-note {
    font-size: 12px;
    color: green;
}


</style>