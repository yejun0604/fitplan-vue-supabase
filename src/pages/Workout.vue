<script setup>

import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  addCompletedSet,
  completeWorkoutDay,
  getCompletedSets,
  getOrCreateWorkoutProgress,
  getWorkoutExercises,
  getWorkoutRoutines,
  removeCompletedSet
} from '../services/workoutService'


const route =
  useRoute()


const router =
  useRouter()


const dayNumber = Number(

  route.params.dayNumber

)


const routine =
  ref(null)


const exercises =
  ref([])


const completedSetKeys =
  ref([])


const isCompletedDay =
  ref(false)


const savingSetKey =
  ref('')


const isLoading =
  ref(true)


const isFinishing =
  ref(false)


const errorMessage =
  ref('')


const isRestDay = computed(() => {

  return (

    routine.value
      ?.is_rest_day

    ??

    false

  )

})


function createSetKey(

  exerciseId,

  setNumber

) {

  return (

    `${exerciseId}-${setNumber}`

  )

}


function isSetCompleted(

  exerciseId,

  setNumber

) {

  const setKey =

    createSetKey(

      exerciseId,

      setNumber

    )


  return completedSetKeys
    .value

    .includes(
      setKey
    )

}


async function loadWorkout() {

  errorMessage.value =
    ''


  try {

    if (

      !Number.isInteger(
        dayNumber
      )

      ||

      dayNumber < 1

      ||

      dayNumber > 30

    ) {

      await router.replace({

        name:
          'dashboard'

      })


      return

    }


    const [

      workoutRoutines,

      workoutProgress

    ] = await Promise.all([

      getWorkoutRoutines(),

      getOrCreateWorkoutProgress()

    ])


    if (

      workoutRoutines.length
      ===
      0

    ) {

      throw new Error(

        'Workout routines were not found.'

      )

    }


    const unlockedDay =

      workoutProgress
        .last_completed_day

      +

      1


    if (

      dayNumber

      >

      unlockedDay

    ) {

      await router.replace({

        name:
          'dashboard'

      })


      return

    }


    isCompletedDay.value =

      dayNumber

      <=

      workoutProgress
        .last_completed_day


    const routineIndex =

      (
        dayNumber - 1
      )

      %

      workoutRoutines.length


    routine.value =

      workoutRoutines[

        routineIndex

      ]


    if (

      !routine.value
        .is_rest_day

    ) {

      exercises.value =

        await getWorkoutExercises(

          routine.value.name

        )


      if (

        exercises.value.length
        ===
        0

      ) {

        throw new Error(

          `No exercises were found for ${routine.value.name}.`

        )

      }

    }


    const savedSets =

      await getCompletedSets(

        dayNumber

      )


    completedSetKeys.value =

      savedSets.map(

        savedSet => {

          return createSetKey(

            savedSet
              .workout_exercise_id,

            savedSet
              .set_number

          )

        }

      )

  } catch (error) {

    console.error(

      'Failed to load workout:',

      error

    )


    errorMessage.value =

      'Unable to load this workout.'

  } finally {

    isLoading.value =
      false

  }

}


async function toggleSet(

  exerciseId,

  setNumber

) {

  const setKey =

    createSetKey(

      exerciseId,

      setNumber

    )


  if (
    savingSetKey.value
  ) {

    return

  }


  savingSetKey.value =
    setKey


  try {

    if (

      isSetCompleted(

        exerciseId,

        setNumber

      )

    ) {

      await removeCompletedSet({

        dayNumber,

        workoutExerciseId:
          exerciseId,

        setNumber

      })


      completedSetKeys.value =

        completedSetKeys
          .value

          .filter(

            savedSetKey => {

              return (

                savedSetKey

                !==

                setKey

              )

            }

          )

    } else {

      await addCompletedSet({

        dayNumber,

        workoutExerciseId:
          exerciseId,

        setNumber

      })


      completedSetKeys.value = [

        ...completedSetKeys.value,

        setKey

      ]

    }

  } catch (error) {

    console.error(

      'Failed to update set:',

      error

    )


    errorMessage.value =

      'Unable to save this set.'

  } finally {

    savingSetKey.value =
      ''

  }

}


async function finishWorkout() {

  isFinishing.value =
    true


  errorMessage.value =
    ''


  try {

    await completeWorkoutDay(

      dayNumber

    )


    await router.push({

      name:
        'dashboard'

    })

  } catch (error) {

    console.error(

      'Failed to finish workout:',

      error

    )


    errorMessage.value =

      'Unable to finish this workout.'

  } finally {

    isFinishing.value =
      false

  }

}


function returnToDashboard() {

  router.push({

    name:
      'dashboard'

  })

}


onMounted(
  loadWorkout
)

</script>


<template>

  <section class="workout-page">


    <button
      class="back-button"
      type="button"
      @click="
        returnToDashboard
      "
    >

      ← Back to Dashboard

    </button>


    <p
      v-if="isLoading"
      class="message"
    >

      Loading workout...

    </p>


    <p
      v-else-if="
        errorMessage
      "
      class="error-message"
    >

      {{ errorMessage }}

    </p>


    <template
      v-else-if="routine"
    >


      <header class="workout-header">


        <p class="workout-label">

          Day {{ dayNumber }}

        </p>


        <h1>

          {{ routine.name }}

        </h1>


        <p
          v-if="
            !isRestDay
          "
        >

          Set tracking is optional.

        </p>


      </header>


      <div
        v-if="isRestDay"
        class="rest-card"
      >


        <h2>

          Recovery Day

        </h2>


        <p>

          Rest and prepare
          for your next workout.

        </p>


      </div>


      <div
        v-else
        class="exercise-list"
      >


        <article
          v-for="
            exercise
            in
            exercises
          "
          :key="
            exercise.id
          "
          class="exercise-card"
        >


          <div
            class="exercise-header"
          >


            <h2>

              {{

                exercise
                  .exercise_name

              }}

            </h2>


            <span>

              {{

                exercise
                  .target_sets

              }}

              sets

            </span>


          </div>


          <div class="set-list">


            <button
              v-for="

                setNumber

                in

                exercise
                  .target_sets

              "
              :key="
                setNumber
              "
              class="
                set-button
              "
              :class="{

                'set-button--completed':

                  isSetCompleted(

                    exercise.id,

                    setNumber

                  )

              }"
              type="button"
              :disabled="

                savingSetKey

                ===

                createSetKey(

                  exercise.id,

                  setNumber

                )

              "
              :aria-pressed="

                isSetCompleted(

                  exercise.id,

                  setNumber

                )

              "
              @click="

                toggleSet(

                  exercise.id,

                  setNumber

                )

              "
            >


              <span>

                {{

                  isSetCompleted(

                    exercise.id,

                    setNumber

                  )

                    ? '✓'

                    : setNumber

                }}

              </span>


            </button>


          </div>


        </article>


      </div>


      <p
        v-if="
          isCompletedDay
        "
        class="
          completed-message
        "
      >

        This workout is completed.
        You can still update
        your set checks.

      </p>


      <button
        v-if="
          !isCompletedDay
        "
        class="
          finish-button
        "
        type="button"
        :disabled="
          isFinishing
        "
        @click="
          finishWorkout
        "
      >

        {{

          isFinishing

            ? 'Saving...'

            : isRestDay

              ? 'Finish Rest Day'

              : 'Finish Workout'

        }}

      </button>


    </template>


  </section>

</template>


<style scoped>

.workout-page {
  width:
    100%;

  max-width:
    800px;

  margin:
    0 auto;

  padding:
    48px
    24px
    72px;
}


.back-button {
  margin-bottom:
    32px;

  padding:
    0;

  border:
    none;

  background:
    transparent;

  color:
    var(
      --color-teal,
      #2fafad
    );

  font-family:
    inherit;

  font-size:
    14px;

  font-weight:
    700;

  cursor:
    pointer;
}


.workout-header {
  margin-bottom:
    32px;
}


.workout-label {
  margin:
    0
    0
    8px;

  color:
    var(
      --color-teal,
      #2fafad
    );

  font-size:
    14px;

  font-weight:
    700;

  text-transform:
    uppercase;
}


.workout-header h1 {
  margin:
    0;

  color:
    var(
      --color-heading,
      #15182b
    );

  font-size:
    40px;
}


.workout-header p:last-child {
  color:
    var(
      --color-text,
      #5d6376
    );
}


.exercise-list {
  display:
    grid;

  gap:
    16px;
}


.exercise-card {
  padding:
    20px;

  border:
    1px
    solid
    #dce7e6;

  border-radius:
    12px;

  background:
    #ffffff;
}


.exercise-header {
  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    16px;
}


.exercise-header h2 {
  margin:
    0;

  color:
    var(
      --color-heading,
      #15182b
    );

  font-size:
    18px;
}


.exercise-header span {
  color:
    var(
      --color-teal,
      #2fafad
    );

  font-size:
    14px;

  font-weight:
    700;
}


.set-list {
  display:
    flex;

  flex-wrap:
    wrap;

  gap:
    10px;

  margin-top:
    18px;
}


.set-button {
  width:
    42px;

  height:
    42px;

  border:
    1px
    solid
    #cbd8d7;

  border-radius:
    8px;

  background:
    #ffffff;

  color:
    #5d6376;

  font-family:
    inherit;

  font-weight:
    700;

  cursor:
    pointer;
}


.set-button:hover {
  border-color:
    var(
      --color-teal,
      #2fafad
    );
}


.set-button--completed {
  border-color:
    var(
      --color-teal,
      #2fafad
    );

  background:
    var(
      --color-teal,
      #2fafad
    );

  color:
    #ffffff;
}


.set-button:disabled {
  opacity:
    0.6;

  cursor:
    wait;
}


.rest-card {
  padding:
    32px;

  border-radius:
    12px;

  background:
    #eefafa;

  text-align:
    center;
}


.rest-card h2 {
  color:
    #15182b;
}


.rest-card p {
  color:
    #5d6376;
}


.completed-message {
  margin-top:
    32px;

  padding:
    16px;

  border-radius:
    8px;

  background:
    #eefafa;

  color:
    #238f8d;

  font-weight:
    600;

  text-align:
    center;
}


.finish-button {
  width:
    100%;

  min-height:
    52px;

  margin-top:
    32px;

  border:
    none;

  border-radius:
    8px;

  background:
    var(
      --color-teal,
      #2fafad
    );

  color:
    #ffffff;

  font-family:
    inherit;

  font-size:
    15px;

  font-weight:
    700;

  cursor:
    pointer;
}


.finish-button:hover {
  opacity:
    0.85;
}


.finish-button:disabled {
  opacity:
    0.5;

  cursor:
    not-allowed;
}


.message {
  color:
    #5d6376;

  text-align:
    center;
}


.error-message {
  color:
    #c0392b;
}


@media (
  max-width:
  767px
) {

  .workout-page {
    padding:
      32px
      16px
      48px;
  }


  .workout-header h1 {
    font-size:
      32px;
  }

}

</style>