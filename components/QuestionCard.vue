<template>
    <UCard>
        <template #header>
            <div class="flex gap-1">
              <UTextarea autoresize :rows="1" @change="$emit('update-questions', question, index)" color="gray" class="flex-1" size="lg" v-model="question.text" placeholder="Enter A Question..." />
              <UButton @click="$emit('delete-question', question)" color="red" class="mb-1" variant="ghost" icon="i-heroicons-trash"></UButton>
            </div>     
        </template>
        <div class="choices">
            <p class="font-semibold mb-3">Choices</p>
            <div class="flex flex-col gap-y-3" v-if="question.questionType === QuestionType.MultipleChoice">
                <div v-for="(choice, index) in question.choices">
                    <div class="flex gap-3 items-center">
                        <URadio 
                            v-model="selectedChoice"
                            :value="choice._id!"
                            @change="updateCorrectChoice(choice._id!)"  />
                        <UInput @change="updateName(choice, index)" class="w-full" v-model="question.choices![index].text" />
                        <UButton
                            @click="deleteChoice(choice, index)"
                            v-if="question.choices!.length > 2"
                            class="p-0"
                            size="xl"
                            icon="i-heroicons-x-mark"
                            color="red"
                            square
                            variant="link" />
                    </div>
                </div>
                <div @click="$emit('create-choice', question._id)" v-if="question.choices!.length < 4" class="add-button">
                    <UIcon name="i-heroicons-plus" />
                </div>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { QuestionType } from '~/types/enum';
import type { Choice, Question } from '~/types/quiz.interface';

const props = defineProps<{ question: Question, index: number }>()
const { question } = toRefs(props)

const selectedChoice = computed({
  get() {
    return question.value.choices!.find(choice => choice.isCorrect)?._id
  },
  set(newValue) {
    question.value.choices!.forEach(choice => {
      choice.isCorrect = choice._id === newValue
    });
  }
})

const emit = defineEmits(['update-questions', 'delete-question', 'create-choice', 'delete-choice'])

function deleteChoice(choice: Choice, index: number) {
  
  const newChoices = question.value.choices?.filter(item => item._id !== choice._id)

  let idOfNextChoice = selectedChoice.value
  
  if (selectedChoice.value == choice._id) {
    if (index === 0) {
      idOfNextChoice = question.value.choices![1]._id!
    } else {
      idOfNextChoice = question.value.choices![index! - 1]._id!
    }
  }

  question.value.choices = newChoices?.splice(0)
  // updateCorrectChoice(idOfNextChoice!)
  emit('delete-choice', choice._id, question.value._id)
}

function updateCorrectChoice(id: string) {
  selectedChoice.value = id;

  emit('update-questions', props.question, props.index)
}

function updateName(choice: Choice, index: number) {
  const prevText = choice.text
  if (!choice.text) {
    question.value.choices![index].text = prevText
    return
  }

  emit('update-questions', props.question, props.index)
}

</script>

<style>
.add-button {
    @apply flex justify-center p-2 border-2 border-dashed rounded text-gray-300 cursor-pointer
    hover:text-gray-400 hover:border-gray-300;
}
</style>
