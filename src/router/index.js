import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";

const AboutView = () => import("../views/AboutView.vue");
const MainErrorView = () => import("../views/errors/MainErrorView.vue");
const LoginView = () => import("../views/LoginView.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/error",
      name: "error",
      component: MainErrorView,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: "error", query: { status: 404, type: "client" } },
      component: MainErrorView,
    },
  ],
});

export default router;
