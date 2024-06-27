<template>
    <div class="flex items-center justify-between">
        <UInput
            icon="i-heroicons-magnifying-glass-20-solid"
            color="white"
            :trailing="false"
            v-model="search"
            placeholder="Search Quiz...">
        </UInput>
        <UButton @click="createQuiz" label="Create New Quiz" :loading="isLoading"></UButton>
    </div>
    <div v-if="!pendingQuizzes" class="flex flex-col gap-3 mt-5">
        
        <div class="flex flex-col items-center" v-if="filteredQuizzes?.length == 0">
            <p>No Results...</p>
        </div>

        <UCard v-else v-for="quiz in filteredQuizzes">
            <template #header>
                <div class="flex justify-between items-center">
                    <p>{{ quiz.name }}</p>

                    <UButton @click="deleteQuiz(quiz._id)" color="red" variant="ghost" icon="i-heroicons-trash" trailing>Delete Quiz</UButton>
                </div>
            </template>
            <div class="flex justify-between items-center">
                <div class="text-gray-500 dark:text-gray-400">
                    <p>Categories: {{ quiz.categories?.length || 0 }}</p>
                    <p>Questions: {{ quiz.questions?.length || 0 }}</p>
                </div>
                <UButton size="xl" @click="navigateToQuiz(quiz._id)" icon="i-heroicons-pencil-square" trailing>Edit</UButton>
            </div>
        </UCard>
    </div>
    <div v-else class="flex flex-col items-center gap-3 mt-5">
        <p>Fetching Quizzes</p>
        <UIcon class="animate-spin h-6 w-6" name="i-heroicons-arrow-path"></UIcon>
    </div>
</template>

<script lang="ts" setup>
import type { Quiz } from '~/types/quiz.interface';

definePageMeta({
  layout: 'dashboard-layout'
})

const { $api } = useNuxtApp()
const {getSession, unsetSession} = useSession()
const session = getSession()
const router = useRouter()

const isLoading = ref(false)

const search = ref('')

const {data: quizzes, pending: pendingQuizzes, refresh: refreshQuizzes} = await useAPI<Quiz[]>('quiz/list', {
    headers: {
        Authorization: `Bearer ${session!}`
    }
})

const createQuiz = async() => {
    try {
        isLoading.value = true
        const result: Quiz = await $api('quiz/create', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session!}`
            }
        })
        isLoading.value = false
        navigateTo({
            path: `/quiz/${result._id}`
        })
    } catch (error) {
        console.error('Quiz Error:', error)
    }
}

const deleteQuiz = async (quizId: string) => {

    await $api('quiz/delete', {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${session!}`
        },
        body: {quizId}
    })

    refreshQuizzes()
}

const filteredQuizzes = computed(() => {
    if (!search.value) {
        return quizzes.value
    }

    const query = search.value.toLowerCase()

    return quizzes.value?.filter(quiz =>
        quiz.name.toLowerCase().includes(query)
    )
})

const navigateToQuiz = async (id: string) => {
    navigateTo(`/quiz/${id}`)
}

watchEffect(() => {
    if (!session) {
        navigateTo('/')
    }
})
</script>
