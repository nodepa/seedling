<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-2xl text-[var(--ui-primary)]">Modules</h1>
      </template>

      <ul class="flex flex-wrap gap-4">
        <li v-if="!modules || modules.length === 0" class="flex w-xs">
          <UCard class="w-full">
            <div>
              <USkeleton class="mb-4 w-[10rem] h-8" />
            </div>
            <div>
              <USkeleton class="mb-4 w-[8rem] h-[8rem]" />
            </div>
            <div>
              <USkeleton class="mb-2 w-[10rem] h-6" />
              <USkeleton class="mb-2 w-[14rem] h-6" />
              <USkeleton class="mb-2 w-[12rem] h-6" />
            </div>
          </UCard>
        </li>
        <li v-for="module in modules" :key="'module-id-' + module.id"
          class="flex w-xs">
          <UCard class="w-full grid">
            <div v-if="!module.inEditMode" class="h-full flex flex-col">
              <p class="text-xl">{{ module.name }}</p>
              <UIcon :name="module.icon || 'noto-unknown-flag'"
                class="w-[10rem] h-[10rem] block" />
              <p class="mb-4">{{ module.description }}</p>
              <div class="flex-1"></div>
              <div class="flex justify-center gap-2">
                <UButton v-if="!module.inEditMode" color="primary"
                  :to="'modules/' + module.id">
                  <UIcon name="material-symbols-play-arrow" />
                  View
                </UButton>
                <UButton v-if="!module.inEditMode" color="gray"
                  @click="module.inEditMode = true">
                  <UIcon name="material-symbols-edit-note" />
                  Edit
                </UButton>
              </div>
            </div>
            <div v-else class="h-full">
              <UForm :schema="moduleSchema" :state="module"
                @submit="save(module)" class="h-full flex flex-col">
                <UFormField label="Name" name="name" hint="required">
                  <UInput v-model="module.name as string"
                    :disabled="module.isWaiting"
                    class="text-xl :invalid:border-blue" />
                </UFormField>
                <UFormField label="Icon" name="icon" hint='optional'
                  class="my-4">
                  <UInput v-model="module.icon as string"
                    :disabled="module.isWaiting" />
                </UFormField>
                <UFormField label="Description" name="description"
                  hint='optional'>
                  <UTextarea v-model="module.description as string"
                    :autoresize="true" :maxrows="8" :disabled="module.isWaiting"
                    class="mb-4 w-full resize-none" />
                </UFormField>
                <div class="flex-1"></div>
                <div class="flex justify-center gap-2">
                  <UButton type='submit' color="primary"
                    :disabled="module.isWaiting">
                    <UIcon name="material-symbols-save" />
                    Save
                  </UButton>
                  <UButton color="gray" @click="cancelEditing(module)"
                    :disabled="module.isWaiting">
                    <UIcon name="material-symbols-refresh" />
                    Cancel
                  </UButton>
                  <UButton color="warning" @click="deleteModule(module)"
                    :disabled="module.isWaiting">
                    <UIcon name="material-symbols-delete" />
                    Delete
                  </UButton>
                </div>
              </UForm>
            </div>
          </UCard>
        </li>
        <li class="flex w-xs">
          <UCard class="w-full grid items-center">
            <div class="min-h-40 flex flex-col justify-center">
              <!-- <div>
                <USkeleton class="mb-4 w-[8rem] h-8" />
              </div>
              <div>
                <USkeleton class="mb-4 w-[11rem] h-[8rem]" />
              </div>
              <div>
                <USkeleton class="mb-2 w-[17rem] h-5" />
                <USkeleton class="mb-4 w-[13rem] h-5" />
              </div> -->
              <ModuleForm isAddMode @updateModule="createModule" />
            </div>
          </UCard>
        </li>
      </ul>

      <template #footer>
        <p class="text-center">Currently showing {{ modules.length }}
          modules</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { Schema } from '~/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { z } from 'zod';

const toast = useToast();

type Module = Schema['ContentSpec']['type'];
type DynamicModule = Module & {
  inEditMode?: boolean;
  isWaiting?: boolean;
};
const moduleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const modules = useState<Array<DynamicModule>>('modules', () => []);
const client = generateClient<Schema>({ authMode: 'userPool' });
watchEffect(() => {
  client.models.ContentSpec.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      modules.value = items;
    },
    error: (error) => {
      console.error('Error observing modules:', error);
    },
  });
});
watch(() => modules.value, (mods) => {
  console.log('modules:', mods);
});

const save = async (module: DynamicModule) => {
  module.isWaiting = true;
  console.log('save > module:', module);
  if (module.id) {
    console.log('updating');
    const { data: existingModule, errors } = await client.models.ContentSpec.get({ id: module.id });
    module.isWaiting = false;
    if (errors || !existingModule) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to get module', color: 'error' });
      return;
    } else {
      const { data: updatedModule, errors } = await client.models.ContentSpec.update({ id: module.id, name: module.name, icon: module.icon, description: module.description });
      if (errors) {
        console.error(errors);
        toast.add({ title: 'Error', description: 'Failed to update module', color: 'error' });
        return;
      } else {
        toast.add({ title: 'Success', description: 'Module updated successfully', color: 'success' });
      }
    }
  } else {
    console.log('creating');
    const newModule = {
      name: module.name,
      description: module.description
    } as Module;
    if (module.icon) {
      newModule.icon = module.icon;
    }
    const { data: updatedModule, errors } = await client.models.ContentSpec.create(newModule);
    module.isWaiting = false;
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to add module', color: 'error' });
      return;
    } else {
      toast.add({ title: 'Success', description: 'Module added successfully', color: 'success' });
    }
  }
};

const cancelEditing = async (module: DynamicModule) => {
  module.isWaiting = true;
  if (module.id) {
    const { data: existingModule, errors } = await client.models.ContentSpec.get({ id: module.id });
    if (existingModule) {
      module.name = existingModule.name as string;
      module.icon = existingModule.icon as string;
      module.description = existingModule.description as string;
    }
  }
  module.inEditMode = false;
  module.isWaiting = false;
};

const deleteModule = async (module: DynamicModule) => {
  module.isWaiting = true;
  if (module.id) {
    const { errors } = await client.models.ContentSpec.delete({ id: module.id });
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to delete module', color: 'error' });
    } else {
      toast.add({ title: 'Success', description: 'Module deleted successfully', color: 'success' });
    }
  }
};

const createModule = async (moduleData: DynamicModule) => {
  console.log('createModule > moduleData:', moduleData);
  if (moduleData.id) {
    modules.value.push(moduleData);
  } else {
    const newModule = {
      name: moduleData.name,
      description: moduleData.description
    };
    const { data: updatedModule, errors } = await client.models.ContentSpec.create(newModule);
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to add module', color: 'error' });
      return;
    } else {
      toast.add({ title: 'Success', description: 'Module added successfully', color: 'success' });
    }
  }
};

const createSub = client.models.ContentSpec.onCreate().subscribe({
  next: (data) => console.log('db-reports-created:', data),
  error: (error) => console.warn(error),
});
const updateSub = client.models.ContentSpec.onUpdate().subscribe({
  next: (data) => console.log('db-reports-updated:', data),
  error: (error) => console.warn(error),
});
const deleteSub = client.models.ContentSpec.onDelete().subscribe({
  next: (data) => console.log('db-reports-deleted:', data),
  error: (error) => console.warn(error),
});

onBeforeUnmount(() => {
  createSub.unsubscribe();
  updateSub.unsubscribe();
  deleteSub.unsubscribe();
});
</script>
