<template>
    <div class="flex flex-col gap-3">
        <UFormGroup label="Category Name">
            <UInput @change="changeName" size="lg" :variant="variant" v-model="editableName" :placeholder="placeholder" />
        </UFormGroup>

        <UFormGroup label="Timer for Each Question">
            <UInput type="number" min="0" @change="changeName" size="lg" :variant="variant" v-model="editableTimer" :placeholder="placeholder">
                <template #trailing>
                    <span class="text-gray-500 dark:text-gray-400 text-xs">SEC</span>
                </template>
            </UInput>
        </UFormGroup>

        <UFormGroup label="Score for Each Question">
            <UInput type="number" min="1" @change="changeName" size="lg" :variant="variant" v-model="editableScore" :placeholder="placeholder" />
        </UFormGroup>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    timer: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
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

const { timer } = toRefs(props)

// Create a writable ref for name
const editableTimer = ref(timer.value)

// Watch for changes to synchronize
watch(timer, (newName) => {
    timer.value = newName
})

const { score } = toRefs(props)

// Create a writable ref for name
const editableScore = ref(score.value)

// Watch for changes to synchronize
watch(score, (newName) => {
    editableScore.value = newName
})


const emit = defineEmits(['change-category-name'])

function changeName() {
    if (!editableName.value) {
        editableName.value = name.value
        return
    }

    if (editableScore.value < 1) {
        editableScore.value = score.value
        return
    }

    if (editableTimer.value < 0) {
        editableTimer.value = timer.value
        return
    }

    emit('change-category-name', props._id, editableName.value, editableScore.value, editableTimer.value, props.index)
}
</script>