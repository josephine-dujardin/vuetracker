<template>
  <el-row>

    <el-col :xs="12" :span="15" :lg="18">
      <el-input placeholder="Nom de votre tâche" v-model="taskname"></el-input>
    </el-col>

    <el-col :xs="12" :span="9" :lg="6" class="actions">
      <el-button type="primary" icon="el-icon-video-play" circle></el-button>
      <el-button type="danger" icon="el-icon-video-pause" circle></el-button>
      <span>00:00:00</span>
    </el-col>

  </el-row>
</template>

<script>
  export default {
    data() {
      return {
        taskname: ''
      }
    },
  }
</script>

<style lang="scss" scoped>
.el-input {
  padding-left: 20px;
  box-sizing: border-box;
}

.actions {
  text-align: right;
  padding-right: 20px;
  span {
    padding-left: 20px;
  }
}
</style>