<template>
    <form @submit.prevent="onSubmit" class="new-event-container d-flex justify-content-center flex-column align-items-center">
        <div class="new-event-box d-flex">
            <div class="box-left d-flex flex-column">
                <div class="image-container  w-auto  overflow-hidden justify-content-center d-flex align-items-center"
                    @click="onSelectImage">
                    <p v-if="!eventImage" class="text-warning p-2">Pulse aquí para insertar una imagen</p>
                    <img v-if="eventImage" :src="eventImage" class="image-fluid object-fit-cover"/>
                    <input type="file" 
                        enctype="multipart/form-data"
                        @change="onSelectedImage"
                        ref="imageSelector"
                        v-show="false"
                        accept=".jpg,.png,.jpeg,.csv"/>
                </div>
                <div class="info-container d-flex flex-column">
                    <div class="form-floating mb-3">
                      <input v-model="eventForm.title" maxlength="35" type="text" class="form-control" id="floatingInput" placeholder="name@example.com" required>
                      <label for="floatingInput">Título</label>
                    </div>
                    <div class="form-floating w-100 content">
                      <textarea v-model="eventForm.description" maxlength="400" class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px" required></textarea>
                      <label for="floatingTextarea2">Descripción</label>
                    </div>
                </div>
            </div>
            <div class="box-right d-flex flex-column align-items-center">
                <label class="align-self-start">Selecciona la fecha y hora del evento...</label>
                <div class=" date-container d-flex justify-content-between p-2 gap-3 align-items-center mt-3">
                  <div class="startDate">
                    <label>Inicio:</label>               
                    <VueDatePicker v-model="date" class="datapicker" required/>
                  </div>
                  <div class="endDate">
                    <label>Fin:</label>
                    <VueDatePicker v-model="duration" class="datapicker" required/>
                  </div>  
                </div>
                <label class="align-self-start mt-4">Selecciona su localización...</label>

                  <div class="map-box d-flex justify-content-center align-items-center mt-3 overflow-hidden align-self-center">
                      <img src="../assets/mapa.JPG" class="map-image img-fluid object-fit-cover"/>                    
                  </div>
                <div class="event-options-box mt-4 d-flex justify-content-center align-items-center gap-3">
                    <div class="form-floating mb-3">
                      <input v-model="eventForm.location_name" type="text" class="form-control" id="floatingInput" placeholder="name@example.com">
                      <label for="floatingInput">Nombre de localización</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input v-model="eventForm.max_participants" type="number" class="form-control" id="floatingInput" placeholder="name@example.com" required>
                      <label for="floatingInput">Participantes</label>
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
              <button @click="router.push({name: 'events'})" class="btn post-btn">Cancelar</button>
          </div>    
        </form>      
</template>

<script setup lang="ts">

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { createEvent } from '../helpers/EventsData'
import moment from 'moment/dist/moment';
import 'moment/dist/locale/es'
import { toast } from 'vue3-toastify';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const center = ref({ lat: 36.7155947, lng: -4.4236573 });

const router = useRouter()
const eventImage = ref()
const imageSelector = ref()
const date = ref()
const duration = ref()
const checkBox = ref(false)
const eventForm = ref({
  title:'',
  description:'',
  main_picture:'',
  published:'1',
  max_participants:'',
  date:'',
  location_name:'',
  location_x: 0,
  location_y: 0,
  online:'0',
  duration:''
})

const onSubmit = async() => {

  eventForm.value.location_x = center.value.lat
  eventForm.value.location_y = center.value.lng

  console.log(eventForm.value.location_x, eventForm.value.location_y );
  

  const validateForm = validate()
  if(validateForm){
    await createEvent(eventForm.value)
      .then(() => {
        toast.success("¡Evento creado con exito!", {
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
  if(eventForm.value.main_picture) {
    if(duration.value != null && date.value != null){
      const durationDiff = getTimeAndDuration(date.value, duration.value)
      
        if (durationDiff < -1) {
          toast.error("La fecha final debe ser mayor a la inicial", {
            autoClose:1000,
          })
          resetTime()
          return false
        } else if(durationDiff == -1) {
          toast.error("La fecha de inicio es anterior a hoy", {
            autoClose:1000,
          })
          resetTime()
          return false
        } else if (durationDiff == 0) {
          toast.error("La fechas de inicio y fin son las mismas", {
            autoClose:1000,
          })
          resetTime()
          return false
        }
    }

    if(checkBox.value == true){
      eventForm.value.online = '1'
      eventForm.value.location_name = 'online'
      eventForm.value.location_x = '0'
      eventForm.value.location_y = '0'
      return true
    } else if(checkBox.value == false) {
      eventForm.value.online  = '0'
      if(eventForm.value.location_name != '' && eventForm.value.location_x != '' && eventForm.value.location_y != ''){
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
  duration.value = ''
  date.value = ''
  eventForm.value.duration = ''
}

const getTimeAndDuration = (startTime:string, endTime:string) => {
  
  const timeStart = moment(startTime).locale('es').unix()
  const currentTime = moment().locale('es').unix()

  if(currentTime > timeStart) {
    return -1
  }
  eventForm.value.date = timeStart
  const timeEnd = moment(endTime).unix()

  const duration = timeEnd - timeStart
  eventForm.value.duration = duration.toString()

  return duration
}

const onSelectedImage = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file: File | undefined = target.files[0]
    if(!file){
        eventImage.value = ''
        eventForm.value.main_picture = ''
      return 
    }

    eventForm.value.main_picture = file
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

</script>

<style scoped lang="scss">

.new-event-container {
  padding-top: 100px;
  width: 100%;
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

.image-fluid {
  max-height: 100%;
  max-width: 100%;
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

.startDate {
  width: 50%;
}

.endDate {
  width: 50%;
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
    border: 2px solid rgb(206, 203, 203);
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
    width: 300px !important; 
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
      width: 100% !important;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .endDate {
      width: 100% !important;
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