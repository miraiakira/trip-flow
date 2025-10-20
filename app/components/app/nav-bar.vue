<script setup lang="ts">
import AuthButton from "../auth-button.vue";
</script>

<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl">
        Trip Flow
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <ClientOnly>
        <AppThemeToggle />
      </ClientOnly>
      <AuthButton />
    </div>
  </div>
</template>
