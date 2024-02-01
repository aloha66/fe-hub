<script setup lang="ts">
import { useCountDown } from '..'

const { count, run, pause, stop } = useCountDown({ leftTime: 10 * 1000 })
</script>

<template>
  <div>毫秒{{ count }}</div>
  <div flex gap8>
    <button @click="run">
      开始
    </button>
    <button @click="pause">
      暂停
    </button>
    <button @click="stop">
      结束
    </button>
  </div>
</template>
