<!-- eslint-disable no-console -->
<script setup lang="ts">
import { h, ref } from 'vue'
import type { Axis } from '@fe-hub/core'
import { UseDraggable } from './index'

const axis = ref<Axis>('both')

const Com = h('div', ['被UseDraggable包裹', h('span', '的组件')])

function drag(data: any, e: any) {
  console.log('data:', data, e)
}

function stop(data: any, e: any) {
  console.log('stop', data, e)
}
</script>

<template>
  <UseDraggable class="box" @drag="drag">
    <Com />
  </UseDraggable>
  <UseDraggable :axis="axis" @stop="stop">
    <div class="box">
      <div flex justify-evenly gap1>
        <button @click="axis = 'both'">
          both
        </button>
        <button @click="axis = 'x'">
          x
        </button>
        <button @click="axis = 'y'">
          y
        </button>
      </div>
      有最外层div包裹的组件，会复用div
    </div>
  </UseDraggable>

  <UseDraggable class="box">
    <div class="test">
      eee
    </div>
    没有最外层div会加一层div
  </UseDraggable>
</template>

<style scoped>
.box {
    width: 200px;
    height: 200px;
    border: 1px solid #000;
}
</style>
