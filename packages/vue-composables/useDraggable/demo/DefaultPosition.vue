<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el, { defaultPosition: { x: 25, y: 25 } })
</script>

<template>
  <div ref="el" :style="style">
    <Wrapper>
      defaultPosition { x: 25, y: 25 }
    </Wrapper>
  </div>
</template>
