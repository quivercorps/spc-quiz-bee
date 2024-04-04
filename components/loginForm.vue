<template>
    <div>
        <UForm :state="state" @submit="login">
            <UFormGroup label="Name" name="userName">
                <UInput v-model="state.userName"></UInput>
            </UFormGroup>
            
            <UFormGroup label="Lobby Name" name="lobbyName">
                <UInput v-model="state.inviteCode"></UInput>
            </UFormGroup>

            <UButton type="submit">Submit</UButton>
        </UForm>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    disableNewLobby: {
        type: Boolean,
        required: true,
    },
    defaultUser: {
        type: String,
        default: null
    }
})

const state = reactive({
    userName: "",
    inviteCode: "",
})
const emit = defineEmits(['login'])

const login = () => {
  emit('login', {
    userName: state.userName,
    inviteCode: state.inviteCode,
  })
}

</script>
