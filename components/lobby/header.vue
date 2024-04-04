<template>
    <p v-if="props.isConnected">
        connected
    </p>
    <p v-else>
        not connected
    </p>
    <p>{{ props.lobbyName }}</p>
    <UButton @click="$emit('handle-users-click')">
        {{ props.users.length }}
    </UButton>
    <UButton @click="$emit('handle-leave-lobby')">
        leave
    </UButton>
</template>

<script setup lang="ts">
import type { User } from '~/types/chat.interface';

const props = defineProps({
    isConnected: {
        type: Boolean,
        required: true
    },
    users: {
        type: Array as PropType<User[]>,
        required: true
    },
    lobbyName: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['handle-users-click', 'handle-leave-lobby'])
</script>
