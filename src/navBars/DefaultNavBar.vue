<template>
  <Menubar :model="mainItems">
    <template #start>
      <div class="sm:pr-4 md:ml-8">
        <img class="w-8" src="../assets/images/evaluator.png" alt="evaluator" />
      </div>
    </template>
    <template #item="{ item }">
      <router-link v-slot="{ href, navigate, isActive, isExactActive }" :to="item.to" custom>
        <a
          :href="href"
          :class="[
            'py-2 px-4 font-bold',
            'inline-block',
            {
              'text-[var(--p-primary-color)]': isActive,
              'text-[var(--p-primary-color)]': isExactActive
            }
          ]"
          @click="navigate"
          >{{ item.label }}</a
        >
      </router-link>
    </template>
    <template #end>
      <template v-if="!appStore.authenticated">
        <router-link :to="{ name: 'login' }" class="md:mr-8 font-bold py-2 px-3">Login</router-link>
      </template>

      <template v-else>
        <AuthUserMenu />
      </template>
    </template>
  </Menubar>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import AuthUserMenu from '@/components/AuthUserMenu.vue'
export default {
  components: {
    Menubar,
    AuthUserMenu
  },

  setup() {
    const router = useRouter()
    const appStore = useAppStore()
    const authStore = useAuthStore()

    const authMenu = ref()

    const mainItems = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-file',
        to: { name: 'home' }
      },

      {
        label: 'About',
        icon: 'pi pi-fw pi-file',
        to: { name: 'about' }
      }
    ]

    const authItems = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user-edit',
        to: { name: 'home' },
        command: () => {
          router.push({ name: 'profile' })
        }
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-th-large',
        to: { name: 'admin.dashboard' }
      },
      { separator: true },
      {
        label: 'Sign Out',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
          authStore.logOut()
        }
      }
    ]

    return {
      appStore,
      authStore,
      mainItems,
      authItems,
      authMenu
    }
  }
}
</script>
