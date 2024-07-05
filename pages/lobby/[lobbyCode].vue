<template>
    <div>
        <div class="fixed w-full bottom-0 pb-6 pt-3 bg-white dark:bg-[#121212]">
            <div class="flex justify-center gap-3">
                <UButton @click="startGame" v-if="isHost" size="xl" :disabled="lobby?.players.length == 0">Start Game</UButton>
                <UButton @click="deleteLobby" v-if="isHost" color="red" size="xl">Close Lobby</UButton>
                <UButton @click="kickPlayer(player?._id!, player?.name!)" v-else color="red" size="xl">Leave Lobby</UButton>
            </div>
        </div>
        <div class="py-5 px-3 lg:px-0 lg:w-1/2 lg:mx-auto">
            <UCard class="lg:mx-auto lg:w-[350px] mb-3">
                <template #header>{{ lobby?.quiz.name }}</template>
                <div class="text-gray-500 dark:text-gray-400">
                    <p>Categories: {{ lobby?.quiz.categories.length }}</p>
                    <p>Questions: {{ lobby?.quiz.questions?.length }}</p>
                </div>
                <template #footer>
                    <p class="text-center text-gray-500 dark:text-gray-400">Invite Code</p>
                    <p class="text-xl tracking-widest text-center font-semibold">{{ lobby?.code }}</p>
                </template>
            </UCard>
            <div v-if="lobby?.players.length! > 0">
                <div class="text-center text-xl mb-3">Players</div>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-[75px]">
                    <UCard v-for="p in lobby?.players">
                        <div class="text-gray-500 dark:text-gray-400">
                            <p class="text-xl text-center">{{ p.name }}</p>
                        </div>
                        
                        <template #footer v-if="isHost">
                            <div class="flex justify-center">
                                <UButton @click="kickPlayer(p._id, p.name)" variant="ghost" color="red">Kick Player</UButton>
                            </div>
                        </template>
                    </UCard>
                </div>
            </div>
            
            <div class="flex flex-col h-[300px] justify-center items-center" v-else>
                <p>No Players...</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Lobby, Player, User } from '~/types/chat.interface';

const { $api } = useNuxtApp()
const {getSession, unsetSession} = useSession()
const { socket } = useSocket()
const player = getPlayer()
const session = getSession()
const route = useRoute()
const currentLobby = useCookie<string | undefined>('lobby')

const lobbyCode = route.params.lobbyCode
const isHost = ref(false)

const {data: lobby, refresh: refreshLobby}= await useAPI<Lobby>(`lobby/find/${lobbyCode}`)
const {data: user} = await useAPI<User>('users/profile', {
    headers: {
        Authorization: `Bearer ${session!}`
    }
})

if (user.value?.id == lobby.value?.host) {
    isHost.value = true
}

socket.on('host_joined', (lobbyId: string) => {
    console.log(`Host successfully connected to lobby ${lobbyId}.`)
})

socket.on('player_joined', (newPlayer: Player) => {
    console.log(`${newPlayer.name} has joined.`)
    refreshLobby()
})

socket.on('game_started', () => {
    refreshLobby()
    if (isHost.value) {
        console.log("leaderboard!")
    } else {
        socket.disconnect()
        navigateTo(`/game/${lobbyCode}`)
    }
})

socket.on('player_kicked', (playerId: string, playerName: string) => {

    if (playerId == player.value?._id) {
        unsetPlayer()
        currentLobby.value = undefined

        console.log('You have been removed from the lobby.')
        navigateTo('/')

        socket.disconnect()
    } else {
        console.log(`${playerName} has been removed from the lobby.`)
    }

    refreshLobby()
})

socket.on('kick_all', () => {
    unsetPlayer()
    currentLobby.value = undefined

    if (isHost.value) {
        navigateTo('/login')
    } else {
        navigateTo('/')
    }

    socket.disconnect()
})

if (isHost.value) {
    socket.on('connect', () => {
        socket.emit('host_lobby', {
            inviteCode: lobbyCode,
            userId: user.value?.id
        })
    })
} else {
    if (player.value != null) {
        if (lobby.value?.lobbyStatus != "waiting") {
            navigateTo('/')
            socket.disconnect()
        }

        socket.on('connect', () => {
            socket.emit('player_lobby', {
                inviteCode: lobbyCode,
                player: player.value
            })
        })

        // console.log(`Welcome ${player.value?.name}`)

        // const playerIndex = lobby.value?.players.some(p => p._id === player.value?._id)

        // console.log(playerIndex)
    } else {
        console.log("There is no player")
        navigateTo('/')
    }
}

const kickPlayer = (playerId: string, playerName: string) => {
    socket.emit('kick_player', {
        lobbyId: lobby.value?._id,
        playerId,
        playerName
    })
}

const deleteLobby = () => {
    socket.emit('delete_lobby', {
        lobbyId: lobby.value?._id
    })
}

const startGame = () => {
    if (isHost.value) {
        socket.emit('start_game', {
            lobbyId: lobby.value?._id
        })
    }
}

onMounted(() => {
    socket.connect()
})

onUnmounted(() => {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('host_joined')
    socket.off('kick_all')
    socket.off('game_started')
})


watchEffect(() => {
    if (!lobby.value) {
        navigateTo('/')
    }
})

</script>
