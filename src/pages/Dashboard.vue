<script setup>

import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  getOrCreateWorkoutProgress,
  getWorkoutRoutines,
  resetWorkoutProgram
} from '../services/workoutService'

import { gymHealthFacts } from '../utils'

import Grid from '../components/Grid.vue'


const dailyTip = computed(() => {

  // Generate a random whole number
  // between 0 and array length - 1
  const randomNumber = Math.floor(
    Math.random()
    *
    gymHealthFacts.length
  )

  return gymHealthFacts[randomNumber]

})


const workoutRoutines = ref([])

const workoutProgress = ref(null)

const isLoading = ref(true)

const isResetting = ref(false)

const errorMessage = ref('')


const lastCompletedDay = computed(() => {

  return (
    workoutProgress.value
      ?.last_completed_day

    ?? 0
  )

})


async function loadDashboard() {

  isLoading.value = true

  errorMessage.value = ''


  try {

    const [
      routines,
      progress
    ] = await Promise.all([

      getWorkoutRoutines(),

      getOrCreateWorkoutProgress()

    ])


    workoutRoutines.value =
      routines


    workoutProgress.value =
      progress

  } catch (error) {

    console.error(
      'Failed to load workout dashboard:',
      error
    )


    errorMessage.value =
      'Unable to load your workout plan.'

  } finally {

    isLoading.value = false

  }

}


async function handleReset() {

  const confirmed = window.confirm(

    'Reset your 30-day workout program? All saved set checks will be deleted.'

  )


  if (!confirmed) {
    return
  }


  isResetting.value = true

  errorMessage.value = ''


  try {

    await resetWorkoutProgram()


    workoutProgress.value =
      await getOrCreateWorkoutProgress()

  } catch (error) {

    console.error(
      'Failed to reset workout program:',
      error
    )


    errorMessage.value =
      'Unable to reset your workout program.'

  } finally {

    isResetting.value = false

  }

}


onMounted(
  loadDashboard
)

</script>


<template>

  <section class="dashboard">


    <header class="dashboard-header">


      <div>

        <p class="dashboard-label">

          Dashboard

        </p>


        <h1 class="dashboard-title">

          30-Day FitPlan

        </h1>

      </div>


      <RouterLink
        class="diet-link"
        :to="{
          name: 'diet'
        }"
      >

        Weight Progress

      </RouterLink>


    </header>


    <div class="daily-tip">


      <p class="daily-tip-title">

        <strong>

          Daily Tip

        </strong>

      </p>


      <p class="daily-tip-text">

        {{ dailyTip }}

      </p>


    </div>


    <p
      v-if="errorMessage"
      class="error-message"
    >

      {{ errorMessage }}

    </p>


    <p
      v-if="isLoading"
      class="loading-message"
    >

      Loading your workout plan...

    </p>


    <template v-else>


      <Grid
        class="workout-grid"
        :workout-routines="
          workoutRoutines
        "
        :last-completed-day="
          lastCompletedDay
        "
      />


      <div class="reset-section">


        <p>

          Reset your workout progress
          and start again from Day 1.

        </p>


        <button
          class="reset-button"
          type="button"
          :disabled="
            isResetting
          "
          @click="
            handleReset
          "
        >

          {{
            isResetting
              ? 'Resetting...'
              : 'Reset Program'
          }}

        </button>


      </div>


    </template>


  </section>

</template>


<style scoped>

.dashboard {
  width: 100%;

  max-width: 1200px;

  margin: 0 auto;

  padding:
    48px
    24px;
}


.dashboard-header {
  display: flex;

  align-items: center;

  justify-content:
    space-between;

  margin-bottom:
    32px;
}


.dashboard-label {
  margin:
    0
    0
    8px;

  color:
    #2fafad;

  font-size:
    14px;

  font-weight:
    700;

  text-transform:
    uppercase;
}


.dashboard-title {
  margin: 0;

  color:
    #15182b;

  font-size:
    40px;

  font-weight:
    700;

  line-height:
    1.2;
}


.diet-link {
  padding:
    10px
    20px;

  border-radius:
    8px;

  background-color:
    #2fafad;

  color:
    #ffffff;

  font-size:
    15px;

  font-weight:
    700;

  text-decoration:
    none;
}


.diet-link:hover {
  opacity:
    0.85;
}


.daily-tip {
  margin-bottom:
    40px;

  padding:
    24px;

  border-radius:
    12px;

  background-color:
    #eefafa;
}


.daily-tip-title {
  margin:
    0
    0
    8px;

  color:
    #2fafad;

  font-size:
    16px;
}


.daily-tip-text {
  margin: 0;

  color:
    #5d6376;

  font-size:
    16px;

  line-height:
    1.6;
}


.workout-grid {
  width:
    100%;
}


.loading-message {
  padding:
    40px
    0;

  color:
    #5d6376;

  text-align:
    center;
}


.error-message {
  margin:
    0
    0
    24px;

  color:
    #c0392b;

  font-size:
    14px;
}


.reset-section {
  display: flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    20px;

  margin-top:
    32px;

  padding:
    24px;

  border-radius:
    12px;

  background-color:
    #eefafa;
}


.reset-section p {
  margin: 0;

  color:
    #15182b;

  font-weight:
    600;
}


.reset-button {
  padding:
    11px
    20px;

  border:
    none;

  border-radius:
    8px;

  background-color:
    #2fafad;

  color:
    #ffffff;

  font-family:
    inherit;

  font-size:
    14px;

  font-weight:
    700;

  cursor:
    pointer;
}


.reset-button:hover {
  opacity:
    0.85;
}


.reset-button:disabled {
  opacity:
    0.5;

  cursor:
    not-allowed;
}


@media (
  max-width:
  767px
) {

  .dashboard {
    padding:
      32px
      16px;
  }


  .dashboard-header {
    align-items:
      flex-start;

    flex-direction:
      column;

    gap:
      20px;
  }


  .dashboard-title {
    font-size:
      32px;
  }


  .diet-link {
    padding:
      9px
      18px;
  }


  .daily-tip {
    padding:
      20px;
  }


  .reset-section {
    align-items:
      flex-start;

    flex-direction:
      column;
  }

}

</style>