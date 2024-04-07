<template>
    <LobbyHeader
        :is-connected="isConnected"
        :players="lobby?.players ?? []"
        :lobby-name="lobby?.name ?? ''"
    ></LobbyHeader>
    <UButton @click="leaveLobby">Disconnect</UButton>
</template>

<script setup lang="ts">
import type { Lobby, Message } from '~/types/chat.interface';

const { socket } = useSocket()
const route = useRoute()
const player = getPlayer()
const isConnected = ref(socket.connected)
const messages = ref<Message[]>([])
const lobby = ref<Lobby>()

watch(isConnected, (newValue) => {
    if (newValue) {
        const inviteCode = route.params.inviteCode
        socket.emit('join_lobby', {
            inviteCode,
            player: {
                socketId: socket.id,
                ...player
            }
        }, (val: Lobby) => {
            lobby.value = val
        })
    }
})

socket.on('connect', () => {
    isConnected.value = true
})

socket.on('player_joined', (playerName: string, updatedLobby: Lobby) => {
    console.log(playerName + ' joined')
    lobby.value = updatedLobby
})

socket.on('player_left', (playerName: string) => {
    console.log(playerName + ' left')
})

socket.on('lobby_update', (updatedLobby: Lobby) => {
    lobby.value = updatedLobby
})

socket.on('disconnect', () => {
    isConnected.value = false
})

socket.on('chat', (e: Message) => {
    messages.value = [e, ...messages.value]
})

onMounted(async () => {
    if (player.playerId && route.params.inviteCode) {
        socket.connect()
    } else {
        await navigateTo('/')
    }
})

onUnmounted(() => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('chat')
    socket.off('player_joined')
    socket.off('player_left')
    socket.off('lobby_update')
})

const leaveLobby = async () => {
    socket.emit('leave_lobby', {
        playerName: player.playerName,
        inviteCode: route.params.inviteCode
    })
    socket.disconnect()
    unsetPlayer()
    await navigateTo('/')
}

const sendMessage = (message: string) => {
    if (player && socket && lobby.value?.inviteCode) {
        socket.emit('chat', {
            player: {
                playerId: player.playerId,
                playerName: player.playerName,
                socketId: socket.id
            },
            timeSent: new Date(Date.now()).toLocaleDateString('en-US'),
            message,
            lobbyId: lobby.value.lobbyId
        })
    }
}
</script>