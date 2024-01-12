## 坑

1. 开发模式刷新，上了h2和协商缓存，首屏速度跟没上一样7-8s（重启电脑之后？？表现正常了，1-2s）
   现在又不正常了 6s
   无论是强缓存还是协商缓存，也许都存在Content Download的行为
   https://gvo1dzy82xj.feishu.cn/docx/Q6eJdnvpDoS1xmxybqxc0LxEnqf
2. 同名（不同后缀）文件相互引用，刷新后路径打开的是源文件（不是md）

- useDraggableCore.ts(被其他文件引用) 和 useDraggableCore.md（引用了其他文件）
- 解决方案：文件分层级 doc
- 访问路径后面不用加index亦可解决

3. 为了更简单的自动化处理，还是按照xx/index.ts的写法（不在项目结构做分层）
4. ESLint v8.56.0在webstorm有bug，退回v8.55.0

- reportUnusedDisableDirectives - Invalid Options
- https://github.com/antfu/eslint-config/issues/368
- https://github.com/eslint/eslint/pull/17867#issuecomment-1863582496
