<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../lib/supabase"

const router = useRouter()

const email = ref("")
const password = ref("")
const errorMessage = ref("")
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ""
  isLoading.value = true

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value,
  })

  isLoading.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }

  router.push("/dashboard")
}
</script>

<template>
  <section id="login">
    <div class="login-card">
      <div class="login-header">
        <p class="eyebrow">Welcome back</p>
        <h1>Login to FitPlan</h1>
        <p class="subtitle">
          Sign in to continue building your workout routine.
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button type="submit" :disabled="isLoading" class="primary-button">
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="auth-link">
        Don’t have an account?
        <RouterLink :to="{ name: 'signup' }">
          Sign up
        </RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
#login {
  width: 100%;
  min-height: 70vh;
  padding: 6rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  padding: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background-color: var(--color-white);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
}

.login-header {
  margin-bottom: 2rem;
  text-align: center;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 2.25rem;
  line-height: 1.1;
  font-weight: 800;
}

.subtitle {
  margin: 1rem auto 0;
  max-width: 340px;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.6;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 700;
}

input {
  width: 100%;
  display: block;
  padding: 0.9rem 1rem;
  border: 1px solid var(--color-input-border);
  border-radius: 12px;
  color: var(--color-text);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input::placeholder {
  color: var(--color-placeholder);
}

input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.14);
}

.error-message {
  margin: 0;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background-color: var(--color-error-bg);
  color: var(--color-error-text);
  font-size: 0.95rem;
  line-height: 1.5;
}

.primary-button {
  width: 100%;
  display: block;
  margin-top: 0.5rem;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 12px;
  background-color: var(--color-primary);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.auth-link {
  margin: 1.5rem 0 0;
  color: var(--color-muted);
  font-size: 0.95rem;
  text-align: center;
}

.auth-link a {
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
}

.auth-link a:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

@media (max-width: 640px) {
  #login {
    padding: 4rem 0;
  }

  .login-card {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>