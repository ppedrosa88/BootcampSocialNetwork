<template>
  <form @submit.prevent="onSubmit" class="new-event-container d-flex justify-content-center flex-column align-items-center">
      <div class="new-event-box d-flex">
          <div class="box-left d-flex flex-column">
              <div class="image-container overflow-hidden justify-content-center d-flex align-items-center"
                  @click="onSelectImage">
                  <p v-if="!eventImage" class="text-warning p-2">Pulse aquí para insertar una imagen</p>
                  <img :src="eventImage" class=" w-100"/>
                  <input type="file" 
                      enctype="multipart/form-data"
                      @change="onSelectedImage"
                      ref="imageSelector"
                      v-show="false"
                      accept=".jpg,.png,.jpeg,.csv"/>
              </div>
              <div class="info-container d-flex flex-column">
                  <div class="form-floating mb-3">
                    <input v-model="event.title" type="text" class="form-control" id="floatingInput" placeholder="Título">
                    <label for="floatingInput">Título</label>
                  </div>
                  <div class="form-floating">
                    <textarea v-model="event.description" class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">Descripción</label>
                  </div>
              </div>
          </div>
          <div class="box-right d-flex flex-column align-items-center">
              <label class="align-self-start">Selecciona la fecha y hora del evento...</label>
              <div class=" date-container d-flex justify-content-between p-2 gap-3 align-items-center mt-3">
                <div class="startDate">
                  <label>Inicio:</label>
                  <VueDatePicker v-model="startDate" class="datapicker"/>
                </div>  
                <div class="endDate">
                  <label>Fin:</label>
                  <VueDatePicker v-model="endDate" class="datapicker"/>
                </div>
              </div>
              <label class="align-self-start mt-4">Selecciona su localización...</label>
              <div class="map-box d-flex justify-content-center align-items-center mt-3 overflow-hidden align-self-center">
                <img src="../assets/mapa.JPG" class="map-image img-fluid object-fit-cover"/>
              </div>
              <div class="event-options-box mt-4 d-flex justify-content-center align-items-center gap-3">
                  <div class="form-floating mb-3">
                    <input v-model="event.location.name" type="text" class="form-control" id="floatingLocat" placeholder="name@example.com">
                    <label for="floatingLocat">Nombre de localización</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input v-model="event.max_participants" type="number" class="form-control" id="floatingPart" placeholder="name@example.com">
                    <label for="floatingPart">Participantes</label>
                  </div>
                  <div class="form-check">
                    <input v-model="checkBox" class="form-check-input checkbox" type="checkbox" id="flexCheckDefault">
                    <label class="form-check-label " for="flexCheckDefault">
                        Online
                    </label>
                </div>
              </div>
          </div>
        </div>
        <div class="d-flex gap-3">
            <input type="submit" class="btn post-btn"/>
            <button @click="toEvents()" class="btn post-btn">Cancelar</button>
        </div>   
      </form>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import moment from 'moment/dist/moment';
import { ref, onBeforeMount } from 'vue';
import { eventsById, updateEvent } from '../helpers/EventsData'
import { toast } from 'vue3-toastify';
import '@vuepic/vue-datepicker/dist/main.css'
import 'moment/dist/locale/es'
import { useRouter } from 'vue-router';

const center = ref({ lat: 36.7155947, lng: -4.4236573});
const imageSelector = ref()
const checkBox = ref()
const startDate = ref()
const endDate = ref()
const eventImage = ref()
const router = useRouter()

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const event = ref({
  title: '',
  description:'',
  main_picture:null,
  published:'',
  max_participants:'',
  date:'',
  location: {},
  online: '',
  duration:''
})

const initialization = () => {
  eventImage.value = event.value.main_picture
  event.value.main_picture = null
  center.value.lat = event.value.location.x
  center.value.lng = event.value.location.y
  
  startDate.value = moment.unix(event.value.date).locale('es').format('MM/DD/YYYY, HH:mm')

  const durat =  event.value.date + Number(event.value.duration)
  endDate.value = moment.unix(durat).locale('es').format('MM/DD/YYYY, HH:mm') 

  if(event.value.online == '1') {
    checkBox.value = true
  } else if (event.value.online == '0') {
    checkBox.value = false
  }
}

const onSubmit = async() => {
  const validateForm = validate()  
  
  if(validateForm){
   
    await updateEvent(event.value)
      .then(() => {
        toast.success("¡Evento editado con éxito!", {
            autoClose:1000,
        })
            router.push({name: 'events'})
      })
      .catch((error) => {
        if (error.response.status == 422) {
          toast.error("La foto debe de tener menos de 2MB", {
              autoClose:1000,
          })
        }
      })
  }
}

const validate = () => {
  if(event.value.main_picture != null) {
    if(endDate.value != null && startDate.value != null){
      const durat = getTimeAndDuration(startDate.value, endDate.value)
      
        if (durat < -1) {
          toast.error("La fecha final debe ser mayor a la inicial", {
            autoClose:1000,
          })
          resetTime()
          return false
        } else if(durat == -1) {
          toast.error("La fecha de inicio es anterior a hoy", {
            autoClose:1000,
          })
          resetTime()
          return false
        } else if (durat == 0) {
          toast.error("La fechas de inicio y fin son las mismas", {
            autoClose:1000,
          })
          resetTime()
          return false
        }
    }

    if(checkBox.value == true){
      event.value.online = '1'
      return true
    } else if(checkBox.value == false) {
      event.value.online  = '0'
      if(event.value.location_name != '' && event.value.location_x != '' && event.value.location_y != ''){
        return true
      } else {
        toast.error("Debe introducir la localización y su nombre, o en su defecto, online", {
            autoClose:1000,
          })
      }
    }  
  } else {
        toast.error("Debes insertar una imagen", {
            autoClose:1000,
        })
      }
  return false
}

const resetTime = () => {
  endDate.value = ''
  startDate.value = ''
  event.value.duration = ''
}

const getTimeAndDuration = (startTime:string, endTime:string) => {
  
  const timeStart = moment(startTime).locale('es').unix()
  const currentTime = moment().locale('es').unix()

  if(currentTime > timeStart) {
    return -1
  }
  event.value.date = timeStart
  const timeEnd = moment(endTime).unix()

  const duration = timeEnd - timeStart
  event.value.duration = duration.toString()

  return duration
}

const getEventById = async() => {
    const resp = await eventsById(props.id)
        .then(({data}) => {
            event.value = data.data         
        })
}

const onSelectedImage = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file: File | undefined = target.files[0]
    if(!file){
        event.value.main_picture = null
        eventImage.value = null
      return 
    }
    
    event.value.main_picture = file
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageDataURL = e.target?.result as string;
      eventImage.value = imageDataURL;
    }
    reader.readAsDataURL(file);
}

function onSelectImage() {
  if(imageSelector){
    imageSelector.value.click()
  } 
}

const toEvents = () => {
  router.push({name: 'events'})
}

onBeforeMount(async() => {
  await getEventById()
  await initialization()
})

</script>

<style scoped lang="scss">

.new-event-container {
    padding-top: 100px;
    width: 100%;
    padding-bottom: 40px;
}

.new-event-box {
    width: 80%;
}

.image-container{
    background-color: rgb(190, 223, 252);
    border: 1px dashed #ffc443;
    width: 25vw !important; 
    height: 250px !important;
    margin-top: 20px;
    margin-left: 20px;
    border-radius: 10px;    
    background-color: #ffc3431a;
}

.info-container {
    width: 25vw;
    height: 200px;
    margin: 20px;
}

.date-container {
  background-color: rgb(190, 223, 252);
  border: 1px dashed #ffc443;
  background-color: #ffc3431a;
  border-radius: 10px;
  width: 100%;
}

.box-right {
    width: 70vw;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 10px;    
}

.map-image {
    display: flex;
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
}

.map-box {
    width: 80%;
    height: 15vw;
    border-radius: 10px;
    border: 2px solid rgb(206, 203, 203);
}

.event-options-box {
  width: 100%;
}

input[type="text"], input[type="number"], textarea {
    border: 1px solid rgb(200, 200, 200);
    border-radius: 5px;
    background-color: #ffc3431a;
    transition: all 0.2s;
}

input[type="text"]:focus, input[type="number"]:focus, textarea:focus{
        box-shadow: none !important;
        background-color: #fff;
        border: 2px solid #ffab02 !important;
}

.datapicker {
  width: 100%;
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

.checkbox {
    appearance: none;
    border: 2px solid #ffab02;
    color: #ffab02;
    cursor: pointer;
    background-color: #fff;
    transition: all 0.4s;

    &:hover{
        background-color: #fce3b2;
        transition: all 0.4s;
    }

    &:focus{
        transition: all 0.4s;
        box-shadow: none !important;
    }

    &:checked {
        background-color: #ffab02;
    }
}

@media (max-width: 992px) {

  .new-event-box {
    width: 70%;
    flex-wrap: wrap;
  }

  .box-left {
    width: 100%;
    justify-content: center !important;
    align-items: center;
  }
  .box-right {
    margin-top: 0px !important;
    margin-right: 0px !important;
  }

  .image-container{
    width: 250px !important; 
    height: 250px !important;
    margin-left: 0px !important;
  }

  .info-container {
    width: 100%;
    margin-bottom: 0px;
  }


  .date-container {
    width: 100%;
    flex-direction: column !important;
    .startDate {
      width: 100%;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .endDate {
      width: 100%;
      display: flex;
      gap: 30px;
      align-items: center;
    }

  }

  .map-box {
    width: 100%;
    height: 30vw;
  }

  .event-options-box {
    width: 100%;
    flex-direction: column;
    align-items:start !important;
    gap: 6px !important;
    margin-bottom: 12px;
  }

  .datapicker {
    width: 100%;
  }
}
</style>