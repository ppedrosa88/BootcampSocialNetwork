import { createApp } from 'vue' 
import './styles/styles.scss'
import 'bootstrap/dist/js/bootstrap.min.js'
import '/node_modules/bootstrap-icons/font/bootstrap-icons.scss'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'

const emitter = mitt()

createApp(App)
    .provide('emitter', emitter)
    .use(router)
    .mount('#app')
