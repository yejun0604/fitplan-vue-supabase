<script setup>

import { computed } from 'vue'

import { useRouter } from 'vue-router'


const router = useRouter()


const props = defineProps({

  workoutRoutines: {
    type: Array,
    required: true
  },

  lastCompletedDay: {
    type: Number,
    default: 0
  }

})


const workoutDays = computed(() => {

  if (
    props.workoutRoutines.length === 0
  ) {

    return []

  }


  const days = []

  let dayNumber = 1


  while (
    dayNumber <= 30
  ) {

    for (
      const routine
      of
      props.workoutRoutines
    ) {

      if (
        dayNumber > 30
      ) {

        break

      }


      days.push({

        dayNumber:
          dayNumber,

        routineName:
          routine.name,

        isRestDay:
          routine.is_rest_day,

        isCompleted:

          dayNumber

          <=

          props.lastCompletedDay,

        isUnlocked:

          dayNumber

          ===

          props.lastCompletedDay + 1,

        isLocked:

          dayNumber

          >

          props.lastCompletedDay + 1

      })


      dayNumber++

    }

  }


  return days

})


function openWorkout(day) {

  if (
    day.isLocked
  ) {

    return

  }


  router.push({

    name:
      'workout',

    params: {

      dayNumber:
        day.dayNumber

    }

  })

}

</script>


<template>

  <section class="workout-grid">


    <button
      v-for="day in workoutDays"
      :key="day.dayNumber"
      class="workout-card"
      :class="{

        'workout-card--rest':
          day.isRestDay,

        'workout-card--completed':
          day.isCompleted,

        'workout-card--locked':
          day.isLocked

      }"
      type="button"
      :disabled="
        day.isLocked
      "
      @click="
        openWorkout(day)
      "
    >


      <span class="workout-card__day">

        Day {{ day.dayNumber }}

      </span>


      <h2 class="workout-card__name">

        {{ day.routineName }}

      </h2>


      <span class="workout-card__type">


        <template
          v-if="day.isCompleted"
        >

          Completed

        </template>


        <template
          v-else-if="day.isLocked"
        >

          Locked

        </template>


        <template
          v-else-if="day.isRestDay"
        >

          Recovery Day

        </template>


        <template v-else>

          Start Workout

        </template>


      </span>


    </button>


  </section>

</template>


<style scoped>

.workout-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(
        180px,
        1fr
      )
    );

  gap: 1rem;

  margin-top:
    2rem;
}


.workout-card {
  min-height:
    170px;

  display:
    flex;

  flex-direction:
    column;

  justify-content:
    space-between;

  align-items:
    flex-start;

  padding:
    1.5rem;

  border:
    1px solid
    #dce7e6;

  border-radius:
    18px;

  background:
    #ffffff;

  font-family:
    inherit;

  text-align:
    left;

  cursor:
    pointer;

  transition:
    transform
    0.2s
    ease,

    border-color
    0.2s
    ease,

    box-shadow
    0.2s
    ease;
}


.workout-card:not(
  :disabled
):hover {

  transform:
    translateY(
      -4px
    );

  border-color:
    #2fafad;

  box-shadow:
    0
    10px
    24px

    rgba(
      47,
      175,
      173,
      0.14
    );
}


.workout-card:focus-visible {
  outline:
    3px solid

    rgba(
      47,
      175,
      173,
      0.25
    );

  outline-offset:
    3px;
}


.workout-card__day {
  color:
    #2fafad;

  font-size:
    0.85rem;

  font-weight:
    700;
}


.workout-card__name {
  margin:
    0;

  color:
    #15182b;

  font-size:
    1.6rem;
}


.workout-card__type {
  padding:
    0.4rem
    0.75rem;

  border-radius:
    999px;

  background:

    rgba(
      47,
      175,
      173,
      0.1
    );

  color:
    #238f8d;

  font-size:
    0.8rem;

  font-weight:
    700;
}


.workout-card--rest {
  background:
    #f8fbfb;
}


.workout-card--completed {
  border-color:
    #2fafad;

  opacity:
    0.7;

  cursor:
    pointer;
}


.workout-card--locked {
  background:
    #f7f8f9;

  opacity:
    0.45;

  cursor:
    not-allowed;
}


.workout-card--locked
.workout-card__type {

  background:
    #e8eaed;

  color:
    #737986;
}

</style>