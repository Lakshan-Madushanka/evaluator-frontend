<template>
  <Toast />

  <template v-if="!appStore.initialized || appStore.status === 'loggingOut'">
    <AppInitializingComponent />
  </template>

  <template v-else>
    <Message v-if="appStore.status === 'SESSION_EXPIRED'" severity="warn"
      >Your session has expired. Please login again !</Message
    >
    <NavBar />
    <RouterView />
  </template>
</template>

<script>
import { watch } from "vue";
import { useAuthStore } from "./stores/auth";
import { useAppStore } from "./stores/app";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import Message from "primevue/message";

import NavBar from "@/components/NavBar.vue";
import AppInitializingComponent from "./components/AppInitializingComponent.vue";
export default {
  components: { NavBar, AppInitializingComponent, Toast, Message },
  setup() {
    const appStore = useAppStore();
    const authStore = useAuthStore();

    const toast = useToast();

    watch(appStore.toast, (toastState) => {
      toast.add({
        severity: toastState.severity,
        summary: toastState.summary,
        detail: toastState.detail,
        life: toastState.life ? toastState.life : 5000,
      });
    });

    function test() {
      authStore.loadAuthUser();

      toast.add({
        severity: "error",
        summary: "Info Message",
        detail: "Message Content",
        life: 3000,
      });
    }

    return { appStore, test };
  },
};
</script>

<style>
a.router-link-exact-active {
  color: rgb(7, 210, 40);
}

a.router-link-exact-active:hover {
  background-color: transparent;
}
</style>
