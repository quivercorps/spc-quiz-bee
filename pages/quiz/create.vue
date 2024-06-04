<template>
    <div class="flex justify-end mb-5">
        <UButton>Add New Question</UButton>
    </div>
    
    <div class="questions">
        <Question v-for="question in quizQuestions" :question="question" />
    </div>
</template>

<script setup lang="ts">
import { QuestionType } from '~/types/enum'
import type { Question } from '~/types/quiz.interface';

const quizQuestions = ref<Question[]>([
    {
        type: QuestionType.MultipleChoice,
        text: 'What is your favorite color?',
        choices: ['red', 'blue'],
        _id: '',
        category: '',
        timer: 0
    },
    {
        type: QuestionType.MultipleChoice,
        text: 'What is your favorite color?',
        choices: ['red', 'blue'],
        _id: '',
        category: '',
        timer: 0
    }
])
</script>

<style>
.questions {
    @apply flex flex-col gap-5;
}
</style>
