<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el, { grid: [50, 50] })
</script>

<template>
  <div ref="el" :style="style">
    <Wrapper>
      grid { x: 50, y: 50 }
    </Wrapper>
  </div>
</template>
