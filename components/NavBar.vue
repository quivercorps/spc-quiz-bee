<template>
    <div class="bg-white dark:bg-transparent p-3 flex justify-between items-center border-b dark:border-gray-500">
        <div class="flex items-center gap-2">
            <UButton v-if="isBackToDashboard" @click="navigateTo('/dashboard')" variant="ghost" icon="i-heroicons-arrow-uturn-left"></UButton>
            <UButton v-else @click="navigateTo('/')" variant="ghost" icon="i-heroicons-home"></UButton>
            
            <div @click="enableEdit" v-if="!isEditting" :class="!isEdit ? '' : 'cursor-pointer'" class="flex items-center gap-2">
                <p class="capitalize select-none">{{ pageName }}</p>
                <UIcon v-if="isEdit" name="i-heroicons-pencil-square" class="w-5 h-5"></UIcon>
            </div>
            
            <div v-else >
                <form @submit="submitPageName" class="flex items-center gap-2">
                    <UInput v-model="name" required/>
                    <UButton type="submit" icon="i-heroicons-check"></UButton>
                </form>
            </div>
        </div>

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
    },
    isBackToDashboard: {
        type: Boolean,
        default: false
    }
})

const isEditting = ref(false)
const name = ref(props.pageName)

const emit = defineEmits(['change-page-name'])

function enableEdit() {
    if (!props.isEdit) return
    isEditting.value = true
}

function submitPageName(e: Event) {
    e.preventDefault()
    if (!props.isEdit) return

    isEditting.value = false
    if (name.value != props.pageName) emit('change-page-name', name.value)
}
</script>
