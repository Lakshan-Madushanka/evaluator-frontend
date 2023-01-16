<template>
  <SessionTimeoutMessage />
  <NavBar />
  <router-view></router-view>
</template>

<script setup>
import NavBar from "@/navBars/DefaultNavBar.vue";
import SessionTimeoutMessage from "@/components/SessionTimeoutMessage.vue";
</script>
