<template>
    <div class="svg-icon" :class="`svg-icon--${props.name}`">
        <svg>
            <use :xlink:href="`#${props.name}`" />
        </svg>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    name: string
}>()
</script>

<style lang="scss">
.svg-icon {
    width: 24px;
    height: 24px;
    display: inline-block;
    color: currentColor;

    svg {
        width: inherit;
        height: inherit;
        display: block;
        fill: currentColor;
    }

    &--stroke {
        fill: none;
        stroke: currentColor;
    }

    &--nofill {
       fill: none;
       stroke: none; 
    }
}
</style>