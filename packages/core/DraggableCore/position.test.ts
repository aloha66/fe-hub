import { describe, expect, it } from 'vitest'
import { createCoreData, snapToGrid } from './position'

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

  describe('grid', () => {
    it('should move inner grid', () => {
      expect(snapToGrid([10, 10], 1, 5)).toMatchInlineSnapshot(`
        [
          0,
          10,
        ]
      `)

      expect(snapToGrid([10, 10], 5, 5)).toMatchInlineSnapshot(`
        [
          10,
          10,
        ]
      `)

      expect(snapToGrid([10, 10], -1, 0)).toMatchInlineSnapshot(`
        [
          -0,
          0,
        ]
      `)

      expect(snapToGrid([25, 25], 11, 5)).toMatchInlineSnapshot(`
        [
          0,
          0,
        ]
      `)

      expect(snapToGrid([50, 50], 10, 10)).toMatchInlineSnapshot(`
      [
        0,
        0,
      ]
    `)

      expect(snapToGrid([50, 50], 50, 50)).toMatchInlineSnapshot(`
        [
          50,
          50,
        ]
      `)

      expect(snapToGrid([50, 50], 51, 51)).toMatchInlineSnapshot(`
      [
        50,
        50,
      ]
    `)
    })
  })
})
