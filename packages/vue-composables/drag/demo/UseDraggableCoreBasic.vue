<script setup lang="ts">
import { ref } from 'vue'
import { useDraggableCore } from '..'

const el = ref<HTMLElement | null>(null)

useDraggableCore(el)
</script>

<template>
  <div>
    <div ref="el">
      拖拽
    </div>
  </div>
</template>
