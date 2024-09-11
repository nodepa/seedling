<template>
  <section class="flex items-center">
    <UIcon
      class="block w-[2.5rem] h-[2.5rem] mx-3 text-[var(--ui-primary)]"
      name="game-icons-tree-beehive"
      @click="toggleDarkTheme"
    />
    <UNavigationMenu class="w-auto" :items="links" />
    <div class="flex grow"></div>
    <p>{{ user.signInDetails?.loginId }}</p>
    <UButton class="text-nowrap m-4" @click="signOut()">Sign Out</UButton>
  </section>
</template>

<script setup lang="ts">
import { getCurrentUser, signOut } from 'aws-amplify/auth';

const links = [
  {
    label: 'Modules',
    icon: 'tabler-apps-filled',
    to: '/modules',
  },
  {
    label: 'Units',
    icon: 'tdesign-tree-list',
    to: '/units',
  },
  {
    label: 'Exercises',
    icon: 'healthicons-exercise-running-outline',
    // icon: 'lucide-lab-floor-plan',
    to: '/exercises',
  },
  {
    label: 'Words',
    icon: 'material-symbols-match-word',
    to: '/words',
  },
];

const user = await getCurrentUser();

const userPreferredTheme: CookieRef<'light' | 'dark' | 'unset'> = useCookie(
  'userPreferredTheme',
  {
    default: () => 'unset',
    maxAge: 60 * 60 * 24 * 365,
  },
);
const toggleDarkTheme = () => {
  userPreferredTheme.value =
    userPreferredTheme.value === 'dark' ? 'light' : 'dark';
};
</script>
