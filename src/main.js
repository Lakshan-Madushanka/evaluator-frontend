import "primeicons/primeicons.css"; //icons
import "primevue/resources/primevue.min.css"; //core css
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "./assets/main.css";
import "./assets/tailwind.css";

import App from "./App.vue";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { ripple: true, inputStyle: "filled" });

app.mount("#app");
