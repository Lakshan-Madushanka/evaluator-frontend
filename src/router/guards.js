import router from "./index";
import { useAppStore } from "@/stores/app";

export const auth = () => {
  const appStore = useAppStore();

  if (appStore.authenticated) {
    return true;
  } else {
    console.log("herere");

    router.push({ name: "login" });
    return false;
  }
};
