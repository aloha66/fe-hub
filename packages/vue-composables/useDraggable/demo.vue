<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el)
</script>

<template>
  <div ref="el" class="box" :style="style">
    ttt
  </div>
</template>

<style>
.box {
    width: 200px;
    height: 50px;
    border: 1px solid #000;
}
</style>
