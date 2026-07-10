<script setup>

import { computed } from 'vue'

import { Line } from 'vue-chartjs'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js'


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
)


const props = defineProps({

  weightEntries: {
    type: Array,
    required: true
  }

})


const weekLabels = Array.from(
  {
    length: 10
  },

  (_, index) => {
    return `Week ${index + 1}`
  }
)


const chartData = computed(() => {

  return {

    labels:
      weekLabels,


    datasets: [

      {

        label:
          'Weight',


        data:

          weekLabels.map(
            (_, index) => {

              const weekNumber =
                index + 1


              const weightEntry =

                props
                  .weightEntries

                  .find(
                    entry => {

                      return (

                        entry.week_number

                        ===

                        weekNumber

                      )

                    }
                  )


              return weightEntry

                ? Number(
                    weightEntry.weight_kg
                  )

                : null

            }
          ),


        borderColor:
          '#2fafad',


        backgroundColor:
          'rgba(47, 175, 173, 0.10)',


        pointBackgroundColor:
          '#2fafad',


        pointBorderColor:
          '#ffffff',


        pointBorderWidth:
          2,


        pointRadius:
          5,


        pointHoverRadius:
          7,


        borderWidth:
          3,


        tension:
          0.35,


        fill:
          true

      }

    ]

  }

})


const chartOptions = {

  responsive:
    true,


  maintainAspectRatio:
    false,


  interaction: {

    mode:
      'index',


    intersect:
      false

  },


  plugins: {

    legend: {

      display:
        false

    },


    tooltip: {

      callbacks: {

        label(
          context
        ) {

          return (
            `${context.parsed.y} kg`
          )

        }

      }

    }

  },


  scales: {

    x: {

      border: {

        display:
          false

      },


      grid: {

        display:
          false

      },


      ticks: {

        color:
          '#7a8092',


        font: {

          size:
            12

        }

      }

    },


    y: {

      beginAtZero:
        false,


      grace:
        '15%',


      border: {

        display:
          false

      },


      grid: {

        color:
          'rgba(21, 24, 43, 0.08)'

      },


      ticks: {

        color:
          '#7a8092',


        font: {

          size:
            12

        },


        callback(
          value
        ) {

          return (
            `${value} kg`
          )

        }

      }

    }

  }

}

</script>


<template>

  <div class="weight-chart">

    <Line
      :data="chartData"
      :options="chartOptions"
      role="img"
      aria-label="Your 10-week weight progress"
    />

  </div>

</template>


<style scoped>

.weight-chart {
  position: relative;

  width: 100%;
  height: 320px;
}


@media (
  max-width: 767px
) {

  .weight-chart {
    height: 260px;
  }

}

</style>