<template>

    <NavbarMain @search="(data) => sendData(data)" @openUpdate="openUpdate"/>

    <div class="position-absolute body">
        <UpdatePassword class="update" @closeUpdate="closeUpdate" @changeCorrect="changePassword" v-show="updatePass"/>
        <RouterView />
        <FabNewPost :route="route" v-if="isFab()"/>
    </div>


</template>

<script setup lang="ts">

import { RouterView, useRouter } from 'vue-router'
import NavbarMain from '../components/NavbarMain.vue';
import FabNewPost from '../components/FabNewPost.vue';
import UpdatePassword from '../modules/auth/components/UpdatePassword.vue';
import { ref, computed, watch } from 'vue';

const searchData = ref()
const updatePass = ref(false)
const router = useRouter()


const sendData = (data: String) => {
    searchData.value = data
}

const openUpdate = () => {    
    updatePass.value = true
}

const closeUpdate = () => {
    updatePass.value = false
}

const changePassword = () => {
    updatePass.value = false
}

const currentRoute = computed(() => {
        return router.currentRoute.value.name
    })
const route = ref(currentRoute)

const isFab = () => {
    if(route.value.includes('post') || route.value.includes('event') ){
        return true
    } else {
        return false
    }
}

watch(
    () => currentRoute.value,
    () => {
        if(route.value != currentRoute.value) {
            route.value = currentRoute.value
        }       
    }
)

</script>

<style lang="scss" scoped>

.body {
    width: 100vw;
}

.update {
    z-index: 100;
}

</style>