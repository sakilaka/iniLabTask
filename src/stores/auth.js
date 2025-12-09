import { defineStore } from 'pinia';
import { authService } from '../services/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: authService.getUser(),
        isAuthenticated: authService.isAuthenticated()
    }),

    actions: {
        async login(credentials) {
            try {
                const data = await authService.login(credentials);
                this.user = data.user;
                this.isAuthenticated = true;
                return { success: true, data };
            } catch (error) {
                return { success: false, error };
            }
        },

        async register(userData) {
            try {
                const data = await authService.register(userData);
                this.user = data.user;
                this.isAuthenticated = true;
                return { success: true, data };
            } catch (error) {
                return { success: false, error };
            }
        },

        async logout() {
            await authService.logout();
            this.user = null;
            this.isAuthenticated = false;
        }
    }
});