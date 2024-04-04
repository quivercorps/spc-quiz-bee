<template>
    <UCard>
        <template #header>
            Join Existing Lobbies
        </template>
        <div v-if="!isLoading && !isDelay">
            <UButton v-for="(lobby, index) in props.lobbies" :key="index" @click="$emit('select-lobby', lobby.name)">{{ lobby.name }}</UButton>
        </div>
        <div v-else>
            <USkeleton class="h-12 w-full" />
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { Lobby } from '~/types/chat.interface';


const props = defineProps({
    lobbies: {
        type: Array as PropType<Lobby[]>,
        required: true,
    },
    selectedLobby: {
        type: String,
        default: ''
    },
    isLoading: {
        type: Boolean,
        required: true,
    },
})

const emit = defineEmits(['select-lobby'])

const isDelay = ref(true)

onMounted(() => {
    const delayTimer = setTimeout(() => {
        isDelay.value = false
    }, 1000)

    onUnmounted(() => {
        clearTimeout(delayTimer)
    })
})

</script>
