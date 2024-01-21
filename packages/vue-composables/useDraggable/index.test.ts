import { describe, expect, it } from 'vitest'
import { onMounted, ref } from 'vue'
import { useSetup } from '../test/help'
import { useDraggable } from '.'

describe('useDraggable', () => {
  it('should has style when init', () => {
    useSetup(() => {
      const el = ref<HTMLElement | null>(document.createElement('div'))
      const { style } = useDraggable(el)
      onMounted(() => {
        expect(style.value).toMatchInlineSnapshot(`
          {
            "transform": "translate(0px,0px)",
          }
        `)
      })
    })
  })

  it('should has style when defaultPosition seted', () => {
    useSetup(() => {
      const el = ref<HTMLElement | null>(document.createElement('div'))
      const { style } = useDraggable(el, { defaultPosition: { x: 25, y: 25 } })
      onMounted(() => {
        expect(style.value).toMatchInlineSnapshot(`
          {
            "transform": "translate(25px,25px)",
          }
        `)
      })
    })
  })
})
