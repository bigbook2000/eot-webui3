/// <reference types="vite/client" />
declare module 'element-plus/dist/locale/zh-cn.mjs';

/** 避免vue文件找不到 */
declare module '*.vue' {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}