<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el, { cancel: '.not_move' })

const el2 = ref<HTMLElement | null>(null)

let disabled = false

const { style: style2, setState } = useDraggable(el2, { disabled })

function toggleDisabled() {
  disabled = !disabled
  setState({ disabled })
}
</script>

<template>
  <div ref="el" :style="style">
    <Wrapper>
      cancel
      <div class="not_move">
        can't move here
      </div>
    </Wrapper>
  </div>

  <div ref="el2" :style="style2">
    <Wrapper>
      disabled
    </Wrapper>
  </div>
  <button @click="toggleDisabled">
    toggleDisabled : {{ disabled }}
  </button>
</template>
