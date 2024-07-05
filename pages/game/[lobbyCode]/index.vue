<template>
    <div class="p-5">
        <div class="w-full text-center">
            <p>{{ lobby?.categorizedQuestions[lobby.categoryIndex].questions![lobby.questionIndex].text }}</p>
        </div>
        {{ lobby?.categorizedQuestions[lobby.categoryIndex].questions! }}
        <div class="grid gap-3 grid-cols-1 mt-5" 
            :class="
                lobby?.categorizedQuestions[lobby.categoryIndex].questions![lobby.questionIndex].choices?.length! % 2 === 0 ?
                'lg:grid-cols-2':
                ''">
            <div class="flex"  v-for="choice in lobby?.categorizedQuestions[lobby.categoryIndex].questions![lobby.questionIndex].choices">
                <label class="p-5 border rounded w-full text-center cursor-pointer" :class="selectedAns === choice._id ? 'bg-green-500': ''" :for="choice._id">{{ choice.text }}</label>

                <URadio :id="choice._id" v-model="selectedAns" :value="choice._id" />
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

socket.on('connect', () => {
    socket.emit('join_game', {
        inviteCode: lobbyCode
    })
})

socket.on('update_game', () => {
    refreshLobby()
    refreshPlayer()
})

socket.on('kick_all', () => {
    unsetPlayer()
    currentLobby.value = undefined

    navigateTo('/')

    socket.disconnect()
})

socket.on('player_ready', () => {
    console.log("Player Ready")
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
})

watch(selectedAns, (newValue) => {
    socket.emit('submit_answer', {
        answer: newValue,
        playerId: player.value?._id,
        lobbyId: lobby.value?._id
    })
})

</script>

<style>
input[type=radio] {
    @apply hidden;
}
</style>
