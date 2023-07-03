<template>
  <nav class="navbar-container navbar navbar-expand-sm navbar-dark fixed-top">
    <div class="container-fluid">
      <a class="logo">
        <img class="image-logo me-4" src="../assets/bootcamp_logo.svg" alt="Bootcamp logo">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon light"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">

        <ul class="navbar-nav me-auto mb-2 mb-lg-0  ms-1">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" @click="toPosts()">Posts</a> 
          </li>
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" @click="toEvents()">Eventos</a></li>
        </ul>

        <form @submit.prevent="sendData()" class="d-flex" role="search">
          <input v-model="searchInput" @input="sendData()" @search="sendData()" class="form-control rounded-pill me-2" type="search" placeholder="Buscar" aria-label="Search">
        </form>

        <input type="file" 
              enctype="multipart/form-data"
              @change="onSelectedImage"
              ref="imageSelector"
              v-show="false"
              accept=".jpg,.png,.jpeg,.csv"/>

        <div class="dropdown">

            <div class="dropdown-toggle d-flex justify-content-center align-items-center gap-1 p-1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <div class="image-user-container text-center mt-1">
                <img v-if="userImage" :src="userImage" 
                class="w-100 h-100 object-fit-cover"/>
                <img v-else src="../assets/bootcamp_logo.svg" 
                class="w-100 h-100 object-fit-cover"/>               
              </div>
            </div>
        
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" @click="onSelectImage">Cambiar avatar</a></li>
            <li><a class="dropdown-item" @click="$emit('openUpdate')">Cambiar contraseña</a></li>
            <li><a class="dropdown-item" @click="closeSession" >Cerrar sesión</a></li>
          </ul>

        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import {getUserImage, UploadImage} from '../modules/auth/helpers/UsersData'
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRouter } from 'vue-router';
import { emitter, searchByQuery } from '../helpers/PostsData'
import { finishSession } from '../modules/auth/helpers/UsersData';
import { debounce } from 'lodash';

const userImage = ref()
const imageSelector = ref(null)
const router = useRouter()
const searchInput = ref()

const delayedSearch = debounce(() => {
  emitter.emit('searchInput',searchInput.value)
  } ,300)

const sendData = async() => {
  delayedSearch()
}

const onSelectedImage = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file: File | null = target.files[0]
  if(!file){
    return
  } 
  await setImageUser(file)
}

function onSelectImage() {
  if(imageSelector.value){
    (imageSelector.value as HTMLInputElement).click()
  } 
}

const setImageUser = async (file: File) => {
  const access_token = localStorage.getItem('access_token')

  if(access_token && file) {
    await UploadImage(file, access_token)
      .then(() => {
        getImageUser()
        location.reload()
      })
      .catch((error) => {
        if(error.response.status === 422){
          toast("Error. El archivo debe ser menor a 2MB", {
            autoClose:2000,
          })
        }
      })
  }
}

const getImageUser = async() => {
  const access_token = localStorage.getItem('access_token')

  if(access_token) {
    const resp = await getUserImage(access_token)
    .then((resp) => {
      const avatarUrl = resp.data.data.user.profile.avatar
      userImage.value = avatarUrl
    })
    .catch(() => {
      
    })
  }
  return null
}

const closeSession = async() => {
  await finishSession().then(() => {
    router.push({name: 'login'})
  })

}

const toPosts = () => {

  const route = window.location.pathname

  if(route === '/home' ){
    location.reload()
  } else {
    router.push({name: 'posts'})
  }
}

const toEvents = () => {
  
  const route = window.location.pathname

  if(route === '/events') {
    location.reload()
  } else {
    router.push({name: 'events'})
  }

}

onMounted(() => {
  getImageUser() 
})

</script>

<style lang="scss" scoped>

.nav-link {
  cursor: pointer;
}

.image-logo {
  width: 120px;
  height: auto;
}

.navbar-container {
  background: linear-gradient(220.55deg, #75ACFF 0%, #428EFF 50%, #277dff 100%);
}

.image-user-container {
  width: 50px;
  height: 50px;
  border: 3px solid white;
  border-radius: 100%;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

</style>