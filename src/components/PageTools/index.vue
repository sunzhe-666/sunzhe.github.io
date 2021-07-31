<template>
  <!-- 头部 -->
  <el-card class="head-card">
    <el-row type="flex" justify="space-between">
      <!-- 左侧的 -->
      <el-col :span="6">
        <slot name="before" />
      </el-col>
      <!-- 右侧的 -->
      <el-col class="right-col" :span="6">
        <slot name="after" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools'
}
</script>

<style></style>
