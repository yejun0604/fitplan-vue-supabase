import { createRouter, createWebHistory } from "vue-router";

import Welcome from '../components/pages/Welcome.vue'
import Login from '../components/pages/Login.vue'
import Dashboard from '../components/pages/Dashboard.vue'
import Workout from '../components/pages/Workout.vue'

const routes = [
    {
        path: '/',
        name: 'welcome',
        component: Welcome 
    },
    {
        path: '/login',
        name: 'login',
        component: Login  
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard
    },
    {
        path: '/workout',
        name: 'workout',
        component: Workout
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router