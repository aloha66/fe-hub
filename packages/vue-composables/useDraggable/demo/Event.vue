<!-- eslint-disable no-console -->
<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el, {
  onStart(data, e) {
    console.log('onStart', data, e)
  },
  onDrag(data, e) {
    console.log('onDrag', data, e)
  },
  onStop(data, e) {
    console.log('onStop', data, e)
  },
  onMouseDown(e) {
    console.log('onMouseDown', e)
  },
})
</script>

<template>
  <div ref="el" :style="style">
    <Wrapper>
      open console
    </Wrapper>
  </div>
</template>
