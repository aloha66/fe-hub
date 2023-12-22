---
layout: home
sidebar: false

hero:
  name: fe-tool
  text: Collection of Vue Composition Utilities
  tagline: Collection of Essential Vue Composition Utilities
  image:
    src: /favicon.svg
    alt: VueUse
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: Functions
      link: /functions
    - theme: alt
      text: Add-ons
      link: /add-ons
    - theme: alt
      text: View on GitHub
      link: https://github.com/vueuse/vueuse

features:
  - title: Core
    details: pure typescript logic
    icon: 🎛
  - title: Vue Composables
    details: Works for Vue 3
    icon: 🚀
  - title: React hooks
    details: Only take what you want
    icon: ⚡
  - title: Type Strong
    details: Written in TypeScript, with full TS docs
    icon: 🦾
  - title: Vue Component
    details: Passing refs as arguments, fully customizable, configurable event filters and targets
    icon: 🛠
  - title: No bundler required
    details: Usable via CDN, without any bundlers
    icon: ☁️
  - title: SSR Friendly
    details: Works perfectly with server-side rendering/generation
    icon: 🔋
  - title: Interactive demos
    details: Documentation of functions also come with interactive demos!
    icon: 🎪
  - title: Add-ons
    details: Support various add-ons like Router, Firebase, RxJS, etc.
    icon: 🔌
---

<Home />

## 坑
1. 开发模式刷新上了h2和协商缓存，首屏速度跟没上一样7-8s
2. 同名（不同后缀）文件相互引用，刷新后路径打开的是源文件（不是md）
  - useDraggableCore.ts(被其他文件引用) 和 useDraggableCore.md（引用了其他文件）
  - 解决方案：文件分层级 doc
