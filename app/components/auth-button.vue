<script lang="ts" setup>
import { onMounted, ref } from "vue";

import { useAuthStore } from "~/stores/auth"; // 你的 store 路径保持不变

const authStore = useAuthStore();
const mounted = ref(false);

onMounted(() => {
  // 在客户端挂载后再显示组件，避免 SSR mismatch
  mounted.value = true;
});
</script>

<template>
  <transition name="fade" mode="out-in">
    <!-- 未挂载前输出静态占位，防止 Hydration mismatch -->
    <div v-if="!mounted" key="placeholder" class="btn btn-ghost opacity-50 cursor-wait">
      <span class="loading loading-spinner loading-sm" />
    </div>

    <!-- 已挂载后才根据真实状态渲染 -->
    <div v-else key="auth" class="flex justify-center items-center">
      <!-- 已登录 -->
      <div v-if="!authStore.loading && authStore.user" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn m-1 p-2">
          <div v-if="authStore.user.image" class="avatar">
            <div class="w-6 rounded-full">
              <img :src="authStore.user.image" :alt="authStore.user.name">
            </div>
          </div>
          {{ authStore.user.name }}
        </div>
        <ul
          tabindex="-1"
          class="dropdown-content menu bg-base-200 rounded-box z-1 w-auto p-2 shadow-sm"
        >
          <li>
            <NuxtLink to="/sign-out" class="text-secondary">
              <Icon name="tabler:logout-2" size="16" />
              Sign Out
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- 未登录 -->
      <button
        v-else
        :disabled="authStore.loading"
        class="btn btn-accent"
        @click="authStore.signIn"
      >
        <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
        <Icon v-else name="tabler:brand-github" size="24" />
        Github
      </button>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
