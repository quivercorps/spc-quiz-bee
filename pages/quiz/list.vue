<template>
    <div class="flex">
        <div class="mx-auto">

            <div v-for="quiz in quizzes">
                <UButton @click="navigateToQuiz(quiz._id)">{{ quiz.name }}</UButton>
            </div>

            <UButton v-if="session" @click="createLobby">Create Lobby</UButton>
        <UButton v-if="session" @click="logout">logout</UButton>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import type { Quiz } from '~/types/quiz.interface';

const { $api } = useNuxtApp()
const {getSession, unsetSession} = useSession()
const session = getSession()
const router = useRouter()

const { data: quizzes, error, pending } = useAPI<Quiz[]>('/quiz/list', {
    headers: {
        'Authorization': `Bearer ${session}`,
    }
})

const createLobby = async () => {
    const newPlayer = {
        playerId: generatePlayerId('Admin'),
        playerName: 'Admin'
    }
    setPlayer({id: newPlayer.playerId, name: newPlayer.playerName})

    const inviteCode = await $api<string>('lobby/generate_invite')
    await navigateTo(`/lobby/${inviteCode}`)
}

const navigateToQuiz = async (id: string) => {
    await navigateTo(`/quiz/${id}`)
}

const logout = async () => {
    unsetSession()
    await navigateTo('/')
}

watchEffect(() => {
    if (!session) {
        navigateTo('/')
    }
})

</script>
