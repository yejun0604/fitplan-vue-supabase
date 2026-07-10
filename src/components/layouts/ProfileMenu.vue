<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import defaultAvatar from '../../assets/pfp.png'
import { supabase } from '../../lib/supabase.js'

const router = useRouter()

defineProps({
  email: {
    type: String,
    required: true
  }
})

const isOpen = ref(false)

const isDeleting = ref(false)

const deleteError = ref('')


function toggleDropdown() {
  isOpen.value = !isOpen.value
  console.log(isOpen.value)
}


//Handle logout directly in ProfileMenu.vue
async function handleLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error.message)
    return
  }

  isOpen.value = false
  router.push('/login')
}


async function handleDeleteAccount() {

  const confirmed = window.confirm(
    'Delete your FitPlan account? This will permanently delete your account and all saved progress.'
  )


  if (!confirmed) {
    return
  }


  isDeleting.value = true

  deleteError.value = ''


  const {
    error
  } = await supabase
    .functions
    .invoke(
      'delete-account',
      {
        method: 'POST'
      }
    )


  if (error) {

    console.error(
      'Failed to delete account:',
      error
    )


    deleteError.value =
      'Unable to delete your account. Please try again.'


    isDeleting.value = false

    return
  }


  await supabase
    .auth
    .signOut({
      scope: 'local'
    })


  isOpen.value = false


  router.replace('/')

}

</script>

<template>
  <div class="profile-menu">

    <button 
      class="profile-trigger" 
      @click="toggleDropdown"
      type="button"
      >
      <img
        class="profile-avatar"
        :src="defaultAvatar"
        alt="FitPlan Default Pfp"
      />
      <span class="profile-email">{{ email }}</span>
    </button>

    <div v-if="isOpen" class="profile-dropdown">
      <div class="dropdown-menu">

          <button
            class="logout"
            type="button"
            @click="handleLogout"
          >
            Logout
          </button>

          <button
            class="delete-account"
            type="button"
            :disabled="isDeleting"
            @click="handleDeleteAccount"
          >

            {{
              isDeleting
                ? 'Deleting account...'
                : 'Delete account'
            }}

          </button>

          <p
            v-if="deleteError"
            class="delete-error"
          >
            {{ deleteError }}
          </p>

      </div>
    </div>


  </div>
</template>

<style scoped>
.profile-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.profile-trigger {
  box-sizing: border-box;

  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.65rem;

  min-height: 48px;
  max-width: 280px;
  padding-block: 0.5rem;
  padding-inline: 0.85rem;

  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 999px;
  background-color: #ffffff;
  color: var(--color-text, #0f172a);

  font: inherit;
  cursor: pointer;
}

.profile-trigger:hover {
  border-color: var(--color-primary, #14b8a6);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.profile-trigger:focus-visible {
  outline: 3px solid rgba(20, 184, 166, 0.25);
  outline-offset: 3px;
}

.profile-avatar {
  width: 36px;
  height: 36px;

  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;

  border: 2px solid rgba(20, 184, 166, 0.25);
}

.profile-email {
  display: block;
  min-width: 0;
  max-width: 180px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: var(--color-text, #0f172a);
  font-size: 0.9rem;
  font-weight: 700;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 50;

  width: 220px;
  padding: 0.75rem;

  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 16px;
  background-color: #ffffff;

  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.14);
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.logout,
.delete-account {
  width: 100%;
  padding: 0.75rem 0.85rem;

  border: none;
  border-radius: 12px;
  background-color: #f8fafc;
  color: var(--color-text, #0f172a);

  font: inherit;
  font-size: 0.9rem;
  font-weight: 800;
  text-align: left;

  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.logout:hover {
  background-color: rgba(20, 184, 166, 0.1);
  color: var(--color-primary, #14b8a6);
}

.delete-account {
  color: #dc2626;
}

.delete-account:hover {
  background-color: rgba(220, 38, 38, 0.08);
}

.delete-account:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.delete-error {
  margin: 0.25rem 0 0;

  color: #dc2626;

  font-size: 0.8rem;

  line-height: 1.4;
}
</style>