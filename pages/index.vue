<template>
    <!-- <div>
        <UButton v-if="session" @click="goToQuizzes">My Quizzes</UButton>
        <UButton v-if="session" @click="getProfile">go to profile</UButton>
        <UButton v-if="session" @click="logout">logout</UButton>
        <div v-if="!session">
            LOGIN FORM
            <UForm :state="loginState" @submit="loginUser">
                <UFormGroup label="Name" name="userName">
                    <UInput v-model="loginState.email"></UInput>
                </UFormGroup>
                
                <UFormGroup label="Password" name="lobbyName">
                    <UInput type="password" v-model="loginState.password"></UInput>
                </UFormGroup>

                <UButton type="submit">Submit</UButton>
            </UForm>
        </div>
    </div>
    <div class="flex flex-col gap-3 lg:flex-row lg:justify-between">
        <LobbySelector 
            :lobbies="lobbies ?? []"
            :selectedLobby="joinLobbySelection"
            :isLoading="isLoading"
            @select-lobby="joinLobbySelection = $event"
        ></LobbySelector>
        <LoginForm class="flex-1" :defaultPlayer="player.playerName" :disableNewLobby="joinLobbySelection !== ''" @login="login"></LoginForm>
    </div>
    <UButton v-if="session" @click="createLobby">Create Lobby</UButton> -->
    <div class="flex h-screen">
        <div class="m-auto">
            <JoinForm 
                @join="join">

            </JoinForm>
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
