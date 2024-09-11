<template>
  <UCard>
    <template #header>
      {{ unit?.name }}
    </template>
    <p>
      {{ unit?.description }}
    </p>
    <UIcon :name="unit?.icon || 'noto-unknown-flag'"
      class="p-0 m-0 w-[10rem] h-[10rem] block" />
    <template #footer>
      <p>Unit id: {{ id }}</p>
      <p>Created at: {{ unit?.createdAt ? new Date(unit.createdAt).toLocaleString() : 'missing' }}</p>
      <p>Updated at: {{ unit?.updatedAt ? new Date(unit.updatedAt).toLocaleString() : 'missing' }}</p>
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type { Schema } from '~/amplify/data/resource';

const route = useRoute();
const id = route.params.id;
type Unit = Schema['ContentSpec']['type'];
type DynamicUnit = Unit & {
  inEditMode?: boolean;
  isWaiting?: boolean;
};

const units = useState<Array<DynamicUnit>>('units');
const unit = computed(() => units.value.find((unit) => unit.id === id));
</script>