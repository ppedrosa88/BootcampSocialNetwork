<template>
    <div class="event-container d-flex justify-content-center flex-column align-items-center">
        <button @click="router.push({name: 'events'})" class="btn post-btn align-self-start"> <i class="bi bi-arrow-left">{{'  Volver'}} </i></button>
        <EventCardExpand @remove="refresh()" v-if="event" :event="event"/>
    </div>
    <LoadingComp v-if="load"/>
    <NoEvent v-if="!load && !eventExists"/>
    <RemoveModal v-if="removeModal" @closeModal="closeModal()"
        @removePost="removeEvent()"/>

</template>

<script setup lang="ts">

import 'moment/locale/es' 
import EventCardExpand from './EventCardExpand.vue';
import RemoveModal from './RemoveModal.vue'
import { defineProps, ref, onBeforeMount } from 'vue';
import { eventsById } from '../helpers/EventsData'
import LoadingComp from './LoadingComp.vue';
import { toast } from 'vue3-toastify';
import NoEvent from './NoEventCard.vue';
import { useRouter } from 'vue-router';

const removeModal = ref(false)
const eventExists = ref(true)
const load = ref(false)
const router = useRouter()

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const event = ref()

const showRemoveModal = () => {
    removeModal.value = true
}

const closeModal = () => {
    removeModal.value = false
}

const removeEvent = () => {
    
}

const getEventById = async() => {
    load.value = true
    const resp = await eventsById(props.id)
        .then(({data}) => {
            if(data.data != null) {
                event.value = data.data
                load.value = false
            } else if(data.data === null) {
                toast.error("Error, no se ha podido cargar el evento", {
                  autoClose:2000,
                })
                load.value = false
                eventExists.value = false
                // TODO: vista cuando no hay eventos
            }
        })
        .catch(() => {
            toast.error("Error, no se ha podido cargar el evento", {
              autoClose:1000,
            })
            load.value = false
            eventExists.value = false
        })
}

const refresh = () => {
    setTimeout(() => {
        router.push({name: 'events'})
    },1500)
}

onBeforeMount(() => {
    getEventById()
})

</script>

<style scoped lang="scss">
.event-container {
    margin-top: 100px;
}

.post-btn {
    background-color: transparent;
    border: 2px solid #ffab02;
    transition: all 0.4s;
    width: 100px;
    margin-left: 24px;
    &:hover{
        background-color: #fce3b2;
        transition: all 0.4s;
    }
}
</style>