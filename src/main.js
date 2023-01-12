// Tailwind styles
import "./assets/tailwind.css";
// Prime Vue styles
import "nprogress/nprogress.css";
import "primeicons/primeicons.css"; //icons
import "primevue/resources/primevue.min.css"; //core css
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "./assets/main.css";

import App from "./App.vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import { createApp } from "vue";
// Main styles
import { createPinia } from "pinia";
import router from "./router";

const app = createApp(App);

app.directive("tooltip", Tooltip);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { ripple: true, inputStyle: "filled" });
app.use(ToastService);

app.mount("#app");
