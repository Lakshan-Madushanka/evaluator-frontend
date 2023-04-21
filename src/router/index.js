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
const AdminDashboard = () => import("../views//admin/DashboardView.vue");

/*
 Admin routes
*/

//Users
const AdminUsersIndexView = () => import("../views/admin/users/IndexView.vue");
const AdminCreateUsersView = () =>
  import("../views/admin/users/CreateView.vue");
const AdminEditUsersView = () => import("../views/admin/users/EditView.vue");

// Questionnaires
const AdminUsersQuestionnaireView = () =>
  import("../views/admin/users/questionnaires/IndexView.vue");
// End users

// Questions
const AdminQuestionsIndexView = () =>
  import("../views/admin/questions/IndexView.vue");
const AdminQuestionsCreateView = () =>
  import("../views/admin/questions/CreateView.vue");
const AdminQuestionsEditView = () =>
  import("../views/admin/questions/EditView.vue");

// Answers
const AdminQuestionsAnswersIndexView = () =>
  import("../views/admin/questions/answers/IndexView.vue");
// And Answers
// End Questions

// Answers
const AdminAnswersIndexView = () =>
  import("../views/admin/answers/IndexView.vue");
const AdminAnswersCreateView = () =>
  import("../views/admin/answers/CreateView.vue");
const AdminAnswersEditView = () =>
  import("../views/admin/answers/EditView.vue");

//Categories
const AdminCategoriesIndexView = () =>
  import("../views/admin/categories/IndexView.vue");
const AdminCreateCategoryView = () =>
  import("../views/admin/categories/CreateView.vue");
const AdminEditCategoryView = () =>
  import("../views/admin/categories/EditView.vue");

//Questionnaires
const AdminQuestionnairesIndexView = () =>
  import("../views/admin/questionnaires/IndexView.vue");
const AdminCreateQuestionnaireView = () =>
  import("../views/admin/questionnaires/CreateView.vue");
const AdminEditQuestionnaireView = () =>
  import("../views/admin/questionnaires/EditView.vue");

// Questions
const AdminQuestionnairesQuestionsIndexView = () =>
  import("../views/admin/questionnaires/questions/IndexView.vue");
const AdminQuestionnairesQuestionsShowView = () =>
  import("../views/admin/questionnaires/questions/ShowView.vue");
const AdminQuestionnairesQuestionsPrintView = () =>
  import("../views/admin/questionnaires/questions/PrintView.vue");
// End Questionnaires

// Image Manager =
const AdminImageManager = () =>
  import("../views/admin/images/ImageManager.vue");

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
      beforeEnter: guards.auth,
      children: [
        {
          path: "questionnaires/:id/questions/print",
          name: "admin.questionnaires.questions.print",
          component: AdminQuestionnairesQuestionsPrintView,
        },
      ],
    },
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
        //-------------------------------------Users------------------------------------------------------------------------------
        {
          path: "users",
          name: "admin.users.index",
          component: AdminUsersIndexView,
        },
        {
          path: "users/create",
          name: "admin.users.create",
          component: AdminCreateUsersView,
        },
        {
          path: "users/:id/edit",
          name: "admin.users.edit",
          component: AdminEditUsersView,
        },
        // Questionnaires
        {
          path: "/users/:id/questionnaires",
          name: "admin.users.questionnaires.index",
          component: AdminUsersQuestionnaireView,
        },
        //----------------------------------End Users------------------------------------------------------------------------------

        //--------------------------------------Questions-----------------------------------------------------------------
        {
          path: "questions",
          name: "admin.questions.index",
          component: AdminQuestionsIndexView,
        },
        {
          path: "questions/create",
          name: "admin.questions.create",
          component: AdminQuestionsCreateView,
        },
        {
          path: "questions/:id/edit",
          name: "admin.questions.edit",
          component: AdminQuestionsEditView,
        },

        // Answers
        {
          path: "questions/:id/answers",
          name: "admin.questions.answers.index",
          component: AdminQuestionsAnswersIndexView,
        },
        //---------------------------------------------End Questions---------------------------------------------------------

        //--------------------------------------Answers-----------------------------------------------------------------
        {
          path: "answers",
          name: "admin.answers.index",
          component: AdminAnswersIndexView,
        },
        {
          path: "answers/create",
          name: "admin.answers.create",
          component: AdminAnswersCreateView,
        },
        {
          path: "answers/:id/edit",
          name: "admin.answers.edit",
          component: AdminAnswersEditView,
        },
        //---------------------------------------------End Questions---------------------------------------------------------

        //--------------------------------------------------------Categories---------------------------------------------
        {
          path: "categories",
          name: "admin.categories.index",
          component: AdminCategoriesIndexView,
        },
        {
          path: "categories/create",
          name: "admin.categories.create",
          component: AdminCreateCategoryView,
        },
        {
          path: "categories/:id/edit",
          name: "admin.categories.edit",
          component: AdminEditCategoryView,
        },
        //--------------------------------------------------------------End Categories-------------------------------------

        //-------------------------------------------------------Questionnaires--------------------------------------------
        {
          path: "questionnaires",
          name: "admin.questionnaires.index",
          component: AdminQuestionnairesIndexView,
        },
        {
          path: "questionnaires/create",
          name: "admin.questionnaires.create",
          component: AdminCreateQuestionnaireView,
        },
        {
          path: "questionnaires/:id/edit",
          name: "admin.questionnaires.edit",
          component: AdminEditQuestionnaireView,
        },
        // Questions
        {
          path: "questionnaires/:id/questions",
          name: "admin.questionnaires.questions.index",
          component: AdminQuestionnairesQuestionsIndexView,
        },
        {
          path: "questionnaires/:id/questions/show",
          name: "admin.questionnaires.questions.show",
          component: AdminQuestionnairesQuestionsShowView,
        },
        //--------------------------------------------------- End Questionnaire----------------------------------------------

        // Image Manager
        {
          path: "images-manager/:type/:id",
          name: "admin.images.manager",
          component: AdminImageManager,
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
