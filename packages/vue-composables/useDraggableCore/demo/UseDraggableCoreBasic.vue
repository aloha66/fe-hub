<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDraggableCore } from '..'

const el = ref<HTMLElement | null>(null)

const position = ref({ x: 0, y: 0 })

useDraggableCore(el, {
  onStart: (data) => {
    position.value = data
  },
  onDrag: (data) => {
    position.value = data
  },
  onStop: (data) => {
    position.value = data
  },
})

const style = computed(() => {
  return {
    transform: `translate(${position.value.x}px, ${position.value.y}px)`,
  }
})
</script>

<template>
  <div>
    <div ref="el" :style="style">
      拖拽
    </div>
  </div>
</template>
