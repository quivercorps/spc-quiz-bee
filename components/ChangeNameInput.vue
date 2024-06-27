<template>
    <UInput @change="changeName" size="lg" :variant="variant" v-model="editableName" :placeholder="placeholder" />
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

const { name } = toRefs(props)

// Create a writable ref for name
const editableName = ref(name.value)

// Watch for changes to synchronize
watch(name, (newName) => {
    editableName.value = newName
})

const emit = defineEmits(['change-category-name'])

function changeName() {
    if (!editableName.value) {
        editableName.value = name.value
        return
    }

    emit('change-category-name', editableName.value, props.index)
}
</script>