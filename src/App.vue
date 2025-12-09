<template>
  <div id="app">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-indigo-600">
                Product Manager
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link to="/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900">
                Home
              </router-link>
              <router-link to="/products"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900">
                Products
              </router-link>
              <router-link v-if="isAuthenticated" to="/dashboard"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900">
                Dashboard
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <div v-if="!isAuthenticated" class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link to="/login"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900">
                Login
              </router-link>
              <router-link to="/register"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900">
                Register
              </router-link>
            </div>
            <div v-else class="flex items-center space-x-4">
              <span class="text-gray-700">Welcome, {{ user?.name }}</span>
              <button @click="handleLogout" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from './stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const { user, isAuthenticated } = storeToRefs(authStore);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>