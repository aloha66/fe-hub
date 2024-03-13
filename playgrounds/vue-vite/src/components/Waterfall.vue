<script setup lang="ts">
import { computed, nextTick, onBeforeUpdate, ref, watch } from 'vue'

interface WaterfallItem {
  src: string
  offsetHeight?: number
  height?: number
}

interface WaterfallProps {
  /**
   * 列数量
   */
  colCount: number
  data: WaterfallItem[]
}

const props = defineProps<WaterfallProps>()

function useLayout(props) {
  const isMobile = true
  const width = computed(() => {
    return props.width ? props.width : document.body.clientWidth / 2
  })

  const colCount = computed(() => {
    if (props.colCount)
      return props.colCount
    if (isMobile)
      return 2

    // n * width + (n - 1) * gap <= bodyWidth - margin * 2
    return ~~(
      (document.body.offsetWidth - 32 + props.gap)
      / (width.value + props.gap)
    )
  })

  const styles = computed(() => {
    return {
      gap: `${props.gap}px`,
      width: isMobile ? 'unset' : `${width.value}px`,
      // width: width.value + 'px',
    }
  })

  return {
    styles,
    colCount,
  }
}

function useRefEl() {
  const refList = ref<any[]>([])
  const setRefList = (el: any) => {
    el && refList.value.push(el)
  }

  // make sure to reset the refs before each update
  onBeforeUpdate(() => {
    refList.value = []
  })

  return [refList, setRefList] as const
}

const list = ref<any[]>([])

const [elList, setElList] = useRefEl()

const { styles } = useLayout(props)

function getMinhIndex(): Promise<number> {
  return new Promise((resolve) => {
    nextTick(() => {
      const heightArr = elList.value.map((item) => {
        return item.offsetHeight
      })

      const min = Math.min(...heightArr)
      resolve(heightArr.indexOf(min))
    })
  })
}

const renderIndex = ref(0)
watch(renderIndex, () => {
  requestAnimationFrame(generateWaterfallDataForFlex)
})

generateWaterfallDataForFlex()

async function generateWaterfallDataForFlex() {
  const col = props.colCount
  const data = props.data
  const minIndex = await getMinhIndex()

  if (minIndex === -1) {
    for (let n = 0; n < col; n++)
      list.value[n] = [data[n]]
    renderIndex.value = col
  }
  else {
    const _data = data[renderIndex.value]
    list.value[minIndex].push(_data)

    if (renderIndex.value < data.length - 1)
      renderIndex.value++
  }
}
</script>

<template>
  <div class="flex">
    <div v-for="(outer, i) in list" :key="i" :ref="setElList" class="column">
      <div v-for="(inner, k) in outer" :key="k" class="column-item">
        <slot v-bind="inner" />
      </div>
    </div>
    <!-- <template slot="merge-col">
    </template> -->
    <slot name="merge-col" />
    <!-- 合并内容...     -->
    <!-- <button style="position: fixed; bottom: 0" @click="loadMore">
      加载更多
    </button> -->
  </div>
</template>

<style scoped>
.flex {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
}

.column {
  flex: 1;
  padding: 2.5px;
}

.column-item {
/* width: 100%; */
  padding: v-bind('styles.gap');
  /* width: v-bind('styles.width'); */
}

/* @media screen and (max-width: 700px) {
  .flex {
    padding: 12px v-bind('styles.gap');
  }
} */
</style>
