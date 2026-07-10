import {
  createRouter,
  createWebHistory
} from 'vue-router'

import { supabase } from '../lib/supabase.js'

import Welcome from '../pages/Welcome.vue'
import Login from '../pages/Login.vue'
import SignUp from '../pages/SignUp.vue'
import Dashboard from '../pages/Dashboard.vue'
import Diet from '../pages/Diet.vue'
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
    component: Login,

    // Logged-in users should not see Login
    meta: {
      guestOnly: true
    }
  },

  {
    path: '/signup',
    name: 'signup',
    component: SignUp,

    // Logged-in users should not see Sign Up
    meta: {
      guestOnly: true
    }
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,

    // Only logged-in users can open
    meta: {
      requiresAuth: true
    }
  },

  {
  path: '/workout/:dayNumber',
  name: 'workout',
  component: Workout,

  meta: {
    requiresAuth: true
  }
  },

  {
    path: '/diet',
    name: 'diet',
    component: Diet,

    // Only logged-in users can open
    meta: {
      requiresAuth: true
    }
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to) => {

  const {
    data: {
      session
    },

    error

  } = await supabase.auth.getSession()


  if (error) {

    console.error(
      'Failed to check auth session:',
      error
    )

  }


  const isLoggedIn = Boolean(session)


  // Not logged in → Login page
  if (
    to.meta.requiresAuth
    &&
    !isLoggedIn
  ) {

    return {
      name: 'login',

      query: {
        redirect: to.fullPath
      }
    }

  }


  // Already logged in → Dashboard
  if (
    to.meta.guestOnly
    &&
    isLoggedIn
  ) {

    return {
      name: 'dashboard'
    }

  }


  return true

})


export default router