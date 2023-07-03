<template>
    <div class="datebar-container w-100 d-flex flex-column justify-content-end align-items-center">
        <button class="reset btn" @click="resetEvents()"><i class="bi bi-caret-left">Mostrar todos los eventos</i></button>
        <div class="year d-flex justify-content-center align-items-center gap-3">
            <button v-show="selectedYear > actualYear" class="btn" @click="decreaseYear()"><i class="bi bi-caret-left"></i></button>
            <button v-show="selectedYear === actualYear" class="btn-x btn"><i class="bi bi-x-lg"></i></button>
            <h1>{{ selectedYear }}</h1>
            <button class="btn" @click="increaseYear()"><i class="bi bi-caret-right"></i></button>
        </div>
        <span class="dropdown-toggle  pb-3" type="button" aria-haspopup="true" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          Mes <i class="bi bi-caret-down"></i>
        </span>
        <div class="month-container d-flex gap-3 pb-2">
            <a v-for="month in months" :key="month" :class="{ 'selected': month === monthSelected, 'past-month': isPastMonth(month) }" class="dropdown-item month" @click="chooseMonth(month)">{{ month }}</a>
        </div>
        <div class="dropdown-menu drowdown-menu-right" aria-labelledby="dropdownMenuButton1">
            <li v-for="month in months" :key="month" :class="{ 'selected': month === monthSelected, 'past-month': isPastMonth(month) }" class="dropdown-item month" @click="chooseMonth(month)"><a>{{ month }}</a></li>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, defineEmits, onMounted } from 'vue';
import moment from 'moment/dist/moment'
import 'moment/dist/locale/es'

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const monthsEng = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
// const monthsEng = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Agost', 'September', 'October', 'November', 'December']
const actualYear = moment().format('YYYY')
const actualMonth = moment().format('MMMM')
const monthSelected = ref(moment().format('MMMM'))
const selectedYear = ref(moment().format('YYYY'))
const selectedMonth = ref(moment().format('MMMM'))
const emit = defineEmits(['loadAllEvents','selectedDate'])

const decreaseYear = () => {
    const yearNumber: Number = parseInt(selectedYear.value, 10) - 1
    selectedYear.value = yearNumber.toString()
    const year = selectedYear.value
    const month = selectedMonth.value
    const selectedDate = {
        month,
        year
    }
    emit('selectedDate',selectedDate)
}

const  increaseYear = () => {
    const yearNumber: Number = parseInt(selectedYear.value, 10) + 1
    selectedYear.value = yearNumber.toString()
    const year = selectedYear.value
    const month = selectedMonth.value
    const selectedDate = {
        month,
        year
    }
    emit('selectedDate',selectedDate)
}

const chooseMonth = (month: string) => {
    monthSelected.value = month
    const monthIndex = months.indexOf(month)    
    selectedMonth.value = monthsEng[monthIndex]
    month = selectedMonth.value    
    const year = selectedYear.value
    const selectedDate = {
        month,
        year
    }
    emit('selectedDate',selectedDate)
}

const isPastMonth = (month: string) => {    
    const yearSelected = parseInt(selectedYear.value, 10)
    const currentYearNumber = parseInt(actualYear, 10)
    const currentMonth = monthsEng.indexOf(actualMonth)       
    const monthIndex = months.indexOf(month)

    return yearSelected < currentYearNumber || (yearSelected === currentYearNumber && monthIndex < currentMonth)
}

const resetEvents = () => {
    selectedYear.value = moment().format('YYYY')
    selectedMonth.value = moment().format('MMMM')
    monthSelected.value = moment().format('MMMM')

    emit('loadAllEvents')
}

onMounted(() => {
    isPastMonth(moment().format('MMMM'))
})

</script>

<style lang="scss" scoped>

.reset {
    position: absolute;
    top: 10px;
    right: 10px;
    transform: translate(0%, -15%);
    color: white
}

.dropdown-toggle {
    color: white;
    display: none;
    
}

.dropdown-toggle::after {
    content: none;
}

.datebar-container {
    width: 100%;
    margin-top: 80px;
    height: 150px;
    background: linear-gradient(220.55deg, #75ACFF 0%, #428EFF 50%, #277dff 100%);
    position: absolute;
}

.year {
    color: white;
    font-size: 24px;
    margin-bottom: 15px;
     .btn {
        color:white
     }

     .btn-x {
        color:rgb(243, 44, 44);
     }
}

.month {
    color:white;
    cursor: pointer;
    text-decoration: none;
}
.selected {
    padding: 5px;
    background-color: #75ACFF;
    border-radius: 15px;
}

.dropdown-menu {
    background-color: #4891ff;
}

.past-month {
  color: rgb(243, 44, 44);
  cursor: not-allowed;
  pointer-events:none;
}

@media (max-width: 830px) {

    .month-container {
        display: none !important;
    }

    .dropdown-toggle {
    display: flex;
    }

}

@media (max-width: 575px) {

    .reset {
    position: absolute;
    top: 10px;
    right: 10px;
    transform: translate(0%, -15%);
    color: white
    }

    .datebar-container {
        margin-top: 60px;
    }

}
</style>