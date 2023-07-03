<template>
    <div class="container-delete fade-in">
        <div class="card" style="width: 18rem;">
            <div class="card-body">

                    <div class="close-container d-flex flex-column mb-3">
                        <div class="d-flex justify-content-between gap-2">
                            <h2 class="title mb-3">¿Estás seguro?</h2>
                            <i @click="$emit('closeModal')" class="bi bi-x-circle-fill"></i>
                        </div>
                        <p class="ms-3">No vas a poder recuperarlo</p>
                    </div>
                    
                    <div class="d-flex justify-content-center gap-3">
                        <button type="submit" @click="$emit('removePost')" class="login-btn-remove btn">Eliminar</button>
                        <button type="submit" @click="$emit('closeModal')" class="login-btn btn">Cancelar</button>
                    </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


</script>

<style lang="scss" scoped>

.container-delete {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;

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
    box-shadow: 1px 2px 10px #ff6767, -1px -2px 10px #ff6767, 2px 3px 10px #6d6d6d, -2px -3px 10px #6d6d6d !important; 
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
    }
}

.login-btn-remove {
    float: right;
    background-color: transparent;
    border: 2px solid #ffab02;
    transition: all 0.4s;

    &:hover{
        background-color: #ff6363;
        color: white;
        border: 2px solid #ff0202;

    }
}

</style>