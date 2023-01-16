<template>
  <Toast />

  <template v-if="!appStore.initialized || appStore.status === 'loggingOut'">
    <AppInitializingComponent />
  </template>

  <template v-else>
    <RouterView />
  </template>
</template>

<script>
import { watch } from "vue";
import { useAuthStore } from "./stores/auth";
import { useAppStore } from "./stores/app";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import AppInitializingComponent from "./components/AppInitializingComponent.vue";
export default {
  components: { AppInitializingComponent, Toast },
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
a.router-link-exact-active,
.router-link-active-exact {
  color: rgb(7, 210, 40);
}

a.router-link-exact-active:hover,
.router-link-active-exact:hover {
  background-color: transparent;
}
</style>
