<template>
    <div class="p-3 flex justify-between items-center border-b border-gray-500">
        <p v-if="!isEdit" class="capitalize select-none">{{ pageName }}</p>
        <UDropdown :items="props.items" :popper="{placement: 'bottom-end'}">
            <UButton
            :label="props.username"
            color="white"
            variant="ghost">
                <template #trailing>
                    <UIcon name="i-heroicons-chevron-down-20-solid"></UIcon>
                </template>
            </UButton>
        </UDropdown>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    pageName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    isEdit: {
        type: Boolean,
        default: false
    }
})
</script>
