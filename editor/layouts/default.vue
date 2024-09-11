<template>
  <section class="max-w-6xl mx-auto">
    <AppHeader />
    <slot />
    <AppFooter />
  </section>
</template>
<script setup lang="ts">
defineProps<{ signOut?: () => void }>();
</script>
