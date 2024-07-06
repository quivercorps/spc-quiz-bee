<template>
    <div class="px-3 lg:px-0 lg:w-1/2 xl:w-1/3 mx-auto pb-10">
        <div class="flex gap-1 items-center mt-5">
            <UButton @click="navigateTo('/leaderboards')" variant="ghost" icon="i-heroicons-arrow-uturn-left"></UButton>
            <p class="text-xl">{{lobby?.quiz.name}}</p>
        </div>
        <div v-if="lobby?.lobbyStatus === 'ongoing'"  class="text-center mt-3 mb-1 p-6 rounded border dark:border-slate-500">
            <p class="text-lg">{{ lobby?.categorizedQuestions[lobby.categoryIndex].questions![lobby.questionIndex].text }}</p>
            <p class="text-sm text-gray-500 dark:border-slate-500">{{ lobby?.categorizedQuestions[lobby.categoryIndex].category.name }}</p>
        </div>
        <div class="flex flex-col">
            <div class="flex justify-between items-center px-5 mt-2 mb-5 text-lg">
                <p>Players</p>
                <p>Score</p>
            </div>
            <UCard v-for="(player, index) in sortPlayers">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-5">
                        <p class="text-2xl text-gray-400 p-0">{{ index + 1 }}</p>
                        <p class="p-0">{{ player.name }}</p>
                    </div>
                    <p class="text-lg text-indigo-800 dark:text-yellow-400 p-0">{{ player.score }}</p>
                </div>
            </UCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Lobby } from '~/types/chat.interface';

const { $api } = useNuxtApp()
const { socket } = useSocket()
const route = useRoute()

const lobbyCode = route.params.lobbyCode

const {data: lobby, refresh: refreshLobby} = await useAPI<Lobby>(`lobby/find/${lobbyCode}`)

const sortPlayers = computed(() => {
    return lobby.value?.players.sort((a, b) => b.score - a.score)
})

socket.on('connect', () => {
    socket.emit('join_leader', {
        inviteCode: lobbyCode
    })
})

socket.on('update_game', () => {
    refreshLobby()
})

socket.on('kick_all', () => {
    socket.disconnect()

    navigateTo('/leaderboards')
})

socket.on('end_game', () => {
    socket.disconnect()
})

onMounted(() => {
    if (lobby.value?.lobbyStatus === 'ongoing')
        socket.connect()
})

onUnmounted(() => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('kick_all')
    socket.off('viewer_ready')
    socket.off('update_game')
})

watchEffect(() => {
    if (!lobby.value) {
        navigateTo('/')
    }
})

</script>