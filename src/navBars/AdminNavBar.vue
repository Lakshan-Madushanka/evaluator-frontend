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
    // Users
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
    case "admin.users.edit":
      return [
        {
          label: "users",
          to: { name: "admin.users.index" },
        },
        {
          label: "edit",
          to: { name: "admin.users.edit" },
        },
      ];
    // Categories
    case "admin.categories.index":
      return [
        {
          label: "categories",
          to: { name: "admin.categories.index" },
        },
      ];
    case "admin.categories.create":
      return [
        {
          label: "categories",
          to: { name: "admin.categories.index" },
        },
        {
          label: "create",
          to: { name: "admin.categories.create" },
        },
      ];
    case "admin.categories.edit":
      return [
        {
          label: "categories",
          to: { name: "admin.categories.index" },
        },
        {
          label: "edit",
          to: { name: "admin.categories.edit" },
        },
      ];
    // Questionnaires
    case "admin.questionnaires.index":
      return [
        {
          label: "questionnaires",
          to: { name: "admin.questionnaires.index" },
        },
      ];
    case "admin.questionnaires.create":
      return [
        {
          label: "questionnaires",
          to: { name: "admin.questionnaires.index" },
        },
        {
          label: "create",
          to: { name: "admin.questionnaires.create" },
        },
      ];
    case "admin.questionnaires.edit":
      return [
        {
          label: "questionnaires",
          to: { name: "admin.questionnaires.index" },
        },
        {
          label: "edit",
          to: { name: "admin.questionnaires.edit" },
        },
      ];
    default:
      return null;
  }
}
</script>
