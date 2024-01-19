<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el, { bounds: { top: -100, left: -100, right: 100, bottom: 100 } })

const el2 = ref<HTMLElement | null>(null)

const { style: style2 } = useDraggable(el2, { bounds: 'parent' })
</script>

<template>
  <div ref="el" :style="style">
    <Wrapper>
      I can only be moved 100px in any direction.
    </Wrapper>
  </div>

  <div className="box1" relative m10 h100 w100 p0>
    <div h200 w200 style="padding: 10px;">
      <div ref="el2" float-left :style="style2">
        <Wrapper>
          I can only be moved within my offsetParent.
        </Wrapper>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box1 {
  background: #fff;
      border: 1px solid #999;
      border-radius: 3px;
      margin: 10px;
      overflow: auto;
    }
</style>
