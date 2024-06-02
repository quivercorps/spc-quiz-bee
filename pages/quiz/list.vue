<template>
    <div>
        <div v-for="quiz in data">
            <UButton @click="navigateToQuiz(quiz._id)">{{ quiz.name }}</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const {unsetSession, setSession, getSession} = useSession()
const session = getSession()
const router = useRouter()

const { data, error, pending } = useAPI('/quiz/list', {
    headers: {
        'Authorization': `Bearer ${session}`,
    }
})

const navigateToQuiz = async (id) => {
    await navigateTo(`/quiz/${id}`)
}

</script>
