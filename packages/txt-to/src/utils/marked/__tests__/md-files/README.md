# tab-space-mix.md 说明

此文件中部分行上存在空格、tab 混用的情况。

-   tab01: 前面是 1 个 tab
-   tab02: 前面是 3 个空格和一个 tab
-   tab03: 前面是 2 个 tab

## 注意

为防止 `lint-staged` 自动调用 `prettier` 格式化 md 代码，所以需要在 `lint-staged.config.js`
中将此 md 文件配置在忽略项中。
