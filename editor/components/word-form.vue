<template>
  <UModal title='Add new word' description="Describe the word" v-model:open="showWordForm">
    <UButton class="self-center" :color="isAddMode ? 'primary' : 'gray'">
      <UIcon :name="isAddMode? 'material-symbols-add' : 'material-symbols-edit-note'" />
      {{ isAddMode ? 'Add new word' : 'Edit' }}
    </UButton>
    <template #body>
      <UForm :schema="wordSchema" :state="state" @submit="emitUpdateWord">
        <UFormField label="Word" required name="word" hint="required">
          <UInput v-model="state.word" />
        </UFormField>
        <UFormField label="Description" name="description" hint="optional">
          <UTextarea v-model="state.description" :autoresize="true" :maxrows="8" class="mb-4 w-full" />
        </UFormField>
        <UFormField label="Audio" name="audio" hint="optional">
          <UInput v-model="state.audio" />
        </UFormField>
        <UFormField label="Picture" name="picture" hint="optional">
          <UInput v-model="state.picture" />
        </UFormField>
        <UFormField label="Symbol(s)" name="symbol" hint="optional">
          <UInput v-model="state.symbol" />
        </UFormField>
        <UFormField label="Is this a punctuation symbol?" name="isPunctuation" hint="optional">
          <USwitch v-model="state.isPunctuation" color="primary" size="md" class="h-14"/>
        </UFormField>
        <div class="flex justify-end space-x-2">
          <UButton type="submit" color="primary">
            <UIcon v-if="isAddMode" name="material-symbols-add" />
            {{ isAddMode ? 'Add word' : 'Update' }}
          </UButton>
          <UButton color="gray" @click="showWordForm = false">
            Cancel
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

const props = withDefaults(defineProps<{
  isAddMode?: boolean;
  wordData?: {id: string, name?: string, description?: string, icon?: string};
}>(), {isAddMode: false});

// const showWordForm = defineModel('showWordForm', { default: false });
const showWordForm = ref(false);
const emit = defineEmits(['updateWord']);

const wordSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
});
type WordSchema = z.output<typeof wordSchema>;

const state = reactive<Partial<WordSchema>>(props.wordData || {});

const emitUpdateWord = async (event: FormSubmitEvent<WordSchema>) => {
  emit('updateWord', event.data);
  showWordForm.value = false;
};

</script>