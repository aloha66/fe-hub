import { describe, expect, it } from 'vitest'
import { createCoreData } from './position'

describe('position', () => {
  it('should create CoreData with 37 0 61 144', () => {
    expect(createCoreData(37, 0, 61, 144)).toMatchInlineSnapshot(`
      {
        "deltaX": 24,
        "deltaY": 144,
        "lastX": 37,
        "lastY": 0,
        "x": 61,
        "y": 144,
      }
    `)
  })
})
