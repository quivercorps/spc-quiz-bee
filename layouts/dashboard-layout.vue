<template>
    <div class="lg:w-1/2 xl:w-1/3 mx-auto">
        <NavBar :pageName="pageName" :username="user!.userName" :items="items"></NavBar>
        <div class="p-3">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/chat.interface';

const router = useRouter()
const {getSession, unsetSession} = useSession()
const session = getSession()

const pageNames = router.currentRoute.value.name!.toString().split('-')
const pageName = pageNames[pageNames.length - 1]

const {data: user} = await useAPI<User>('users/profile', {
    headers: {
        Authorization: `Bearer ${session!}`
    }
})

if (!user.value) {
    
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found'
  })
}

const items = [
    [{
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth-solid',
    }],
    [{
        label: 'Logout',
        icon: 'i-heroicons-arrow-left-end-on-rectangle-solid',
        click: async () => {
            unsetSession()
            await navigateTo('/')
        }
    }]
]


watchEffect(() => {
    if (!session) {
        navigateTo('/')
    }
})
</script>
