<template>
    <div class="card d-flex flex-column align-items-center">
        <div class=" align-self-start w-100">
            <div class="d-flex ms-2 gap-3 justify-content-between align-items-center pb-3 pt1">
                <div class="d-flex align-items-center justify-content-center gap-3">
                    <img class="user-avatar h- rounded-circle border border-2" v-if="post.user.profile?.avatar" :src="post.user.profile.avatar"/>
                    <img class="user-avatar h- rounded-circle border border-2" v-if="!post.user.profile?.avatar" src="../assets/bootcamp_logo.svg"/>
                    <p class="user-name h6">{{ post.user.name }}</p>
                </div>
                <div v-if="post.user.id === userIdLocal()" class="button-group d-flex flex-row-reverse pe-3 gap-1">
                    <a @click="showRemoveModal()" class="button me-2 link-unstyled"><i class="bi bi-trash"></i></a>
                    <a @click="pushToEdit()" class="button me-2 link-unstyled"><i class="bi bi-pencil-square"></i></a>
                </div>
            </div>
            <div class="post_info ps-2 pb-3">
                <h3 class="card_title" @click="pushToShow()">{{ post.title }}</h3>
                <p class="card-text ps-2">{{ post.content }}</p>
            </div>
        </div>  
        <div @click="pushToShow()" class="img-container overflow-hidden d-flex justify-content-center align-items-center">
            <img :src="post.main_picture" class="image-fluid img object-fit-cover"/>
        </div>
        <div class="d-flex align-self-end flex-row-reverse p-3 gap-3">
            <i  class="bi bi-chat comments">{{commentsComp}}</i>
            <i class="bi bi-heart likes"> {{' ' + post.likes }}</i>
        </div>
    </div>
    <RemoveModal v-if="removeModal" @closeModal="closeModal()"
                @removePost="removePost()"/>



</template>

<script setup lang="ts">

import { computed, ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { removeUserPost } from '../helpers/PostsData'
import RemoveModal from './RemoveModal.vue'

const router = useRouter()
const removeModal = ref(false)
const route = window.location.pathname
const emit = defineEmits(['remove'])

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

const userIdLocal = () => {
    const identity = localStorage.getItem('id')
    if(identity) {
        return parseInt(identity)
    }
}


const removePost = async() => {
    const accessToken = localStorage.getItem('access_token')
    await removeUserPost(accessToken, props.post.id)
        .then(() => {
            removeModal.value = false
            emit('remove',props.post.id)
        })
}

const closeModal = () => {
    removeModal.value = false
}

const pushToEdit = (() => {
    router.push({
            name: 'editpost', 
            params:{
                id: String(props.post.id)
            }})
})

const pushToShow = (() => {    
    if (route === '/home') {
        router.push({
            name: 'post', 
            params:{
                id: String(props.post.id)
            }})
    }
}) 

const commentsComp = computed(() => {
    let commentNumber = ''
    if (props.post.comments > 1) {
        commentNumber = ` ${props.post.comments} comentarios`
    } else if (props.post.comments === 1) {
        commentNumber =  ` ${props.post.comments} comentario`
    } else {
        commentNumber = ' 0 comentarios'
    }
    return commentNumber
})

const showRemoveModal = () => {
    removeModal.value = true
}

</script>

<style lang="scss" scoped>

.user-avatar {
    width: 50px;
    height: 50px;
}

.img {
    max-width: 100%;
    max-height: 100%;
}

.button-group {
    padding-bottom: 10px !important;
    padding-right: 0px !important;
}

.card-text {
    max-height: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.card {
    width: 60%;
    margin-top: 20px;
    padding: 8px;
    border-radius: 10px;
    box-shadow: 1px 1px 2px  #fff6e3 , -1px -1px 2px  #fff6e3, 2px 2px 2px  #fff6e3 , -2px -2px 2px  #fff6e3 ;
}

.button {
    color:inherit;
    text-decoration: none;
    cursor: pointer;
}

.card_title {
    cursor: pointer;
}

.img-container {
    min-width: 250px;
    min-height: 150px;
    max-width: 400px;
    max-height: 400px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .card {
        width: 96%;
    }
}

</style>