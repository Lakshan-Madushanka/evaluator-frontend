<template>
  <MenuBar />
  <RouterView />
</template>

<script>
import MenuBar from "@/components/MenuBar.vue";
export default {
  components: { MenuBar },
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
