<template>
    <div class="p-5">
        <div class="flex justify-between items-center">
            <p class="text-lg">Score: {{ player?.score }}</p>
            <p class="flex items-center gap-1 text-lg" v-if="lobby?.hasTimer">{{ timer }} <UIcon name="i-heroicons-clock"></UIcon></p>
        </div>
        <div class="text-center my-3 p-6 rounded border dark:border-slate-500">
            <p class="text-lg">{{ lobby?.categorizedQuestions[lobby.categoryIndex].questions![lobby.questionIndex].text }}</p>
            <p class="text-sm text-gray-500 dark:border-slate-500">{{ lobby?.categorizedQuestions[lobby.categoryIndex].category.name }}</p>
        </div>
        {{ selectedAns }}
        <div class="grid gap-3 grid-cols-1 mt-5" 
            :class="
                lobby?.categorizedQuestions[lobby.categoryIndex].questions![lobby.questionIndex].choices?.length! % 2 === 0 ?
                'lg:grid-cols-2':
                ''">
                
            <div class="flex"  v-for="(choice, index) in lobby?.categorizedQuestions[lobby.categoryIndex].questions![lobby.questionIndex].choices">
                <UButton 
                @click="selectAnswer(choice._id!)"
                :color="colors[index]"
                class="py-3 text-lg"
                :class="selectedAns === choice._id ? 'border-4 border-yellow-500': ''"
                block>{{ choice.text }}</UButton>

                <URadio class="hidden" :id="choice._id" v-model="selectedAns" :value="choice._id" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Lobby, Player } from '~/types/chat.interface';

const { $api } = useNuxtApp()
const {getSession, unsetSession} = useSession()
const { socket } = useSocket()
const localPlayer = getPlayer()
const session = getSession()
const route = useRoute()
const currentLobby = useCookie<string | undefined>('lobby')

const lobbyCode = route.params.lobbyCode

const {data: lobby, refresh: refreshLobby} = await useAPI<Lobby>(`lobby/find/${lobbyCode}`)
const {data: player, refresh: refreshPlayer} = await useAPI<Player>(`lobby/player/find/${localPlayer.value?._id}`)

const selectedAns = ref<string>("")
const timer = ref(lobby.value?.timer)
const colors = ['red', 'emerald', 'blue', 'purple']

socket.on('connect', () => {
    if (player.value?.answer) {
        selectedAns.value = player.value?.answer
    }

    socket.emit('join_game', {
        inviteCode: lobbyCode
    })
})

socket.on('update_timer', (newTimer: number) => {
    timer.value = newTimer
})

socket.on('update_game', () => {
    selectedAns.value = ""
    refreshLobby()
    refreshPlayer()
})

socket.on('kick_all', () => {
    unsetPlayer()
    currentLobby.value = undefined
    socket.disconnect()

    navigateTo('/')
})

socket.on('player_ready', () => {
    console.log("Player Ready")
})

socket.on('end_game', async () => {
    unsetPlayer()
    currentLobby.value = undefined
    socket.disconnect()

    await navigateTo(`/game/${lobbyCode}/leaderboard`)
})

onMounted(() => {
    socket.connect()
})

onUnmounted(() => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('kick_all')
    socket.off('player_ready')
    socket.off('update_game')
    socket.off('end_game')
})

const selectAnswer = (choiceId: string) => {
    selectedAns.value = choiceId
    socket.emit('submit_answer', {
        answer: choiceId,
        playerId: player.value?._id,
        lobbyId: lobby.value?._id
    })
}

// watch(selectedAns, (newValue) => {
//     socket.emit('submit_answer', {
//         answer: newValue,
//         playerId: player.value?._id,
//         lobbyId: lobby.value?._id
//     })
// })

</script>