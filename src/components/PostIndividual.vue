<template>
    <div class=" card container d-flex flex-column align-items-center justify-content-center gap-3">
        <div class="image-container w-auto  overflow-hidden justify-content-center d-flex align-items-center"
            @click="onSelectImage">

            <p v-if="!postImage" class="text-warning p-2">Pulse aquí para insertar una imagen</p>
            <img :src="postImage" class="img-fluid object-fit-cover"/>
            <input type="file" 
                enctype="multipart/form-data"
                @change="onSelectedImage"
                ref="imageSelector"
                v-show="false"
                accept=".jpg,.png,.jpeg,.csv"/>
        </div>
        <form @submit.prevent="onSubmit" class="w-100 d-flex flex-column gap-3 align-items-center">
            <input v-model="postForm.title" class="titleInput form-control w-100" placeholder="Título"/>
            <textarea v-model="postForm.content" class="form-control description" id="exampleFormControlTextarea1" placeholder="Escribe aquí tu post..." rows="3" />
            <div class="d-flex gap-3">
                <input type="submit" class="btn post-btn"/>
                <button @click="router.push({name: 'posts'})" class="btn post-btn">Cancelar</button>
            </div>        
        </form>
    </div>

</template>


<script setup lang="ts">

import { ref, Ref, onMounted } from 'vue'
import { postById, PostsData, updatePost } from '../helpers/PostsData';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter()
const postImage = ref()
const imageSelector = ref()
const postForm: Ref<PostsData> = ref({
    title: '',
    content: '',
    main_picture: undefined
})


const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const getPostById = async() => {
    const accessToken = localStorage.getItem('access_token')
    await postById(accessToken, props.id)
        .then((response) => {
            postForm.value.title = response.title
            postForm.value.content = response.content
            postImage.value = response.main_picture
        }).catch(() => {

        })
}

const onSelectedImage = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file: File | undefined = target.files[0]
    if(!file){
        postImage.value = ''
      return 
    }

    postForm.value.main_picture = file
    const reader = new FileReader()

    reader.onload = (e) => {
      const imageDataURL = e.target?.result as string;
      postImage.value = imageDataURL;
    }
    reader.readAsDataURL(file);
}

function onSelectImage() {
  if(imageSelector){
    imageSelector.value.click()
  } 
}

const onSubmit = ( async() => {
    const accessToken = localStorage.getItem('access_token')

    const response = await updatePost(accessToken, postForm.value , props.id)
    .then(() => {
        toast.success("¡Post actualizado!", {
            autoClose:1000,
        })
        router.push({name: 'posts'})

        }).catch((error) => {
            if (error.response.data.data.message.main_picture[0] === 'The main picture must not be greater than 2048 kilobytes.') {
                toast.error("Debes incluir una imagen en tu post de menos de 2Mb", {
                    autoClose:1000,
                })
            } else if (error.response.data.data.message.main_picture[0] === 'The main picture field is required.') {
                toast.error("Debes actualizar la imagen", {
                    autoClose:1000,
                })
            }
        })
})

onMounted(async() => {
    await getPostById()
})


</script>

<style lang="scss" scoped>

.card {
    margin-top: 100px;
    width: 60%;
    padding: 16px;
    border-radius: 10px;
    box-shadow: 1px 1px 2px  #fff6e3 , -1px -1px 2px  #fff6e3, 2px 2px 2px  #fff6e3 , -2px -2px 2px  #fff6e3 ;
    background-color: rgba(224, 236, 247, 0.059);
}

.image-container {
    border: 1px dashed #ffc443;
    border-radius: 8px;
    height: 200px;
    max-height: 200px;
    width: 50%;
    background-color: #ffc3431a;
}
.img-fluid {
    max-height: 100%;
    max-width: 100%;
}

.description {
    width: 100%;
    height: 200px;
}

.titleInput {
    border: 1px solid rgb(200, 200, 200);
    border-radius: 5px;
    background-color: #ffc3431a;
    transition: all 0.2s;
}

.titleInput:focus {
        box-shadow: none !important;
        background-color: #fff;
        border: 2px solid #ffab02 !important;
}

textarea {
    background-color: #ffc3431a;
    transition: all 0.2s;
}

textarea:focus {
    box-shadow: none !important;
    background-color: #fff;
    border: 2px solid #ffab02 !important;
}

.post-btn {
    float: right;
    background-color: transparent;
    border: 2px solid #ffab02;
    transition: all 0.4s;
    width: 100px;

    &:hover{
        background-color: #fce3b2;
        transition: all 0.4s;
    }
}

@media (max-width: 575px) {
    .card {
        margin-top: 65px;
        width: 90%;
    }   

    .image-container {
        height: 150px;
    }
    .description {
        height: 150px;
    }
}
</style>