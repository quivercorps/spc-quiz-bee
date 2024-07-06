<template>
    <div class="flex h-screen">
        <div class="m-auto flex flex-col gap-2">
            <UButton @click="navigateTo('/dashboard')" v-if="user" icon="i-heroicons-adjustments-vertical">Go to Dashboard</UButton>
            <JoinForm
                v-else
                @join="join"/>
            <UButton @click="navigateTo('/leaderboards')"  variant="outline" color="emerald" icon="i-heroicons-list-bullet">Leaderboards</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FindLobby, Lobby, Player, User } from '~/types/chat.interface'

const { $api } = useNuxtApp()
const { socket } = useSocket()
const router = useRouter()
const {unsetSession, setSession, getSession} = useSession()

const session = getSession()
const currentLobby = useCookie<string | undefined>('lobby')

const joinLobbySelection = ref('')
const isLoading = ref(true)
const lobbies = ref<Lobby[]>([])

const {data: user} = await useAPI<User>('users/profile', {
    headers: {
        Authorization: `Bearer ${session!}`
    }
})

const loginState = reactive({
    email: "",
    password: "",
})

const loginUser = async () => {
    try {
        const result: {access_token: string} = await $api('auth/login', {
            method: 'POST',
            body: loginState
        })
        setSession(result.access_token)
        router.go(0)
    } catch (error) {
        console.error('Login Error:', error)
    }
}

const logout = async () => {
    unsetSession()
    router.go(0)
}

const getProfile = async () => {
    try {
        const result: User = await $api('users/profile', {
            headers: {
                Authorization: `Bearer ${session!}`
            }
        })
        console.log(result.userName)
    } catch (error) {
        console.error(error)
    }
}

// onMounted(() => {
//     socket.connect()
    
//     isLoading.value = true

//     socket.on('lobbies_updated', (updatedLobbies: Lobby[]) => {
//         isLoading.value = true
//         lobbies.value = updatedLobbies
//         isLoading.value = false
//     })

//     socket.emit('get_lobbies')
// })

// onUnmounted(() => {
//     socket.disconnect()
//     socket.off('connect')
//     socket.off('disconnect')
//     socket.off('lobbies_updated')
// })

// const createLobby = async () => {
//     const newPlayer = {
//         playerId: generatePlayerId('Admin'),
//         playerName: 'Admin'
//     }
//     setPlayer({id: newPlayer.playerId, name: newPlayer.playerName})

//     const inviteCode = await $api<string>('lobby/generate_invite')
//     await navigateTo(`/lobby/${inviteCode}`)
// }

const join = async ({ playerName, inviteCode }: { playerName: string; inviteCode: string }) => {
    unsetPlayer()
    currentLobby.value = undefined

    const res: FindLobby = await $api('lobby/join', {
        method: 'POST',
        body: {
            name: playerName,
            code: inviteCode
        }
    })

    currentLobby.value = res.lobbyId

    setPlayer(res.player)

    navigateTo(`/lobby/${inviteCode}`)
}

// const goToQuizzes = async () => {
//     await navigateTo(`/quiz/list`)
// }

// watchEffect(() => {
//     if (player?.playerId && currentLobby.value) {
//         navigateTo(`/lobby/${currentLobby.value}`)
//     }
// })

</script>
