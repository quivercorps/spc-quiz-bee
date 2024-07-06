<template>
    <div>
        <UForm :state="state" @submit="join">
            <UFormGroup label="Display Name" name="playerName">
                <UInput v-model="state.playerName" required></UInput>
            </UFormGroup>
            <UFormGroup label="Invite Code" name="lobbyName">
                <UInput v-model="state.inviteCode" required></UInput>
            </UFormGroup>
            <UButton class="w-full flex justify-center mt-3" type="submit" :disabled="currentLobby != undefined">Submit</UButton>
        </UForm>
    </div>
</template>

<script setup lang="ts">

const currentLobby = useCookie<string | undefined>('lobby')

const route = useRoute()

const state = reactive({
    playerName: "",
    inviteCode: "",
})
const emit = defineEmits(['join'])

const join = () => {
  emit('join', {
    playerName: state.playerName,
    inviteCode: state.inviteCode,
  })
}

onMounted(() => {
    if (route.query.invite) {
        state.inviteCode = route.query.invite as string
    }
})

</script>
