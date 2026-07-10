<script setup>

import { computed, onMounted, ref } from 'vue'

import WeightChart from '../components/WeightChart.vue'

import {
  addWeightEntry,
  getWeightTrackingData,
  saveCheckInDay
} from '../services/weightService'


const days = [
  {
    value: 1,
    label: 'Monday'
  },
  {
    value: 2,
    label: 'Tuesday'
  },
  {
    value: 3,
    label: 'Wednesday'
  },
  {
    value: 4,
    label: 'Thursday'
  },
  {
    value: 5,
    label: 'Friday'
  },
  {
    value: 6,
    label: 'Saturday'
  },
  {
    value: 7,
    label: 'Sunday'
  }
]


const checkInDay = ref(1)

const weight = ref('')

const weightEntries = ref([])

const isLoading = ref(true)

const isSaving = ref(false)

const message = ref('')

const errorMessage = ref('')


const completedWeeks = computed(() => {
  return weightEntries.value.length
})


const isComplete = computed(() => {
  return completedWeeks.value >= 10
})


const selectedDay = computed(() => {

  const day = days.find(
    day => day.value === checkInDay.value
  )

  return day?.label

})


async function loadWeightData() {

  try {

    const data =
      await getWeightTrackingData()


    checkInDay.value =
      data.checkInDay


    weightEntries.value =
      data.weightEntries

  } catch (error) {

    console.error(
      'Failed to load weight data:',
      error
    )


    errorMessage.value =
      'Unable to load your weight data.'

  } finally {

    isLoading.value = false

  }

}


async function updateCheckInDay() {

  message.value = ''

  errorMessage.value = ''


  try {

    await saveCheckInDay(
      checkInDay.value
    )


    message.value =
      `Weekly check-in set for ${selectedDay.value}.`

  } catch (error) {

    console.error(
      'Failed to save check-in day:',
      error
    )


    errorMessage.value =
      'Unable to save your check-in day.'

  }

}


async function handleAddWeight() {

  message.value = ''

  errorMessage.value = ''


  const weightNumber =
    Number(weight.value)


  if (
    !weightNumber
    ||
    weightNumber <= 0
    ||
    weightNumber > 500
  ) {

    errorMessage.value =
      'Enter a valid weight.'

    return

  }


  isSaving.value = true


  try {

    const newEntry =
      await addWeightEntry(
        weightNumber
      )


    weightEntries.value.push(
      newEntry
    )


    weight.value = ''


    message.value =
      `Week ${newEntry.week_number} saved.`

  } catch (error) {

    console.error(
      'Failed to add weight:',
      error
    )


    errorMessage.value =
      error.message

  } finally {

    isSaving.value = false

  }

}


onMounted(
  loadWeightData
)

</script>


<template>

  <section class="weight-page">


    <header class="weight-header">


      <div>

        <p class="weight-label">
          Weight Progress
        </p>


        <h1>
          Track your weight
        </h1>

      </div>


      <RouterLink
        class="workout-link"
        :to="{ name: 'dashboard' }"
      >

        Back to Dashboard

      </RouterLink>


    </header>


    <p class="weight-description">

      Choose one day each week and record
      your weight for 10 weeks.

    </p>


    <div
      v-if="isLoading"
      class="loading"
    >

      Loading...

    </div>


    <div
      v-else
      class="weight-layout"
    >


      <section class="weight-form-card">


        <div class="form-header">

          <div>

            <p>
              Weekly Check-in
            </p>


            <h2>
              Add your weight
            </h2>

          </div>


          <span>

            {{ completedWeeks }}/10

          </span>

        </div>


        <form
          @submit.prevent="handleAddWeight"
        >


          <label for="check-in-day">

            Check in every

          </label>


          <select
            id="check-in-day"
            v-model.number="checkInDay"
            @change="updateCheckInDay"
          >


            <option
              v-for="day in days"
              :key="day.value"
              :value="day.value"
            >

              {{ day.label }}

            </option>


          </select>


          <label for="weight">

            Current weight

          </label>


          <div class="weight-input">

            <input
              id="weight"
              v-model="weight"
              type="number"
              min="1"
              max="500"
              step="0.1"
              placeholder="Enter weight"
              :disabled="isComplete"
            >


            <span>
              kg
            </span>

          </div>


          <p
            v-if="message"
            class="success-message"
          >

            {{ message }}

          </p>


          <p
            v-if="errorMessage"
            class="error-message"
          >

            {{ errorMessage }}

          </p>


          <button
            type="submit"
            :disabled="
              isSaving
              ||
              isComplete
            "
          >

            {{
              isComplete
                ? 'Program Complete'
                : isSaving
                  ? 'Saving...'
                  : 'Add Weight'
            }}

          </button>


        </form>


      </section>


      <section class="chart-card">


        <p class="chart-label">

          Progress

        </p>


        <h2>

          10-week weight trend

        </h2>


        <div
          v-if="weightEntries.length === 0"
          class="empty-chart"
        >

          Add your first weight to begin
          tracking your progress.

        </div>


        <WeightChart
          v-else
          :weight-entries="weightEntries"
        />


      </section>


    </div>


  </section>

</template>


<style scoped>

.weight-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}


.weight-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 24px;

  margin-bottom: 24px;
}


.weight-label,
.form-header p,
.chart-label {
  margin: 0 0 8px;

  color: #2fafad;

  font-size: 14px;
  font-weight: 700;

  text-transform: uppercase;
}


.weight-header h1 {
  margin: 0;

  color: #15182b;

  font-size: 40px;
}


.workout-link {
  padding: 10px 18px;

  border-radius: 8px;

  background-color: #2fafad;

  color: white;

  font-size: 15px;
  font-weight: 700;

  text-decoration: none;
}


.weight-description {
  margin: 0 0 32px;

  color: #5d6376;

  font-size: 16px;
}


.weight-layout {
  display: grid;

  grid-template-columns:
    320px 1fr;

  gap: 24px;
}


.weight-form-card,
.chart-card {
  padding: 24px;

  border-radius: 12px;

  background-color: #ffffff;
}


.form-header {
  display: flex;

  justify-content: space-between;

  margin-bottom: 24px;
}


.form-header h2,
.chart-card h2 {
  margin: 0;

  color: #15182b;

  font-size: 22px;
}


.form-header span {
  color: #2fafad;

  font-weight: 700;
}


form {
  display: flex;

  flex-direction: column;

  gap: 12px;
}


label {
  color: #15182b;

  font-size: 14px;
  font-weight: 600;
}


select,
input {
  width: 100%;

  padding: 12px;

  border: 1px solid #d8dce3;

  border-radius: 8px;

  font-size: 15px;
}


.weight-input {
  position: relative;
}


.weight-input input {
  padding-right: 45px;
}


.weight-input span {
  position: absolute;

  top: 50%;
  right: 14px;

  transform:
    translateY(-50%);

  color: #5d6376;
}


button {
  margin-top: 8px;

  padding: 12px;

  border: none;

  border-radius: 8px;

  background-color: #2fafad;

  color: white;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
}


button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


.success-message {
  margin: 0;

  color: #168582;

  font-size: 14px;
}


.error-message {
  margin: 0;

  color: #c0392b;

  font-size: 14px;
}


.empty-chart {
  display: grid;

  place-items: center;

  height: 320px;

  color: #5d6376;

  text-align: center;
}


.loading {
  color: #5d6376;
}


@media (max-width: 900px) {

  .weight-layout {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 767px) {

  .weight-page {
    padding: 32px 16px;
  }


  .weight-header {
    align-items: flex-start;

    flex-direction: column;
  }


  .weight-header h1 {
    font-size: 32px;
  }

}

</style>