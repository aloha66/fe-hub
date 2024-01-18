<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el, { bounds: { top: -100, left: -100, right: 100, bottom: 100 } })
</script>

<template>
  <div ref="el" :style="style">
    <Wrapper>
      I can only be moved within my offsetParent.
    </Wrapper>
  </div>
<!--
  <div className="box1" relative m10 h500 w500 p0>
    <div h1000 w1000 p10>
      <div ref="el" :style="style">
        <Wrapper>
          I can only be moved within my offsetParent.
        </Wrapper>
      </div>
    </div>
  </div> -->
</template>

<style scoped>
.box1 {
      background: #fff;
      border: 1px solid #999;
      border-radius: 3px;
      /* aspect-ratio: 1/1; */
      overflow: auto;
    }
</style>
