<script lang="ts" setup>
import { sku } from '../mock/mogu'
import Waterfall from '../components/Waterfall.vue'
</script>

<template>
  <Waterfall :col-count="3" :data="sku">
    <template #default="inner">
      <!-- <div> -->
      <!-- <img v-imgFixed="inner.src" v-lazy="inner.src" class="item" alt=""> -->
      <img :src="inner.src" class="item" alt="">

      <div class="title">
        {{ inner.title }}
      </div>
      <div>{{ inner.price }}</div>
      <!-- </div> -->
    </template>
  </Waterfall>
</template>

<style>
.item {
  width: 100%;
}

.title {
  word-break: break-all;
}
</style>
