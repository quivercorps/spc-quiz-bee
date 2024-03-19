<template>
    <div>
        <UButton to="/quiz/create">Create Quiz</UButton>
        <UButton @click="fetchData">Check</UButton>
        <div v-if="helloMessage">{{ helloMessage }}</div>
    </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const helloMessage = ref()

const fetchData = async () => {
    if (!helloMessage.value) {
        const data = await $api<string>('/')

        helloMessage.value = data
    }    
}
</script>
