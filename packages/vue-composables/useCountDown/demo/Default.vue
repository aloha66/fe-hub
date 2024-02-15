<script setup lang="ts">
import { DAY, HOUR, MINUTE, SECOND } from '@fe-hub/shared'
import { useCountDown } from '..'

const second = useCountDown({ leftTime: 10 * SECOND })

const minuts = useCountDown({ leftTime: 10 * MINUTE })
const hour = useCountDown({ leftTime: 10 * HOUR })
const day = useCountDown({ leftTime: 10 * DAY })
</script>

<template>
  <div>秒{{ second }}</div>
  <div>分钟{{ minuts }}</div>
  <div>小时{{ hour }}</div>
  <div>日{{ day }}</div>
</template>
