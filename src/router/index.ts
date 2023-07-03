import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path:'',
                name:'posts',
                component: () => import(/* webpackChunkName: "Auth Layout" */ '../components/PostComp.vue')

            },
            {
                path: '/posts/:id',
                name: 'post',
                component: () => import(/* webpackChunkName: "Auth Layout" */ '../components/PostEdit.vue'),
                props: ( route ) => {
                    return {
                        id: route.params.id
                    }
                }
            },
            {
                path: '/editPost/:id',
                name: 'editpost',
                component: () => import(/* webpackChunkName: "Auth Layout" */ '../components/PostIndividual.vue'),
                props: ( route ) => {
                    return {
                        id: route.params.id
                    }
                }
            },
            {
                path: '/new',
                name: 'new',
                component: () => import(/* webpackChunkName: "Auth Layout" */ '../components/PostNew.vue'),
            },
            {
                path: '/events',
                name: 'events',
                component: () => import(/* webpackChunkName: "Events" */ '../components/EventsComp.vue')
            },
            {
                path: '/event/:id',
                name: 'event',
                component: () => import(/* webpackChunkName : "Event" */ '../components/EventsIndividual.vue'),
                props: ( route ) => {
                    return {
                        id: route.params.id
                    }
                }
            },
            {
                path: '/editEvent/:id',
                name: 'editev',
                component: () => import(/* webpackChunkName : "Event" */ '../components/EventEdit.vue'),
                props: ( route ) => {
                    return {
                        id: route.params.id
                    }
                }
            },
            {
                path: '/newEvent',
                name: 'newev',
                component: () => import(/* webpackChunkName : "Event" */ '../components/EventNew.vue')
            },
        ]
    },
    {
        path: '/auth',
        name: 'auth',
        component: () => import(/* webpackChunkName: "Auth Layout" */ '../modules/auth/layout/AuthView.vue'),
        children: [
        {
            path: '/register',
            name: 'register',
            component: () => import(/* webpackChunkName: "Register" */ '../modules/auth/views/RegisterAuth.vue'),

        },
        {
            path: '/',
            name: 'login',
            component: () => import(/* webpackChunkName: "Register" */ '../modules/auth/views/LoginAuth.vue'),

        },
    ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach( (to,from,next) => {
    if (to.matched.some(route => route.meta.requiresAuth)) {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
            next({name: 'login'})
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router;