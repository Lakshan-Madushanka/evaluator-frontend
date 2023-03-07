import router from "./index";
import { useAppStore } from "@/stores/app";

export const auth = async (to) => {
  const appStore = useAppStore();

  if (appStore.authenticated) {
    return true;
  }

  router.push({ name: "login", query: { redirect: to.fullPath } });

  return false;
};
