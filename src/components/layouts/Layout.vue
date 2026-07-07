<script setup>

</script>

<template>
  <header>
    <h1 class="text-gradient">FitPlan</h1>
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