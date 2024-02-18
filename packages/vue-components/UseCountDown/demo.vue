<!-- eslint-disable no-console -->
<script setup lang="ts">
import { ref } from 'vue'
import { UseCountDown } from './index'

// const abslouteTime = `${new Date().getFullYear()}-12-31 23:59:59`

const time = ref(15000)
</script>

<template>
  <UseCountDown v-slot="{ count, current: { seconds } }" :relative-time="time">
    {{ count }}
    {{ seconds }}
    <!-- <div>{{ current }}</div> -->
    <!-- <div>{{ current.seconds }}</div> -->
  </UseCountDown>
  <button @click="time = 60000">
    change
  </button>
</template>
