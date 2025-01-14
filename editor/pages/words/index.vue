<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-2xl text-[var(--ui-primary)]">Words</h1>
      </template>

      <ul class="flex flex-wrap gap-4">
        <li v-if="!words || words.length === 0" class="flex w-xs">
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
        <li v-for="word in words" :key="'word-id-' + word.id"
          class="flex w-xs">
          <UCard class="w-full grid">
            <div v-if="!word.inEditMode" class="h-full flex flex-col">
              <p class="text-xl">{{ word.name }}</p>
              <UIcon :name="word.icon || 'noto-unknown-flag'"
                class="w-[10rem] h-[10rem] block" />
              <p class="mb-4">{{ word.description }}</p>
              <div class="flex-1"></div>
              <div class="flex justify-center gap-2">
                <UButton v-if="!word.inEditMode" color="primary"
                  :to="'words/' + word.id">
                  <UIcon name="material-symbols-play-arrow" />
                  View
                </UButton>
                <UButton v-if="!word.inEditMode" color="gray"
                  @click="word.inEditMode = true">
                  <UIcon name="material-symbols-edit-note" />
                  Edit
                </UButton>
              </div>
            </div>
            <div v-else class="h-full">
              <UForm :schema="wordSchema" :state="word"
                @submit="save(word)" class="h-full flex flex-col">
                <UFormField label="Name" name="name" hint="required">
                  <UInput v-model="word.name as string"
                    :disabled="word.isWaiting"
                    class="text-xl :invalid:border-blue" />
                </UFormField>
                <UFormField label="Icon" name="icon" hint='optional'
                  class="my-4">
                  <UInput v-model="word.icon as string"
                    :disabled="word.isWaiting" />
                </UFormField>
                <UFormField label="Description" name="description"
                  hint='optional'>
                  <UTextarea v-model="word.description as string"
                    :autoresize="true" :maxrows="8" :disabled="word.isWaiting"
                    class="mb-4 w-full resize-none" />
                </UFormField>
                <div class="flex-1"></div>
                <div class="flex justify-center gap-2">
                  <UButton type='submit' color="primary"
                    :disabled="word.isWaiting">
                    <UIcon name="material-symbols-save" />
                    Save
                  </UButton>
                  <UButton color="gray" @click="cancelEditing(word)"
                    :disabled="word.isWaiting">
                    <UIcon name="material-symbols-refresh" />
                    Cancel
                  </UButton>
                  <UButton color="warning" @click="deleteWord(word)"
                    :disabled="word.isWaiting">
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
              <WordForm isAddMode @updateWord="createWord" />
            </div>
          </UCard>
        </li>
      </ul>

      <template #footer>
        <p class="text-center">Currently showing {{ words.length }}
          words</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { Schema } from '~/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { z } from 'zod';

const toast = useToast();

type Word = Schema['Word']['type'];
type DynamicWord = Word & {
  inEditMode?: boolean;
  isWaiting?: boolean;
};
const wordSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
});
const isSynced = ref(false);

const words = useState<Array<DynamicWord>>('words', () => []);
const client = generateClient<Schema>({ authMode: 'userPool' });
watchEffect(() => {
  client.models.Word.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      words.value = items;
    },
    error: (error) => {
      console.error('Error observing words:', error);
    },
  });
});
watch(() => words.value, (mods) => {
  console.log('words:', mods);
});

const save = async (word: DynamicWord) => {
  word.isWaiting = true;
  console.log('save > word:', word);
  if (word.id) {
    console.log('updating');
    const { data: existingWord, errors } = await client.models.Word.get({ id: word.id });
    word.isWaiting = false;
    if (errors || !existingWord) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to get word', color: 'error' });
      return;
    } else {
      const { data: updatedWord, errors } = await client.models.Word.update({ id: word.id, name: word.name, icon: word.icon, description: word.description });
      if (errors) {
        console.error(errors);
        toast.add({ title: 'Error', description: 'Failed to update word', color: 'error' });
        return;
      } else {
        toast.add({ title: 'Success', description: 'Word updated successfully', color: 'success' });
      }
    }
  } else {
    console.log('creating');
    const newWord = {
      name: word.name,
      description: word.description
    } as Word;
    if (word.icon) {
      newWord.icon = word.icon;
    }
    const { data: updatedWord, errors } = await client.models.Word.create(newWord);
    word.isWaiting = false;
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to add word', color: 'error' });
      return;
    } else {
      toast.add({ title: 'Success', description: 'Word added successfully', color: 'success' });
    }
  }
};

const cancelEditing = async (word: DynamicWord) => {
  word.isWaiting = true;
  if (word.id) {
    const { data: existingWord, errors } = await client.models.Word.get({ id: word.id });

    if (existingWord) {
      word.name = existingWord.name as string;
      word.icon = existingWord.icon as string;
      word.description = existingWord.description as string;
    }
  }
  word.inEditMode = false;
  word.isWaiting = false;
};

const deleteWord = async (word: DynamicWord) => {
  word.isWaiting = true;
  if (word.id) {
    const { errors } = await client.models.Word.delete({ id: word.id });
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to delete word', color: 'error' });
    } else {
      toast.add({ title: 'Success', description: 'Word deleted successfully', color: 'success' });
    }
  }
};

const createWord = async (wordData: DynamicWord) => {
  console.log('createWord > wordData:', wordData);
  if (wordData.id) {
    words.value.push(wordData);
  } else {
    const newWord = {
      name: wordData.name,
      description: wordData.description
    };
    const { data: updatedWord, errors } = await client.models.Word.create(newWord);
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to add word', color: 'error' });
      return;
    } else {
      toast.add({ title: 'Success', description: 'Word added successfully', color: 'success' });
    }
  }
};

const createSub = client.models.Word.onCreate().subscribe({
  next: (data) => console.log('db-reports-created:', data),
  error: (error) => console.warn(error),
});
const updateSub = client.models.Word.onUpdate().subscribe({
  next: (data) => console.log('db-reports-updated:', data),
  error: (error) => console.warn(error),
});
const deleteSub = client.models.Word.onDelete().subscribe({
  next: (data) => console.log('db-reports-deleted:', data),
  error: (error) => console.warn(error),
});

onBeforeUnmount(() => {
  createSub.unsubscribe();
  updateSub.unsubscribe();
  deleteSub.unsubscribe();
});
</script>
