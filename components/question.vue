<template>
    <UCard>
        <template #header>
            <UInput size="lg" variant="none" v-model="question.text" placeholder="Enter A Question..." />
        </template>
        <div class="choices">
            <p class="font-semibold mb-3">Choices</p>
            <div class="flex flex-col gap-y-3" v-if="question.type === QuestionType.MultipleChoice">
                <div v-for="(_, index) in question.choices">
                    <div class="flex gap-3 items-center">
                        <URadio v-model="selected" :value="index" />
                        <UInput class="w-full" v-model="question.choices[index]" />
                        <UButton
                            v-if="question.choices.length > 2"
                            @click="deleteChoice(index)"
                            class="p-0"
                            size="xl"
                            icon="i-heroicons-x-mark"
                            color="red"
                            square
                            variant="link" />
                    </div>
                </div>
                <div v-if="question.choices.length < 4" class="add-button" @click="addChoice">
                    <UIcon name="i-heroicons-plus" />
                </div>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { QuestionType } from '~/types/enum';
import type { QuizQuestion } from '~/types/interface';

const props = defineProps<{ question: QuizQuestion }>();
const { question } = toRefs(reactive({
  question: props.question,
}));
const selected = ref(0);

function addChoice() {
  question.value.choices.push('');
}

function deleteChoice(index: number) {
    if (selected.value == index) selected.value = 0
    question.value.choices.splice(index, 1);
    if (selected.value >= question.value.choices.length) selected.value -= 1
}
</script>

<style>
.add-button {
    @apply flex justify-center p-2 border-2 border-dashed rounded text-gray-300 cursor-pointer
    hover:text-gray-400 hover:border-gray-300;
}
</style>
