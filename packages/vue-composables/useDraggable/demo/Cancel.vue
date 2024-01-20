<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const { style: styleX } = useDraggable(el, { cancel: '.not_move' })
</script>

<template>
  <div ref="el" :style="styleX">
    <Wrapper>
      cancel
      <div class="not_move">can't move here</div>
    </Wrapper>
  </div>
</template>
