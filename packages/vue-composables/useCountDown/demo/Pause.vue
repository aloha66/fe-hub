<script setup lang="ts">
import { useCountDown } from '..'

const { count, run, pause, stop } = useCountDown({ leftTime: 10 * 1000 })

const { count: count1, run: run1, pause: pause1, stop: stop1 } = useCountDown({ leftTime: 10 * 1000, isIncrement: true })
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

  <div>增毫秒{{ count1 }}</div>
  <div flex gap8>
    <button @click="run1">
      开始
    </button>
    <button @click="pause1">
      暂停
    </button>
    <button @click="stop1">
      结束
    </button>
  </div>
</template>
