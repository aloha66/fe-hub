<script setup lang="ts">
import { DAY, HOUR, MINUTE, SECOND } from '@fe-hub/shared'
import { useCountDown } from '..'

const second = useCountDown({ relativeTime: 10 * SECOND })

const minuts = useCountDown({ relativeTime: 10 * MINUTE })
const hour = useCountDown({ relativeTime: 10 * HOUR })
const day = useCountDown({ relativeTime: 10 * DAY })
</script>

<template>
  <div>秒{{ second }}</div>
  <div>分钟{{ minuts }}</div>
  <div>小时{{ hour }}</div>
  <div>日{{ day }}</div>
</template>
