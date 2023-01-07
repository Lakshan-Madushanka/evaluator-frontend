<template>
  <NavBar />
  <RouterView />
</template>

<script>
import NavBar from "@/components/NavBar.vue";
export default {
  components: { NavBar },
  setup() {},
};
</script>

<style>
a.router-link-exact-active {
  color: var(--color-text);
}

a.router-link-exact-active:hover {
  background-color: transparent;
}
</style>
