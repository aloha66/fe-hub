<script setup lang="ts">
import { useCountDown } from '..'

const { count, start, pause, stop } = useCountDown({ relativeTime: 10 * 1000, millisecond: true, controls: true })

const { count: count1, start: start1, pause: pause1, stop: stop1 } = useCountDown({ relativeTime: 10 * 1000, isIncrement: true, millisecond: true, controls: true })
</script>

<template>
  <div>毫秒{{ count }}</div>
  <div flex gap8>
    <button @click="start">
      开始
    </button>
    <button @click="pause">
      暂停
    </button>
    <button @click="() => stop()">
      结束
    </button>
  </div>

  <div>增毫秒{{ count1 }}</div>
  <div flex gap8>
    <button @click="start1">
      开始
    </button>
    <button @click="pause1">
      暂停
    </button>
    <button @click="() => stop1()">
      结束
    </button>
  </div>
</template>
