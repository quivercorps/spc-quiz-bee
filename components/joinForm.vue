<template>
    <div>
        <UForm :state="state" @submit="join">
            <UFormGroup label="Display Name" name="userName">
                <UInput v-model="state.userName" required></UInput>
            </UFormGroup>
            
            <UFormGroup label="Invite Code" name="lobbyName">
                <UInput v-model="state.inviteCode" required></UInput>
            </UFormGroup>
            <UButton class="w-full flex justify-center mt-3" type="submit">Submit</UButton>
        </UForm>
    </div>
</template>

<script setup lang="ts">

const state = reactive({
    userName: "",
    inviteCode: "",
})
const emit = defineEmits(['join'])

const join = () => {
  emit('join', {
    userName: state.userName,
    inviteCode: state.inviteCode,
  })
}

</script>
