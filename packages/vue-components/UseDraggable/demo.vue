<script setup lang="ts">
import { UseDraggable } from './index'
</script>

<template>
  <UseDraggable>
    <div style="border: 1px solid;position: absolute;width: 100px;">
      <div class="test">
        eee
      </div>
      有div包裹的
    </div>
  </UseDraggable>

  <UseDraggable style="border: 1px solid;position: absolute;width: 100px;">
    <div class="test">
      eee
    </div>
    分离的多个子元素
  </UseDraggable>
</template>

<style>
.box {
    width: 200px;
    height: 50px;
    border: 1px solid #000;
}
</style>
