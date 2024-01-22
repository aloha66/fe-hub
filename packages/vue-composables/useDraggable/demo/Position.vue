<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '..'
import Wrapper from './Wrapper.vue'

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el, { position: { x: 25, y: 25 } })

const el2 = ref<HTMLElement | null>(null)

const { style: style2, setState } = useDraggable(el2, {
  position: { x: 25, y: 25 },
  onStop(data) {
    const { x, y } = data
    setState({ position: { x, y } })
  },
})

const el3 = ref<HTMLElement | null>(null)

const { style: style3 } = useDraggable(el3, { positionOffset: { x: '-10%', y: '-10%' } })
</script>

<template>
  <div flex>
    <div ref="el" :style="style">
      <Wrapper>
        受控组件 因为没有监听stop事件 拖动结束后位置不会更新
      </Wrapper>
    </div>

    <div ref="el2" :style="style2">
      <Wrapper>
        Position
      </Wrapper>
    </div>

    <div ref="el3" :style="style3">
      <Wrapper>
        positionOffset
      </Wrapper>
    </div>
  </div>
</template>
