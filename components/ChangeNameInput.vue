<template>
    <UInput @change="changeName" size="lg" :variant="variant" v-model="name" :placeholder="placeholder" />
</template>

<script setup lang="ts">

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    variant: {
        type: String,
        default: 'outline'
    },
    index: {
        type: Number,
        required: true
    },
    placeholder: {
        type:String,
        default: "Type Something..."
    }
})

const name = ref(props.name)

const emit = defineEmits(['change-category-name', 'change-category-name-update'])

function changeName() {
    if (!name.value) { 
        name.value = props.name
        return
    }

    emit('change-category-name', name.value, props.index)
}
</script>