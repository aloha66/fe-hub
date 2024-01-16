
<script setup lang="ts">
import {  ref, watchEffect } from 'vue'
import Wrapper from './Wrapper.vue'
import { useDraggable } from '..'

const el = ref<HTMLElement | null>(null)

const allowAnyClick = ref(false)


const { style,setState } = useDraggable(el,{allowAnyClick:allowAnyClick.value})


const toggle = () => {
  allowAnyClick.value = !allowAnyClick.value
  setState({
    allowAnyClick: allowAnyClick.value
  })
}



</script>

<template>
<div ref="el" :style="style">
  <Wrapper>
    AllowAnyClick
</Wrapper>
</div >

<button @click="toggle">{{ allowAnyClick ? '右键可拖动': '只能左键拖动' }}</button>
</template>



