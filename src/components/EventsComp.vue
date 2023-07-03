<template>
    <div class="body_container">
        <DateBar @loadAllEvents="loadEvents()" @selectedDate="(selectedDate) => filterByDate(selectedDate)" />
        <div class="container-events d-flex flex-column align-items-center">
            <EventsCard @remove="(id) => refresh(id)"
                v-if="events && !load" 
                v-for="event in events.reverse()" 
                :key="event" 
                :event="event"/>
            <Loading v-if="load"/>
            <NoEvent v-if="!eventExist && !load"/>
        </div>
    </div>
</template>

<script setup lang="ts">

import DateBar from './DateBar.vue'
import EventsCard from './EventsCard.vue'
import { onMounted, ref } from 'vue'
import { eventsLoad, searchByQuery } from '../helpers/EventsData'
import NoEvent from './NoEventCard.vue'
import Loading from './LoadingComp.vue'
import moment from 'moment/dist/moment'
import { emitter } from '../helpers/PostsData'

const events = ref([])
const load = ref(false)
const eventExist = ref (true)

const loadEvents = async() => {
    eventExist.value = true

    events.value = []
    load.value = true
    const resp  = await eventsLoad()
        .then((response) => {
            events.value = response.data.data
            load.value = false
        })
        .catch(() => {
            load.value = false
            eventExist.value = false
        })
}

const filterByDate = async(selectedDate: {month?:string, year?:string}) => {
    eventExist.value = true

    const {month, year} = selectedDate
    const date = moment(`01 ${month} ${year}`,'DD MMMM YYYY')
    const futureDate = date.clone().add(1,'months')
    const dateTimeStamp = date.unix()
    const futureTimeStamp = futureDate.unix()
    
    await loadEvents()

    const filterEventsByDate = events.value.filter( event => {
        if (event.date >= dateTimeStamp && event.date < futureTimeStamp) {
            return true
        } else return false
    })

    events.value = filterEventsByDate   

    if (filterEventsByDate.length === 0) {
        eventExist.value = false
    } 
}

const currentDateFilter = (eventsToFilter) => {
    const currentDate = moment().unix()

    const filterEventsByDate = eventsToFilter.filter( event => {
        if (event.date >= currentDate) {
            return true
        } else return false
    })
    events.value = filterEventsByDate
    if (events.value.length === 0) {
        eventExist.value = false
    } else {
        eventExist.value = true
    }
}

onMounted(async() => {
    emitter.on('searchInput', async (data) => {        
        if (data === ''){
            // filterPost(data.value)
            loadEvents()
        } else {
            await searchByQuery(data)
            .then((resp) => {
                const eventsToFilter = resp
                currentDateFilter(eventsToFilter)
                load.value = false
                if (events.value.length === 0) {
                    load.value = false
                    eventExist.value = false
                }
            })
            .catch(() => {
                eventExist.value = false
                loadEvents()
            })
        }
    })
    loadEvents()
})

const refresh = (id) => {
    const index = (events.value.findIndex(x => x.id === id))
    if (index > -1) {
        events.value.splice(index,1)       
    }
}

</script>

<style>

.body_container {
    position: relative;
    width: 100vw;
}

.container-events {
    width: 100vw;
    top:250px;
    position: absolute;
    max-height: calc(100vh - 250px - 20px);
    overflow-y: auto;
}

@media (max-width: 575px) {

    .container-events {
        top:215px;
    }
    .container-events {
        max-height: calc(100vh - 225px);
    }
}

</style>