<template>
    <div class="px-3 lg:px-0 lg:w-1/2 xl:w-1/3 mx-auto pb-10">
        <div class="flex justify-between items-center mt-5">
            <div class="flex gap-1 items-center">
                <UButton @click="navigateTo('/')" variant="ghost" icon="i-heroicons-home"></UButton>
                <p class="text-xl">Lobbies</p>
            </div>
            <UButton @click="refreshLobbies" icon="i-heroicons-arrow-path" trailing>Refresh List</UButton>
        </div>
        <div v-if="!pendingLobbies" class="flex flex-col gap-3 mt-5">
            <div class="flex flex-col items-center" v-if="lobbies?.length == 0">
                <p>No Results...</p>
            </div>
            <UCard v-else v-for="lobby in lobbies">
                <template #header>
                    <div class="flex justify-between items-center">
                        <p>{{ lobby.quiz.name }}</p>

                        <p class="capitalize text-gray-500 dark:text-gray-400">Status: <span :class="lobby.lobbyStatus === 'ongoing' ? 'text-green-500 dark:text-green-400' : ''">{{ lobby.lobbyStatus }}</span></p>
                    </div>
                </template>
                <div class="flex justify-between items-center">
                    <div class="text-gray-500 dark:text-gray-400">
                        <p>Players: {{ lobby.players.length || 0 }}</p>
                    </div>
                    <UButton @click="navigateTo(`/game/${lobby.code}/leaderboard`)" size="xl" :icon="lobby.lobbyStatus === 'ongoing' ? 'i-heroicons-tv' : 'i-heroicons-clipboard-document-list'" trailing>View</UButton>
                </div>
            </UCard>
        </div>
        <div v-else class="flex flex-col items-center gap-3 mt-5">
            <p>Fetching Lobbies</p>
            <UIcon class="animate-spin h-6 w-6" name="i-heroicons-arrow-path"></UIcon>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Lobby } from '~/types/chat.interface';

const {data: lobbies, pending: pendingLobbies, refresh: refreshLobbies} = await useAPI<Lobby[]>('lobby')

</script>