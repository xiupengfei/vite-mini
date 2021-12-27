<!--
 * @Descripttion: 
 * @Version: v0.1
 * @Author: pengfei.xiu
 * @Date: 2021-10-11 16:37:22
 * @LastEditors: pengfei.xiu
 * @LastEditTime: 2021-10-12 17:04:24
-->
<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <HelloWorld msg="Hello Vue 3 + Vite" />
  <div class="test">
    <h3>{{ count }}</h3>
    <ul>
      <li v-for="item in list" :key="item">{{ item }}</li>
    </ul>
    <div class="img"></div>
    <button @click="handleAdd">点击</button>
  </div>
</template>
<script>
import HelloWorld from "./components/HelloWorld.vue";
import "./index.scss";

export default {
  components: { HelloWorld },
  data() {
    return {
      count: 1,
      list: ["a", "b", "c"],
    };
  },
  methods: {
    handleAdd() {
      this.count++;
    },
  },
};
</script>
<style lang="scss" scoped>
// $color: red;

// .test {
//   h3 {
//     color: $color;
//   }
// }
</style>
