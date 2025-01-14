<template>
  <UModal title='Add new unit' description="Describe the unit" v-model:open="showUnitForm">
    <UButton class="self-center" :color="isAddMode ? 'primary' : 'gray'">
      <UIcon :name="isAddMode? 'material-symbols-add' : 'material-symbols-edit-note'" />
      {{ isAddMode ? 'Add new unit' : 'Edit' }}
    </UButton>
    <template #body>
      <UForm :schema="unitSchema" :state="state" @submit="emitUpdateUnit">
        <UFormField label="Name" required name="name" hint="required">
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Description" name="description" hint="optional">
          <UTextarea v-model="state.description" :autoresize="true" :maxrows="8" class="mb-4 w-full" />
        </UFormField>

        <div class="flex justify-end space-x-2">
          <UButton type="submit" color="primary">
            <UIcon v-if="isAddMode" name="material-symbols-add" />
            {{ isAddMode ? 'Add unit' : 'Update' }}
          </UButton>
          <UButton color="gray" @click="showUnitForm = false">
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
  unitData?: {id: string, name?: string, description?: string, icon?: string};
}>(), {isAddMode: false});

// const showUnitForm = defineModel('showUnitForm', { default: false });
const showUnitForm = ref(false);
const emit = defineEmits(['updateUnit']);

const unitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
});
type UnitSchema = z.output<typeof unitSchema>;

const state = reactive<Partial<UnitSchema>>(props.unitData || {});

const emitUpdateUnit = async (event: FormSubmitEvent<UnitSchema>) => {
  emit('updateUnit', event.data);
  showUnitForm.value = false;
};

</script>