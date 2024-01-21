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

const el3 = ref<HTMLElement | null>(null)

const { style: style3 } = useDraggable(el3, { handle: 'strong' })
</script>

<template>
  <div flex>
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

    <div ref="el3" :style="style3">
      <Wrapper>
        <strong><div>Drag here</div></strong>
        <div>You must click my handle to drag me</div>
      </Wrapper>
    </div>
  </div>

  <button @click="toggleDisabled">
    toggleDisabled : {{ disabled }}
  </button>
</template>
