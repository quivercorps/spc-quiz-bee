<template>
    <div class="flex h-screen">
        <div class="m-auto">
            <UForm :state="loginState" @submit="loginUser">
                <UFormGroup label="Email" name="email">
                    <UInput v-model="loginState.email"></UInput>
                </UFormGroup>
                
                <UFormGroup label="Password" name="password">
                    <UInput type="password" v-model="loginState.password"></UInput>
                </UFormGroup>

                <UButton type="submit">Submit</UButton>
            </UForm>
        </div>
    </div>
    
</template>

<script setup lang="ts">

const { $api } = useNuxtApp()
const router = useRouter()
const {unsetSession, setSession, getSession} = useSession()
const session = getSession()

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
        await navigateTo('/dashboard/')
    } catch (error) {
        console.error('Login Error:', error)
    }
}

watchEffect(() => {
    if (session) {
        navigateTo('/dashboard/')
    }
})

</script>