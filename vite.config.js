/*
 * @Descripttion:
 * @Version: v0.1
 * @Author: pengfei.xiu
 * @Date: 2021-10-11 16:37:22
 * @LastEditors: pengfei.xiu
 * @LastEditTime: 2021-10-12 15:11:25
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  vueCustomBlockTransforms: {
    xiu: (params) => {
      console.log("----------------", params);
      // throw new Error("aa");
      // i18n For international translation
      // return transformed code
    },
  },
});
