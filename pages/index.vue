<template>    
    <div class="flex flex-col gap-3 lg:flex-row lg:justify-between">
        <LobbySelector 
            :lobbies="lobbies ?? []"
            :selectedLobby="joinLobbySelection"
            :isLoading="isLoading"
            @select-lobby="joinLobbySelection = $event"
        ></LobbySelector>
        <LoginForm class="flex-1" :defaultPlayer="player.playerName" :disableNewLobby="joinLobbySelection !== ''" @login="login"></LoginForm>
    </div>
    <UButton @click="createLobby">Create Lobby</UButton>
</template>

<script setup lang="ts">
import type { Lobby } from '~/types/chat.interface'

const { $api } = useNuxtApp()

const { socket } = useSocket()
const player = getPlayer()
const currentLobby = useCookie<string>('lobby')

const joinLobbySelection = ref('')
const isLoading = ref(true)
const lobbies = ref<Lobby[]>([])

onMounted(() => {
    socket.connect()
    
    isLoading.value = true

    socket.on('lobbies_updated', (updatedLobbies: Lobby[]) => {
        isLoading.value = true
        lobbies.value = updatedLobbies
        isLoading.value = false
    })

    socket.emit('get_lobbies')
})

onUnmounted(() => {
    socket.disconnect()
    socket.off('connect')
    socket.off('disconnect')
    socket.off('lobbies_updated')
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

const login = async ({ playerName, inviteCode }: { playerName: string; inviteCode: string }) => {
    const newPlayer = {
        playerId: generatePlayerId(playerName),
        playerName: playerName
    }

    setPlayer({id: newPlayer.playerId, name: newPlayer.playerName})

    const lobby = inviteCode
    currentLobby.value = lobby

    await navigateTo(`/lobby/${lobby}`)
}

// watchEffect(() => {
//     if (player?.playerId && currentLobby.value) {
//         navigateTo(`/lobby/${currentLobby.value}`)
//     }
// })

</script>
