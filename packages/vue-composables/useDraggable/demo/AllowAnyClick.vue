<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const allowAnyClick = ref(false)

const { style, setState } = useDraggable(el, { allowAnyClick: allowAnyClick.value })

function toggle() {
  allowAnyClick.value = !allowAnyClick.value
  setState({
    allowAnyClick: allowAnyClick.value,
  })
}
</script>

<template>
  <div ref="el" :style="style">
    <Wrapper>
      AllowAnyClick
    </Wrapper>
  </div>

  <button @click="toggle">
    {{ allowAnyClick ? '只能左键拖动' : '右键可拖动' }}
  </button>
</template>
