<template>
  <nav
    class="py-4 px-4 flex justify-between text-[#495057] bg-[white] border border-solid rounded items-center"
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
    case "admin.users.index":
      return [
        {
          label: "users",
          to: { name: "admin.users.index" },
        },
      ];
    case "admin.users.create":
      return [
        {
          label: "users",
          to: { name: "admin.users.index" },
        },
        {
          label: "create",
          to: { name: "admin.users.create" },
        },
      ];
    default:
      return null;
  }
}
</script>
