<!--
 * @Descripttion: 
 * @Version: v0.1
 * @Author: pengfei.xiu
 * @Date: 2021-10-11 16:37:22
 * @LastEditors: pengfei.xiu
 * @LastEditTime: 2021-10-12 15:35:33
-->

<template>
  <h1>{{ msg }}</h1>
</template>

<script>
import { ref } from "vue";

export default {
  name: "helloWorld",
  props: {
    msg: {
      type: String,
      default: "",
    },
  },
  setup() {
    const count = ref(0);
    return { count };
  },
};
</script>

<style scoped>
a {
  color: #42b983;
  background-color: v-bind(count);
}
</style>

<!-- <xiu>aa</xiu> -->
