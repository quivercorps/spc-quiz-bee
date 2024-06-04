<template>
    <div class="flex items-center justify-between">
        <UInput
            icon="i-heroicons-magnifying-glass-20-solid"
            color="white"
            :trailing="false"
            placeholder="Search Quiz...">
        </UInput>
        <UButton label="Create New Quiz"></UButton>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard-layout'
})

const { $api } = useNuxtApp()
const {getSession, unsetSession} = useSession()
const session = getSession()
const router = useRouter()

const logout = async () => {
    unsetSession()
    await navigateTo('/')
}

watchEffect(() => {
    if (!session) {
        navigateTo('/')
    }
})
</script>
