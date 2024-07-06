<script lang="ts" setup>
import QRCodeVue3 from "qr-code-generator-vue3";

const config = useRuntimeConfig()

const props = defineProps<{
    value: string;
}>();

// <!-- #005301 -->
// <!-- #fbea01 -->

const dotsOptions = {
    type: 'square',
    color: '#005301'
}
</script>

<template>
    <div>
        <QRCodeVue3 :value="`${config.public.appUrl}?invite=${props.value}`" :dots-options="dotsOptions" />
        <input type="text" class="p-2 w-full rounded" :value="`${config.public.appUrl}?invite=${props.value}`" disabled>
    </div>
    
</template>