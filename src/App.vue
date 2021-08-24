<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <!-- Ghost component used to load components dynamically -->
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player></app-player>

  <auth-modal />
</template>

<script>
import AppHeader from './components/Header.vue';
import AuthModal from './components/Auth.vue';
import AppPlayer from '@/components/Player.vue';

export default {
  name: 'App',
  components: { AppHeader, AuthModal, AppPlayer },
  data() {
    return {};
  },
  // Called when component is created
  created() {
    this.$store.dispatch('initLogin');
  },
};
</script>

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
