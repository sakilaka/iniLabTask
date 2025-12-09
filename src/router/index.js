import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/auth/Login.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../components/auth/Register.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/products',
        name: 'products',
        component: () => import('../views/ProductsView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (to.meta.guestOnly && authStore.isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;