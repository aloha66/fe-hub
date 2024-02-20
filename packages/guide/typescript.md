## tsconfig.json
path会影响导入路径

## import
import { defineConfig } from '.'或者 '..'
等价于'./index.ts'
极容易造成循环引用
需引入具体路径
