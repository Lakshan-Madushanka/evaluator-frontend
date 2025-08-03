// Tailwind styles
import "./assets/tailwind.css";
// Prime Vue styles
import "nprogress/nprogress.css";
import "primeicons/primeicons.css"; //icons
// Main styles
import "./assets/main.css";

// Vue
import App from "./App.vue";
import { createApp } from "vue";

//Router
import router from "./router";

// Pinia
import { createPinia } from "pinia";

// Prime vue
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import ConfirmationService from "primevue/confirmationservice";

// Custom directives
import copyToClipboard from "./directives/copyToClipboard";

const app = createApp(App);

app.directive("tooltip", Tooltip);
app.directive("copy-to-clipboard", copyToClipboard);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: { preset: Aura },
  ripple: true,
  inputStyle: "filled",
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount("#app");
