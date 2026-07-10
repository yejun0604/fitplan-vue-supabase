<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProfileMenu from './ProfileMenu.vue'
import { supabase } from '../../lib/supabase.js'

const userEmail = ref(null)
const isLoggedIn = ref(false)
const isAuthReady = ref(false)

let authSubscription = null

const updateAuthState = (session) => {
  userEmail.value = session?.user?.email ?? null
  isLoggedIn.value = !!session?.user
}

onMounted(async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error(error.message)
  } else {
    updateAuthState(data.session)
  }

  isAuthReady.value = true

  const { data: authData } = supabase.auth.onAuthStateChange((_event, session) => {
    updateAuthState(session)
    isAuthReady.value = true
  })

  authSubscription = authData.subscription
})

onUnmounted(() => {
  authSubscription?.unsubscribe()
})
</script>

<template>
  <header>
    <h1 class="text-gradient">FitPlan</h1>

    <ProfileMenu
      v-if="isAuthReady && isLoggedIn"
      :email="userEmail"
    />
  </header>

  <main>
    <slot />
  </main>

  <footer>
    <small>Created by</small>
    <a
      href="https://github.com/yejun0604"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        alt="pfp"
        src="https://media.licdn.com/dms/image/v2/D5603AQGN1lCUA4RaeA/profile-displayphoto-shrink_200_200/B56ZSBbXgSHoAY-/0/1737338224168?e=1784764800&v=beta&t=Q-18zkHkT26vEEq4ln8iTTVFjCRq0fSKjJZDrclmNNs"
      />
      <p>Yejun Lee</p>
      <i class="fa-brands fa-github"></i>
    </a>
  </footer>
</template>

<style scoped>
header,
main,
footer {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

header h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1;
  font-weight: 800;
}

.text-gradient {
  color: var(--color-primary);
}

main {
  min-height: 70vh;
  flex: 1;
}

footer {
  padding-top: 2rem;
  padding-bottom: 2rem;
  color: var(--color-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

footer small {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
}

footer a {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--color-text);
  text-decoration: none;
}

footer a:hover {
  color: var(--color-primary);
}

footer img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

footer p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}
</style>