<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const { style: styleX } = useDraggable(el, { axis: 'x' })

const elY = ref<HTMLElement | null>(null)

const { style: styleY } = useDraggable(elY, { axis: 'y' })
</script>

<template>
  <div ref="el" :style="styleX">
    <Wrapper>
      axisX
    </Wrapper>
  </div>

  <div ref="elY" :style="styleY">
    <Wrapper>
      axisY
    </Wrapper>
  </div>
</template>
