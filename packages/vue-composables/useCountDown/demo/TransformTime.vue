<script setup lang="ts">
import { useCountDown } from '..'

const abslouteTime = useCountDown({ abslouteTime: `${new Date().getFullYear()}-12-31 23:59:59` })

const d1 = useCountDown({ aliasTime: '1d' })
const h2 = useCountDown({ aliasTime: '2h' })
const m3 = useCountDown({ aliasTime: '3M' })
const y4 = useCountDown({ aliasTime: '4y' })
const m5 = useCountDown({ aliasTime: '5m' })
const s15 = useCountDown({ aliasTime: '150s' })
</script>

<template>
  <h3>abslouteTime</h3>
  <div>{{ abslouteTime }}</div>
  <h3>aliasTime</h3>
  <div>一天:{{ d1 }}</div>
  <div>两小时{{ h2 }}</div>
  <div>三个月{{ m3 }}</div>
  <div>4年{{ y4 }}</div>
  <div>5分钟{{ m5 }}</div>
  <div>150秒{{ s15 }}</div>
</template>
