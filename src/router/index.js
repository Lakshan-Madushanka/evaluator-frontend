import * as guards from "./guards";

import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import NProgress from "nprogress";
import { useAppStore } from "@/stores/app";

const AboutView = () => import("../views/AboutView.vue");
const MainErrorView = () => import("../views/errors/MainErrorView.vue");
const LoginView = () => import("../views/LoginView.vue");
const ProfileView = () => import("../views/ProfileView.vue");
const AdminLayout = () => import("../views/layouts/AdminLayout.vue");
const DefaultLayout = () => import("../views/layouts/DefaultLayout.vue");
const AdminDashboard = () => import("../views//admin/dashboard.vue");

/*
 Admin routes
*/

//users

const AdminUsersIndexView = () => import("../views/admin/users/IndexView.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Default routes
    {
      path: "",
      component: DefaultLayout,
      children: [
        {
          path: "",
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
          path: "/profile",
          name: "profile",
          beforeEnter: guards.auth,
          component: ProfileView,
        },
      ],
    },

    // Admin routes
    {
      path: "/admin",
      name: "admin",
      beforeEnter: guards.auth,
      component: AdminLayout,
      children: [
        {
          path: "",
          name: "admin.dashboard",
          component: AdminDashboard,
        },
        {
          path: "users",
          name: "admin.users.index",
          component: AdminUsersIndexView,
        },
      ],
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

router.beforeEach(async (to) => {
  NProgress.start();

  const appStore = useAppStore();

  if (!appStore.initialized) {
    await appStore.initApp();
  }

  if (appStore.authenticated) {
    if (to.name === "login") {
      router.replace({ name: "home" });
      return false;
    }
  }

  return true;
});

router.afterEach(() => {
  NProgress.done();
});
export default router;
