<template>
  <div class="relative flex bg-gray-100 min-h-screen">
    <div>
      <sidebar-menu
        :collapsed="sideBarCollapse"
        :menu="menu"
        class="shadow-2xl"
        theme="white-theme"
        @update:collapsed="onToggleCollapse"
      >
      </sidebar-menu>
    </div>
    <div
      :class="[
        'pl-[290px] w-full transition-all duration-[.3s]',
        { '!pl-[65px]': sideBarCollapse },
      ]"
    >
      <SessionTimeoutMessage />
      <NavBar />
      <div :class="['p-4', 'lg:p-4', { 'lg:p-12': sideBarCollapse }]">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, reactive, watch, onBeforeMount, markRaw } from "vue";

import { useRoute } from "vue-router";

import { formatText } from "@/helpers";

import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import NavBar from "@/navBars/AdminNavBar.vue";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import Divider from "primevue/divider";
import SessionTimeoutMessage from "@/components/SessionTimeoutMessage.vue";

export default {
  components: { SidebarMenu, NavBar, SessionTimeoutMessage },
  setup() {
    const route = useRoute();

    const appStore = useAppStore();
    const authStore = useAuthStore();

    const sideBarCollapse = ref(false);

    const activeClasses = reactive({
      users: "",
      categories: "",
      questionnaires: "",
      questions: "",
      answers: "",
    });
    const activeClassesRef = toRefs(activeClasses);

    const menu = ref([
      {
        header: formatText(`😊 Hello ${authStore.user.name}`, 20),
        hiddenOnCollapse: true,
        class: "text-center !text-xl !normal-case !pt-6",
        icon: "pi pi-fw pi-th-large",
      },
      {
        component: markRaw(Divider),
      },
      {
        href: { name: "home" },
        title: "Home",
        icon: "pi pi-fw pi-home",
        exact: true,
      },
      {
        href: { name: "admin.dashboard" },
        title: "Dashboard",
        icon: "pi pi-fw pi-th-large",
        exact: true,
      },
      {
        component: markRaw(Divider),
      },
      {
        href: { name: "admin.users.index" },
        title: "Users",
        class: activeClassesRef.users,
        icon: "pi pi-fw pi-users",
        exact: true,
      },
      {
        href: { name: "admin.categories.index" },
        title: "Categories",
        class: activeClassesRef.categories,
        icon: "pi pi-fw pi-bars",
        exact: true,
      },
      {
        href: { name: "admin.questionnaires.index" },
        title: "Questionnaires",
        class: activeClassesRef.questionnaires,
        icon: "pi pi-fw pi-server",
        exact: true,
      },
      {
        href: { name: "admin.questions.index" },
        title: "Questions",
        class: activeClassesRef.questions,
        icon: "pi pi-fw pi-question",
        exact: true,
      },
      {
        href: { name: "admin.answers.index" },
        title: "Answers",
        class: activeClassesRef.answers,
        icon: "pi pi-fw pi-language",
        exact: true,
      },
      {
        href: { name: "admin.evaluations.index" },
        title: "Evaluations",
        class: activeClassesRef.evaluations,
        icon: "pi pi-fw pi-map",
        exact: true,
      },
    ]);

    onBeforeMount(() => {
      let shouldSidebarCollapse = localStorage.getItem("ssc");

      if (!shouldSidebarCollapse) {
        shouldSidebarCollapse = false;
      }

      sideBarCollapse.value = shouldSidebarCollapse === "true" ? true : false;
    });

    watch(
      route,
      (newRoute) => {
        const routeName = newRoute.name;

        if (routeName.includes("users")) {
          activeClasses.users = "vsm--link_active";
          activeClasses.answers = "";
          activeClasses.questions = "";
          activeClasses.categories = "";
          activeClasses.questionnaires = "";
          activeClasses.evaluations = "";
        } else if (routeName.includes("categories")) {
          activeClasses.categories = "vsm--link_active";
          activeClasses.answers = "";
          activeClasses.questions = "";
          activeClasses.users = "";
          activeClasses.questionnaires = "";
          activeClasses.evaluations = "";
        } else if (routeName.includes("questionnaires")) {
          activeClasses.questionnaires = "vsm--link_active";
          activeClasses.answers = "";
          activeClasses.questions = "";
          activeClasses.categories = "";
          activeClasses.users = "";
          activeClasses.evaluations = "";
        } else if (routeName.includes("questions")) {
          activeClasses.questions = "vsm--link_active";
          activeClasses.answers = "";
          activeClasses.questionnaires = "";
          activeClasses.categories = "";
          activeClasses.users = "";
          activeClasses.evaluations = "";
        } else if (routeName.includes("answers")) {
          activeClasses.answers = "vsm--link_active";
          activeClasses.questions = "";
          activeClasses.questionnaires = "";
          activeClasses.categories = "";
          activeClasses.users = "";
          activeClasses.evaluations = "";
        } else if (routeName.includes("evaluations")) {
          activeClasses.evaluations = "vsm--link_active";
          activeClasses.answers = "";
          activeClasses.questions = "";
          activeClasses.questionnaires = "";
          activeClasses.categories = "";
          activeClasses.users = "";
        }
      },
      { immediate: true }
    );

    function onToggleCollapse(event) {
      sideBarCollapse.value = event;
      localStorage.setItem("ssc", event);
    }

    return { activeClasses, appStore, menu, onToggleCollapse, sideBarCollapse };
  },
};
</script>

<style>
.av-sidebar-menu .vsm--menu .vsm--header {
  color: rgb(202, 21, 21);
  padding: 1rem;
  text-align: center;
}
</style>
