<template>
    <div v-if="change === 'login'"  class="card" style="width: 18rem;">
        <div class="card-body">
            <div>
                <div class="close-container">
                    <h2 class="col title">Login</h2>
                    
                </div>
            </div>
            <hr class="mb-3">
            <form @submit.prevent="onSubmit">
                
                <div class="mb-3">
                    <input @input="wrongPass" v-model="userForm.email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" class="form-control" type="email" placeholder="Email" required>
                </div>
                <div class="mb-3">
                    <input @input="wrongPass" @keydown="shortPass" v-model="userForm.password" class="form-control" type="password" placeholder="Contraseña" required>
                
                    <span class="wrong-credentials">
                        <p class="ms-1" v-if="emailFormatIncorrect">Correo con formato incorrecto</p>
                        <p class="ms-1" v-if="showError">Email o contraseña incorrectos</p>
                    </span>
                </div>
                <div class="form-check">
                    <input v-model="checkbox" class="form-check-input checkbox" type="checkbox" id="flexCheckDefault">
                    <label class="form-check-label " for="flexCheckDefault">
                        Recuérdame
                    </label>
                </div>
                <span class="wrong-credentials">
                    <p v-if="shortPassword" class="ms-1">La contraseña debe tener al menos 4 caracteres</p>
                </span>
                <div class="userRegister mt-2 mb-4">
                    <router-link :to="{name: 'register'}" class="register router-link ms-1">Regístrate</router-link>
                    <a @click="changeTo('forgot')" class="ms-1">¿Has olvidado tu contraseña?</a>
                </div>
                <button type="submit" class="login-btn btn">Comenzamos</button>
            </form>
        </div>
    </div>
    <ForgotPassword v-if="change ==='forgot'" @toLogin="changeTo('login')"/>
</template>

<script setup lang="ts">


import { Ref, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { UsersData } from '../helpers/UsersData';
import { loginUser } from '../helpers/UsersData';
import { useRouter } from 'vue-router';
import ForgotPassword from '../components/ForgotPassword.vue';

const userForm: Ref<UsersData> = ref({
    email: '',
    password: ''
})

let showError = ref(false)
const router = useRouter()
let change = ref('login')
let shortPassword = ref(false)
let checkbox = ref(false)
let emailFormatIncorrect = ref(false)
const isShowSucessMessage = ref(false);

const onSubmit = async() => {
    if (emailValidation(userForm.value.email) === null) {
        emailFormatIncorrect.value = true
    }  else {
        if (userForm.value.password?.length < 4) {
        shortPassword.value = true
        } else {
            const resp = await loginUser( userForm.value )

            if (resp === 'Invalid Credentials') {
                showError.value = true
            } else if (resp.status === 'success') {
                showError.value = false

                if(checkbox.value) {
                    const parsed = JSON.stringify(userForm.value.email)
                    localStorage.setItem('email', parsed)
                } else if(!checkbox.value) {
                    localStorage.removeItem('email')
                }

                router.push('/home')
            }
        }
        
    }
    
}

onMounted(() => {
    if (localStorage.getItem('email')) {
        const email = localStorage.getItem('email')
        userForm.value.email = JSON.parse(email)
        checkbox.value = true
    }

})


const wrongPass = () => {
    if(showError.value === true){
        showError.value = false
    } else if (emailFormatIncorrect.value === true){
        emailFormatIncorrect.value = false
    }
}

const shortPass = () => {
    shortPassword.value = false
}

function changeTo(page: string) {
    isShowSucessMessage.value = true;
    setTimeout(() => {
        isShowSucessMessage.value = false;
    }, 1500);
    change.value = page
}

function emailValidation(email: string) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
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

.checkbox {
    appearance: none;
    border: 2px solid #ffab02;
    color: #ffab02;
    cursor: pointer;
    background-color: #fff;
    transition: all 0.4s;

    &:hover{
        background-color: #fce3b2;
        transition: all 0.4s;
    }

    &:focus{
        transition: all 0.4s;
        box-shadow: none !important;
    }

    &:checked {
        background-color: #ffab02;
    }
}

.userRegister {
    display: flex;
    flex-direction: column;

    .router-link {
        font-size: 12px;
        text-decoration: none;
        color: blue !important;
        
        &:hover {
            text-decoration: underline;
        }
    }
    a {
        font-size: 12px;
        cursor: pointer;
        color: blue;
        
        &:hover{
            color: blue;
            text-decoration: underline;
        }
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