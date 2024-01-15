
<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el)

</script>

<template>

<div>
    <div ref="el" className="box" :style="style">
      offsetParent
      </div>

</div>

</template>

<style>
   .box {
    position: relative;
      background: #fff;
      border: 1px solid #999;
      border-radius: 3px;
      width: 180px;
      height: 180px;
      /* aspect-ratio: 1/1; */
      margin: 10px;
      float: left;
      overflow: auto;
       padding: 0
    }


</style>

