<template>
  <UModal title='Add new module' description="Describe the module" v-model:open="showModuleForm">
    <UButton class="self-center" :color="isAddMode ? 'primary' : 'gray'">
      <UIcon :name="isAddMode? 'material-symbols-add' : 'material-symbols-edit-note'" />
      {{ isAddMode ? 'Add new module' : 'Edit' }}
    </UButton>
    <template #body>
      <UForm :schema="moduleSchema" :state="state" @submit="emitUpdateModule">
        <UFormField label="Name" required name="name" hint="required">
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Description" name="description" hint="optional">
          <UTextarea v-model="state.description" :autoresize="true" :maxrows="8" class="mb-4 w-full" />
        </UFormField>

        <div class="flex justify-end space-x-2">
          <UButton type="submit" color="primary">
            <UIcon v-if="isAddMode" name="material-symbols-add" />
            {{ isAddMode ? 'Add module' : 'Update' }}
          </UButton>
          <UButton color="gray" @click="showModuleForm = false">
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
  moduleData?: {id: string, name?: string, description?: string, icon?: string};
}>(), {isAddMode: false});

// const showModuleForm = defineModel('showModuleForm', { default: false });
const showModuleForm = ref(false);
const emit = defineEmits(['updateModule']);

const moduleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
});
type ModuleSchema = z.output<typeof moduleSchema>;

const state = reactive<Partial<ModuleSchema>>(props.moduleData || {});

const emitUpdateModule = async (event: FormSubmitEvent<ModuleSchema>) => {
  emit('updateModule', event.data);
  showModuleForm.value = false;
};

</script>