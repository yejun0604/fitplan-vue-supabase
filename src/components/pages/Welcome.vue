<script setup>
import workoutImage from '../../assets/workout.svg'
</script>

<template>
  <section id="welcome">
    <div class="welcome_content">
      <h1>
        Welcome to
        <span>FitPlan</span>
      </h1>

      <p>
        Build a simple routine, follow each workout, and track your progress in
        one place.
      </p>

      <RouterLink :to="{name: 'login'}" class="primary-button">Get Started</RouterLink>
    </div>

    <div class="welcome_image">
      <img
        class="workout_image"
        :src="workoutImage"
        alt="Workout planner illustration"
      />
    </div>
  </section>
</template>

<style scoped>
#welcome {
  padding: 10rem 0;
  display: flex;
  align-items: center;
  gap: 3rem;
}

.welcome_content {
  flex: 1;
}

.welcome_image {
  flex: 1;
  display: flex;
  justify-content: center;
}

h1 {
  margin: 0;
  font-size: 4rem;
  line-height: 1.1;
  color: #0f172a;
}

h1 span {
  display: block;
  color: #14b8a6;
}

p {
  margin: 1.5rem 0 2rem;
  max-width: 520px;
  font-size: 1.15rem;
  line-height: 1.6;
  color: #475569;
}

.primary-button {
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 12px;
  background-color: #14b8a6;
  color: white;
  font-size: 1rem;
  font-weight: 700;
   text-decoration: none;
  cursor: pointer;
  transition: background-color .2s ease;
}

.primary-button:hover {
  background-color: #0f766e;
}

.workout_image {
  width: 100%;
  max-width: 420px;
}

/* From 924px and below */
@media (max-width: 924px) {
  #welcome {
    padding: 8rem 0;
    justify-content: center;
  }

  .welcome_content {
    max-width: 620px;
    margin: 0 auto;
    text-align: center;
  }

  .welcome_image {
    display: none;
  }

  p {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>