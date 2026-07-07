import { createRouter, createWebHistory } from "vue-router";

import Welcome from '../pages/Welcome.vue'
import Login from '../pages/Login.vue'
import SignUp from '../pages/SignUp.vue'
import Dashboard from '../pages/Dashboard.vue'
import Workout from '../pages/Workout.vue'

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
        path: '/signup',
        name: 'signup',
        component: SignUp  
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