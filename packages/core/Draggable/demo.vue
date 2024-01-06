<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { StateChangeOptions } from './Draggable'
import { Draggable } from './Draggable'

const style = ref()

const dc = new Draggable({
  /**
   * TODO 防止拖拽元素更改父节点？
   */
  offsetParent: document.body,
})
const node = ref(null)

onMounted(() => {
  dc.setElement(node.value)
  dc.onStateChange(({ newStyle }: StateChangeOptions) => {
    style.value = newStyle
  })
})
</script>

<template>
  <!-- <Teleport to="body"> -->
  <div class="test">
    <div ref="node" class="box" :style="style">
      Draggable   test
    </div>
  </div>
  <!-- </Teleport> -->
</template>

<style>
.test {

}
.box {
  /* position: absolute; */
  width: 200px;
  height: 50px;
  border: 1px solid #000;
  left: 0;
  top: 0;
}
</style>
