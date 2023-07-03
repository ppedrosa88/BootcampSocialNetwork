

<template>

    <div class="main-container">
        <img class="logo" src='../../../assets/bootcamp_logo.svg'>
        <RouterView/>
    </div>

</template>

<script setup lang="ts">

import {RouterView} from 'vue-router'

</script> 

<style lang="scss" scoped>

.main-container {
    background: linear-gradient(220.55deg, #75ACFF 0%, #428EFF 50%, #277dff 100%);
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .logo {
        width: 70%;
        max-width: 350px;
        padding-bottom: 100px;
        
    }
}

</style>
