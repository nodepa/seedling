<template>
  <UCard>
    <template #header>
      {{ word?.name }}
    </template>
    <p>
      {{ word?.description }}
    </p>
    <UIcon :name="word?.icon || 'noto-unknown-flag'"
      class="p-0 m-0 w-[10rem] h-[10rem] block" />
    <template #footer>
      <p>Word id: {{ id }}</p>
      <p>Created at: {{ word?.createdAt ? new Date(word.createdAt).toLocaleString() : 'missing' }}</p>
      <p>Updated at: {{ word?.updatedAt ? new Date(word.updatedAt).toLocaleString() : 'missing' }}</p>
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type { Schema } from '~/amplify/data/resource';

const route = useRoute();
const id = route.params.id;
type Word = Schema['ContentSpec']['type'];
type DynamicWord = Word & {
  inEditMode?: boolean;
  isWaiting?: boolean;
};

const words = useState<Array<DynamicWord>>('words');
const word = computed(() => words.value.find((word) => word.id === id));
</script>