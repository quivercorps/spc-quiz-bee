<template>
    <div class="container lg:w-1/2">
        <slot />
    </div>
</template>

<style>
.container {
    @apply mx-auto p-5 lg:p-0 lg:pt-5;
}
</style>