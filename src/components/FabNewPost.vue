<template>
    <button @click="redirect()" class="btn btn-primary fixed-button">
        <i class="bi bi-plus-lg h3 icon"></i>
    </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
    route: {
        type: String,
        required: true
    }
})

const redirect = () => {
    if(props.route.includes('post')) {
        router.push({name: 'new'})
    } else if(props.route.includes('event')) {
        router.push({name: 'newev'})
    }
}

</script>

<style scoped lang="scss">
    .fixed-button {
        position: fixed;
        bottom: 25px;
        right: 25px;
        width: 60px;
        height: 60px;
        border-radius: 100%;
        border: none;
        background-color: #277dffe6;

        &:hover {
            background-color: #2079ff;
        }

        .icon {
            transition: all  0.3s ease;
            &:hover {
                font-size: 30px;
            }
        }
    }
</style>