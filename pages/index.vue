<template>
    <div>
        <UButton to="/quiz/create">Create Quiz</UButton>
        {{ helloMessage }}
    </div>
</template>

<script setup lang="ts">
const { data: helloMessage, pending, error } = await useFetch<string>('/', {
  baseURL: 'http://localhost:3001',
});
</script>
