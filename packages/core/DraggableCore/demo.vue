<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DraggableCore } from '.'

const position = ref({ x: 0, y: 0 })

const style = computed(() => {
  return {
    transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
  }
})

const dc = new DraggableCore({
  onStart(data) {
    position.value = {
      x: data.x,
      y: data.y,
    }
  },
  onDrag( data) {
    // console.log('data',data);

    position.value = {
      x: data.x,
      y: data.y,
    }
  },
  onStop(data) {
    position.value = {
      x: data.x,
      y: data.y,
    }
  },
})
const node = ref(null)

onMounted(() => {
  dc.setElement(node.value)
})
</script>

<template>
  <!-- <Teleport to="body"> -->
  <div class="test">
    <div ref="node" class="box" :style="style">
      test
    </div>
  </div>
  <!-- </Teleport> -->


</template>

<style>
.test {

}
.box {
  /* position: absolute; */
  width: 50px;
  height: 50px;
  border: 1px solid #000;
  left: 0;
  top: 0;
}
</style>
