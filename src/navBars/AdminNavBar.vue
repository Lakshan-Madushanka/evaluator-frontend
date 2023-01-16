<template>
  <nav
    class="py-4 px-4 flex justify-between text-[#495057] bg-[#f8f9fa] border border-solid rounded"
  >
    <div>
      <Breadcrumb :home="home" :model="getItems()" />
    </div>
    <div><AuthUserMenu /></div>
  </nav>
</template>

<script setup>
import Breadcrumb from "primevue/breadcrumb";
import AuthUserMenu from "@/components/AuthUserMenu.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const home = { icon: "pi pi-th-large", to: { name: "admin.dashboard" } };

function getItems() {
  switch (route.name) {
    default:
      return null;
  }
}
</script>
