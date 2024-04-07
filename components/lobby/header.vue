<template>
    <p v-if="props.isConnected">
        connected
    </p>
    <p v-else>
        not connected
    </p>
    <p>{{ props.lobbyName }}</p>
    <UButton @click="$emit('handle-players-click')">
        {{ props.players.length }}
    </UButton>
    <UButton @click="$emit('handle-leave-lobby')">
        leave
    </UButton>
</template>

<script setup lang="ts">
import type { Player } from '~/types/chat.interface';

const props = defineProps({
    isConnected: {
        type: Boolean,
        required: true
    },
    players: {
        type: Array as PropType<Player[]>,
        required: true
    },
    lobbyName: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['handle-players-click', 'handle-leave-lobby'])
</script>
