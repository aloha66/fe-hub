<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ float?: boolean }>()

const float = computed(() => {
  return props.float ? 'left' : 'unset'
})
</script>

<template>
  <div class="box">
    <slot />
  </div>
</template>

<style scoped>
   .box {
    position: relative;
      background: #fff;
      border: 1px solid #999;
      border-radius: 3px;
      width: 180px;
      height: 180px;
      margin: 10px;
      float: left;
      float: v-bind(float);
      overflow: auto;
       padding: 10px
    }
</style>
