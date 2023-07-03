<template>
    <button @click="router.push({name: 'posts'})" class="btn post-btn"> <i class="bi bi-arrow-left">{{'  Volver'}} </i></button>
    <div class="container">
        <PostCard @remove="changeRoute()" v-if="post"
            :post="post"/>
            <Loading v-if="!post"/>
    </div>
</template>

<script lang="ts" setup>

import { postById } from '../helpers/PostsData'
import { onBeforeMount, ref } from 'vue';
import PostCard from '../components/PostCard.vue'
import Loading from './LoadingComp.vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify';

const router= useRouter()
const post = ref()
const props = defineProps ({
    id: {
        type: String,
        required: true
    }
})

const changeRoute = () => {
    toast.success("Se ha eliminado satisfactoriamente", {
                autoClose: 1000,
            })
    router.push({name: 'posts'})
}

const getPostById = async() => {
    const accessToken = localStorage.getItem('access_token')
    await postById(accessToken, props.id)
        .then((response) => {
            post.value = response             
        }).catch(() => {

        })
}

onBeforeMount(() => {
    getPostById()
})

</script>

<style lang="scss" scoped>

.post-btn {
    background-color: transparent;
    border: 2px solid #ffab02;
    transition: all 0.4s;
    width: 100px;
    margin-top: 90px;
    margin-left: 24px;
    &:hover{
        background-color: #fce3b2;
        transition: all 0.4s;
    }
}

@media (max-width: 575px) {
    .container {
    padding-top: 55px;
    }
}

</style>