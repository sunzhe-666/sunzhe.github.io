<template>
  <div class="search">
    <i
      class="el-icon-search"
      style="color:#fff; width: 20px; height: 20px display:inline-block"
      @click="showSearch"
    />
    <input
      v-show="showInput"
      style="display:inline-block"
      placeholder="请输入内容"
      @blur="removeInput"
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      showInput: false
    }
  },
  methods: {
    showSearch() {
      this.showInput = true
    },
    removeInput() {
      this.showInput = false
    }
  }
}
</script>

<style></style>
