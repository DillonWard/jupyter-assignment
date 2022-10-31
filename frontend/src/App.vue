<template>
  <div id="app">
    <QueryForm />
  </div>
</template>

<script>
import QueryForm from './components/QueryForm.vue';

export default {
  name: 'App',
  components: {
    QueryForm,
  },
};
</script>

<style>
#app {
  padding: 25px 25px 25px 25px;
}
</style>
