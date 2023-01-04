<template>
  <RouterView />
</template>

<script>
export default {
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
