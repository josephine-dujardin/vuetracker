<template>
    <div>
        <h1>Accueil {{ $store.state.count }}</h1>
        <TaskList/>
    </div>
</template>

<script>
  import TaskList from '../components/TaskList.vue'
  export default {
    components: {
      TaskList
    }
  }
</script>

<style lang="scss" scoped>

</style>
