<template>
    <div class="card">
        <div class="card_body d-flex flex-column gap-1">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                    <img class="user-avatar rounded-circle border border-2 ms-1" v-if="event.user.profile" :src="event.user.profile.avatar"/>
                    <img class="user-avatar rounded-circle border border-2"  v-if="!event.user.profile" src="../assets/bootcamp_logo.svg"/>
                    <p class="user-name h6">{{ event.user.name }} </p>
                </div>
                <div v-if="event.user.id === userIdLocal()" class="button-group d-flex flex-row-reverse pe-3 gap-1">
                    <a @click="showRemoveModal()" class="button me-2 link-unstyled"><i class="bi bi-trash"></i></a>
                    <a @click="pushToEdit()" class="button me-2 link-unstyled"><i class="bi bi-pencil-square"></i></a>
                </div>
            </div>

            <div class="event-container w-100 d-flex">

                <div @click="pushToShow()" class="image-container d-flex justify-content-center align-items-center pe-3">
                    <img :src="event.main_picture" class="image img-fluid object-fit-cover"/>
                </div>

                <div class="event-info w-100 d-flex flex-column flex-column">
                        <div class=" title-box d-flex justify-content-between">
                            <h3 class="card_title" @click="pushToShow()">{{ event.title }}</h3>
                            <i class="bi bi-bookmarks me-2">{{' Asistir'}}</i>
                        </div>
                        <i class="date bi bi-calendar4">{{ '  ' + dateFormat }}</i>
                        <i class="bi bi-clock">{{ '  Duración: ' + getDuration }}</i>
                        <i v-if="event.online == '0'" class="bi bi-geo-alt">{{ '  ' + event.location.name }}</i>
                        <div v-if="event.online == '1'" class="d-flex gap-1">
                            <i class="bi bi-geo-alt">{{ '  Online' }}</i>
                        </div>
                        <div class="text-container w-100">
                            <p class="card-text ms-3 mt-2">{{ event.description }}</p>
                        </div>
                </div>

            </div>

            <div class="d-flex justify-content-around">
                <i @click="likeDislike()" class="like bi bi-heart likes">{{ ' ' + like }}</i>
                <i class="bi bi-chat comments">{{ commentsComp }}</i>
                <i class="bi bi-people">{{ ' max: ' + event.max_participants }}</i>
            </div>


        </div>
    </div>
    <RemoveModal v-if="removeModal" @closeModal="closeModal()"
                @removePost="removeEvent()"/>

</template>

<script setup lang="ts">

import { computed, defineProps, ref } from 'vue';
import moment from 'moment';
import 'moment/locale/es' 
import { useRouter } from 'vue-router';
import RemoveModal from './RemoveModal.vue';
import { removeUserEvent, likeIt } from '../helpers/EventsData'
import { toast } from 'vue3-toastify';

const emit = defineEmits(['remove'])
const router = useRouter()
const route = window.location.pathname
const removeModal = ref(false)

const props = defineProps({
    event: {
        type: Object,
        required: true
    }
})

const like = ref(props.event.likes)
const userIdLocal = () => {
    const identity = localStorage.getItem('id')
    if(identity) {
        return parseInt(identity)
    }
}

const commentsComp = computed(() => {
    let commentNumber = ''
    if (props.event.comments > 1) {
        commentNumber = ` ${props.event.comments} comentarios`
    } else if (props.event.comments === 1) {
        commentNumber = ` ${props.event.comments} comentario`
    } else {
        commentNumber = ' 0 comentarios'
    }
    return commentNumber
})

const dateFormat = computed(() => {
    moment.locale('es')
    const date = moment(props.event.date * 1000).format('DD/MM/YYYY, HH:mm')
    return date
})

const pushToShow = (() => {    
    if (route === '/events') {
        router.push({
            name: 'event', 
            params:{
                id: String(props.event.id)
            }})
    }
}) 

const pushToEdit = (() => {
    router.push({
            name: 'editev', 
            params:{
                id: String(props.event.id)
            }})
})

const showRemoveModal = () => {
    removeModal.value = true
}

const closeModal = () => {
    removeModal.value = false
}

const removeEvent = async() => {
    await removeUserEvent(props.event.id)
        .then(() => {
            removeModal.value = false
            toast.success("¡Evento eliminado con exito!", {
                autoClose:1000,
            })
            
            emit('remove', props.event.id)
        })
}

const getDuration = computed(() => {
    const duration = moment.duration(props.event.duration * 1000).asHours()
    const hours = Math.trunc(duration)
    const durationMinutes = moment.duration((duration - hours) * 3600000).asMinutes()
    const minutes = Math.trunc(durationMinutes)

    if(minutes == 0){
        return `${hours}h`
    } else {
        return `${hours}h ${minutes}min`
    }
})

const likeDislike = async() => {
    await likeIt(props.event.id)
        .then(() => {
            // window.location.reload()
        })
        .catch(() => {
            toast.error("No puedes dar like a tu propio evento", {
                autoClose:1000,
            })
        })
}

</script>

<style lang="scss" scoped>

.like {
    cursor: pointer;
}

.image-container {
    min-height: 250px;
    min-width: 250px;
    max-width: 250px;
    max-height: 250px;
    cursor: pointer;
    padding-left: 12px;
}

.image {
    max-width: 100%;
    max-height: 250px;
    border-radius: 10px !important;
}

.user-avatar {
    width: 50px;
    height: 50px;
}

.button-group {
    padding-bottom: 10px !important;
    padding-right: 0px !important;
}

    .card-text {
        width: 100%;
        flex: 1;
        overflow: hidden;
        display: -webkit-box;
            -webkit-line-clamp: 4;
                    line-clamp: 4; 
            -webkit-box-orient: vertical;
            text-align: justify;
            text-justify: inter-word;
        padding-right: 24px; 
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
    width: 100%;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
        -webkit-line-clamp: 1;
                line-clamp: 1; 
        -webkit-box-orient: vertical;
        text-align: justify;
        text-justify: inter-word;
    padding-right: 24px; 
    cursor: pointer;
}

@media (max-width: 1400px) {

}

@media (max-width: 1200px) {
    .card {
    width: 70%;
    }
}

@media (max-width: 992px) {

    .card {
    width: 80%;
    }

    .image-container {
    width: 250px;    
    height: 150px;
    max-width: 250px;
    padding: 0 !important;
    padding-right: 12px !important;
    }
}

@media (max-width: 768px) {
    .event-container {
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center;
        gap: 12px;
    }

    .card {
        width: 95%;
    }
    .event-info {
        align-self: start;
        padding-left: 12px;
        padding-bottom: 12px;
    }
    .card-text {
        margin-left: 0px !important;
    }

}
@media (max-width:535px) {
    .title-box {
        flex-direction: column;
        margin-bottom: 20px;
    }
}

</style>