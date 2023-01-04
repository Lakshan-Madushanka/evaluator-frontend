<template>
  <Menubar :model="mainItems">
    <template #start>
      <div class="pr-4">
        <img class="w-8" src="../assets/images/evaluator.png" alt="evaluator" />
      </div>
    </template>
    <template #item="{ item }">
      <router-link
        v-slot="{ href, navigate, isActive, isExactActive }"
        :to="item.to"
        custom
      >
        <a
          :href="href"
          :class="[
            'py-2 px-4 font-bold',
            'inline-block',
            {
              'text-green-500': isActive,
              'text-green-500': isExactActive,
            },
          ]"
          @click="navigate"
          >{{ item.label }}</a
        >
      </router-link>
    </template>
    <template #end>
      <i
        class="pi pi-user hover:cursor-pointer"
        style="font-size: 1.5rem"
        aria-haspopup="true"
        aria-controls="overlay_menu"
        @click="toggle"
      ></i>
      <MenuComponent
        id="overlay_menu"
        ref="authMenu"
        :model="authItems"
        :popup="true"
      />
    </template>
  </Menubar>
</template>

<script>
import { ref } from "vue";
import Menubar from "primevue/menubar";
import MenuComponent from "primevue/menu";

export default {
  components: {
    Menubar,
    MenuComponent,
  },

  setup() {
    const authMenu = ref();

    const mainItems = [
      {
        label: "Home",
        icon: "pi pi-fw pi-file",
        to: { name: "home" },
      },
      {
        label: "About",
        icon: "pi pi-fw pi-file",
        to: { name: "about" },
      },
    ];

    const authItems = [
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-th-large",
        to: { name: "dashboard" },
      },
      { separator: true },
      {
        label: "Sign Out",
        icon: "pi pi-fw pi-sign-out",
      },
    ];

    const toggle = (event) => {
      authMenu.value.toggle(event);
    };

    return { mainItems, authItems, authMenu, toggle };
  },
};
</script>
