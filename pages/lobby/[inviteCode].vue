<template>
    <LobbyHeader
        :is-connected="isConnected"
        :users="lobby?.users ?? []"
        :lobby-name="lobby?.name ?? ''"
    ></LobbyHeader>
    <UButton @click="leaveLobby">Disconnect</UButton>
</template>

<script setup lang="ts">
import type { Lobby, Message } from '~/types/chat.interface';

const { socket } = useSocket()
const route = useRoute()
const user = getUser()
const isConnected = ref(socket.connected)
const messages = ref<Message[]>([])
const lobby = ref<Lobby>()

watch(isConnected, (newValue) => {
    if (newValue) {
        const inviteCode = route.params.inviteCode
        socket.emit('join_lobby', {
            inviteCode,
            user: {
                socketId: socket.id,
                ...user
            }
        }, (val: Lobby) => {
            lobby.value = val
        })
    }
})

socket.on('connect', () => {
    isConnected.value = true
})

socket.on('user_joined', (userName: string) => {
    console.log(userName)
    socket.emit('update_lobby', route.params.inviteCode)
})

socket.on('update_lobby', (updated_lobby: Lobby) => {
    console.log("update...")
    lobby.value = updated_lobby
})

socket.on('disconnect', () => {
    isConnected.value = false
    socket.emit('update_lobby', route.params.inviteCode)
})

socket.on('chat', (e: Message) => {
    messages.value = [e, ...messages.value]
})

onMounted(async () => {
    if (user.userId && route.params.inviteCode) {
        socket.connect()
    } else {
        await navigateTo('/')
    }
})

onUnmounted(() => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('chat')
})

const leaveLobby = async () => {
    socket.disconnect()
    unsetUser()
    await navigateTo('/')
}

const sendMessage = (message: string) => {
    if (user && socket && lobby.value?.inviteCode) {
        socket.emit('chat', {
            user: {
                userId: user.userId,
                userName: user.userName,
                socketId: socket.id
            },
            timeSent: new Date(Date.now()).toLocaleDateString('en-US'),
            message,
            lobbyId: lobby.value.lobbyId
        })
    }
}
</script>