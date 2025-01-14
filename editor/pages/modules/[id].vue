<template>
  <UCard>
    <template #header>
      {{ module?.name }}
    </template>
    <p>
      {{ module?.description }}
    </p>
    <UIcon :name="module?.icon || 'noto-unknown-flag'"
      class="p-0 m-0 w-[10rem] h-[10rem] block" />
    <template #footer>
      <p>Module id: {{ id }}</p>
      <p>Created at: {{ module?.createdAt ? new Date(module.createdAt).toLocaleString() : 'missing' }}</p>
      <p>Updated at: {{ module?.updatedAt ? new Date(module.updatedAt).toLocaleString() : 'missing' }}</p>
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type { Schema } from '~/amplify/data/resource';

const route = useRoute();
const id = route.params.id;
type Module = Schema['ContentSpec']['type'];
type DynamicModule = Module & {
  inEditMode?: boolean;
  isWaiting?: boolean;
};

const modules = useState<Array<DynamicModule>>('modules');
const module = computed(() => modules.value.find((module) => module.id === id));
</script>