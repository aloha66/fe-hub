## index.ts自动注入export * 模块

新增包需要在packages\metadata\packages.ts添加信息

1. 基于mono梳理出分包packages
2. 根据分包，得出项目结构生成json（packages\metadata\scripts\update.ts）
3. 根据json,生成index.ts
