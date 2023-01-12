import router from "./index";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";

export const auth = async () => {
  const appStore = useAppStore();
  const authStore = useAuthStore();

  if (appStore.authLoadedStatus === "error") {
    await authStore.loadAuthUser();
  }
  if (appStore.authenticated) {
    return true;
  } else {
    console.log("herere");

    router.push({ name: "login" });
    return false;
  }
};
