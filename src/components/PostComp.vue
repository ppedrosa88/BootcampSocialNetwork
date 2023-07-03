<template>

    <body class="body_container d-flex justify-content-center align-items-center">

        <div class="post d-flex flex-column align-items-center w-100">
            <PostCard @remove="(id) => {refresh(id)}"
                v-if="postArray && !loadPost"
                v-for="post in postArray"
                :key="post"
                :post="post"
                />
                <Loading class="pt-5" v-if="loadPost"/>
                <NoPost v-if="!postsExists && !loadPost" />
        </div>

    </body>

</template>

<script setup lang="ts">

import { onMounted, ref, } from 'vue';
import PostCard from './PostCard.vue'
import NoPost from './NoPostCard.vue'
import { loadPosts } from '../helpers/PostsData';
import { toast } from 'vue3-toastify'
import Loading from './LoadingComp.vue'
import { emitter } from '../helpers/PostsData'
import { searchByQuery } from '../helpers/PostsData'

const accessToken = localStorage.getItem('access_token')
const postArray = ref([])
const loadPost = ref(false)
const postsExists = ref(true)

const loadPostsList = async() => {
    postsExists.value = true
    postArray.value = []
    loadPost.value = true

    setTimeout(async() => {
        await loadPosts(accessToken)
            .then((response) => {        
                postArray.value = response   
                loadPost.value = false
                postsExists.value = true
            })
            .catch(() => {
                postsExists.value = false
                loadPost.value = false
            })
    }, 1000);
}

const refresh = (id) => {
    const index = (postArray.value.findIndex(x => x.id === id))
    if (index > -1) {
        postArray.value.splice(index,1)
        toast.success("Se ha eliminado satisfactoriamente", {
            autoClose: 1000,
        })
    }
}

onMounted(async() => {
    emitter.on('searchInput', async (data) => {        
        if (data === ''){
            // filterPost(data.value)
            loadPostsList()
        } else {
            await searchByQuery(data)
            .then((resp) => {
                postArray.value = resp
                loadPost.value = false
                if (postArray.value.length === 0) {
                    loadPost.value = false
                    postsExists.value = false
                }
            })
            .catch(() => {
                postsExists.value = false
                loadPostsList()
            })
        }
    })
    loadPostsList()
}) 
    
</script>

<style scoped lang="scss">

.body_container {
    width: 100vw;
    margin: 0;
    padding: 0;
    margin-top: 80px;
}

.post {
    margin-bottom: 20px;
    width: 60%;
}

@media (max-width: 1200px) {
    .post {
        width: 75%;
    }
}

@media (max-width: 992px) {
    .post {
        width: 90%;
    }
}

@media (max-width: 768px) {
    .post {
        width: 100%;
    }

    .body_container {
    width: 100vw;
    margin-left: 0;
    margin-left: 0;
    }
}

@media (max-width: 575px) {
    .body_container {
        margin-top: 55px;
    }
}


</style>