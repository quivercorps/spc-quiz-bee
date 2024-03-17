<template>
    <div>
        <UButton to="/quiz/create">Create Quiz</UButton>
        {{ helloMessage }}
    </div>
</template>

<script setup lang="ts">
const { data: helloMessage, pending, error } = await useMyFetch<string>('/');
</script>
