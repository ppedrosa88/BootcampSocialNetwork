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
                    <a @click="showRemoveModal" class="button me-2 link-unstyled"><i class="bi bi-trash"></i></a>
                    <a @click="pushToEdit()" class="button me-2 link-unstyled"><i class="bi bi-pencil-square"></i></a>
                </div>
            </div>

            <div class="event-container d-flex flex-column justify-content-center align-items-center">

                <div class="image-container d-flex justify-content-center align-items-center pe-3">
                    <img :src="event.main_picture" class="image img-fluid object-fit-cover"/>
                </div>

                <div class="event-info d-flex flex-column justify-content-between align-self-start">
                    <div class="info-event d-flex flex-column ms-4">
                        <h3 class="card_title" @click="pushToShow()">{{ event.title }}</h3>
                        <i class="date bi bi-calendar4">{{ ' Inicio: ' + dateFormat }}</i>
                        <i class="bi bi-clock">{{' Duración: ' + duration }}</i>
                        <i class="bi bi-geo-alt">{{ ' ' + event.location.name }}</i>
                        <div class="text-container">
                            <p class="card-text me-3 mt-3 mb-3">{{ event.description }}</p>
                        </div>
                    </div>
                </div>

            </div>
            <div class="map-box d-flex justify-content-center align-items-center mt-2 mb-3 overflow-hidden align-self-center">
                <img src="../assets/mapa.JPG" class="map-image img-fluid object-fit-cover"/>
            </div>
            <div class="d-flex justify-content-around">
                <i class="bi bi-heart likes">{{ ' ' + event.likes }}</i>
                <i class="bi bi-chat comments">{{ commentsComp }}</i>
                <i class="bi bi-people">{{ ' ' + event.max_participants }}</i>
            </div>

        </div>
    </div>
    <RemoveModal v-if="removeModal" @closeModal="closeModal()"
                @removePost="removeEvent()"/>

</template>

<script setup lang="ts">

import { computed, defineProps, ref, onMounted } from 'vue';
import moment from 'moment';
import 'moment/locale/es' 
import { useRouter } from 'vue-router';
import RemoveModal from './RemoveModal.vue';
import { removeUserEvent } from '../helpers/EventsData'
import { toast } from 'vue3-toastify';

const center = ref({ lat: 36.7155947, lng: -4.4236573 });

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

const initializeMap = () => {
    center.value.lat = props.event.location.x
    center.value.lng = props.event.location.y
}

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

const duration = computed(() => {
    const duration = moment.duration(props.event.duration * 1000).asHours()
    const hours = Math.trunc(duration)
    const minutes = moment.duration((duration - hours) * 3600000).asMinutes()

    if(minutes == 0){
        return `${hours}h`
    } else {
        return `${hours}h ${minutes}min`
    }
    
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
        .then((response) => {
            removeModal.value = false
            toast.success("¡Evento eliminado con exito!", {
                autoClose:1000,
            })
            emit('remove')
        })
        .catch(() => {
            toast.error("No se ha podido eliminar", {
                autoClose:1000,
            })
        })
}

onMounted(() => {
    initializeMap()
})

</script>

<style lang="scss" scoped>

.map-image {
    display: flex;
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
}

.map-box {
    width: 60%;
    height: 240px;
    border-radius: 10px;
    border: 2px solid rgb(206, 203, 203);
}

.image-container {
    height: 250px;
    width: 250px;
    min-height: 250px;
    min-width: 250px;
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

.text-container {
    width: 100%;
    .card-text {
        flex: 1;
        text-align: justify;
        text-justify: inter-word;
    }
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

@media (max-width: 1200px) {
    .card {
    width: 70%;
    }
    .map-box {
    width: 65%;
    }
}

@media (max-width: 992px) {

    .card {
    width: 80%;
    }
    .map-box {
    width: 75%;
    }

}

@media (max-width: 768px) {
    .card {
        width: 95%;
    }
    .map-box {
    width: 75%;
    }
}

@media (max-width: 535px) {
    .card {
        width: 95%;
    }
    .map-box {
    width: 90%;
    }
}
</style>