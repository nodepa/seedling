<template>
  <UApp>
    <authenticator>
      <template #header>
        <div class="text-center">
          <img src="/logo-col.svg" alt="Seedlingo Apiary" />
          <!-- <NuxtImg src="logo-col.svg"></NuxtImg> -->
          <h1 class="-mt-10 text-3xl font-bold">Seedlingo Apiary</h1>
          <h2 class="mb-10 text-lg">
            Content editor for
            <NuxtLink to="https://seedlingo.com" external
              class="text-lochmara-700 hover:text-lochmara-900">Seedlingo
            </NuxtLink>
          </h2>
        </div>
      </template>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <template #footer>
        <UButton color="neutral" variant="outline" size="xs"
          icon="mdi-theme-light-dark" class="float-right mt-2"
          @click="userPreferredTheme != 'dark' ? userPreferredTheme = 'dark' : userPreferredTheme = 'light'">
          Toggle Dark Mode
        </UButton>
      </template>
    </authenticator>
  </UApp>
</template>

<script setup lang="ts">
import { Authenticator } from '@aws-amplify/ui-vue';
const appConfig = useAppConfig();
useHeadSafe({
  title: appConfig.title,
});
useSeoMeta({
  title: appConfig.title,
  ogTitle: appConfig.title,
  description: 'Content editor for Seedlingo.',
  ogDescription: 'Content editor for Seedlingo.',
});

// initial saved user preference
const userPreferredTheme: CookieRef<'light' | 'dark' | 'unset'> = useCookie(
  'userPreferredTheme',
  {
    default: () => 'unset',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'strict',
  },
);
// initial virtual state
const browserPreferredTheme: Ref<'light' | 'dark' | 'unset'> = useState(
  'browserPreferredTheme',
  () => 'unset',
);
// update virtual state on os/browser state change
onMounted(() => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      browserPreferredTheme.value = e.matches ? 'dark' : 'light';
    });
  browserPreferredTheme.value = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
    ? 'dark'
    : 'light';
});
// effectuate os/browser state change in DOM
watch(browserPreferredTheme, (browserPreferredTheme) => {
  if (userPreferredTheme.value === 'unset') {
    document.documentElement.classList.toggle(
      'dark',
      browserPreferredTheme === 'dark',
    );
  } else {
    document.documentElement.classList.toggle(
      'dark',
      userPreferredTheme.value === 'dark',
    );
  }
});
// effectuate user preference change in DOM
watch(userPreferredTheme, (userPreferredTheme) => {
  if (userPreferredTheme === 'unset') {
    document.documentElement.classList.toggle(
      'dark',
      browserPreferredTheme.value === 'dark',
    );
  } else {
    document.documentElement.classList.toggle(
      'dark',
      userPreferredTheme === 'dark',
    );
  }
});
</script>
<style>
[data-amplify-authenticator] {
  [data-amplify-router] {
    border-radius: var(--amplify-radii-medium);
    overflow: hidden;
  }

  .amplify-tab {
    background-color: none;
  }

  /* Fix for styling error in @aws-amplify/ui-vue/styles.css 2024/10/23 */
  .amplify-field-group:first-of-type .amplify-input {
    border-start-start-radius: var(--amplify-radii-small);
    border-end-start-radius: var(--amplify-radii-small);
  }

  /* Fix for styling error using inline styles in
   * https://github.com/aws-amplify/amplify-ui/blob/main/packages/vue/src/components/sign-up.vue
   * 2024/10/23 */
  #signUp-panel .amplify-button {
    border-radius: var(--amplify-radii-small) !important;
    font-weight: bold !important;
  }
}
</style>
