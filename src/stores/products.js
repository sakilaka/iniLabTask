import { defineStore } from 'pinia';
import { productService } from '@/services/products';

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [],
        currentProduct: null,
        pagination: {},
        loading: false,
        error: null
    }),

    actions: {
        async fetchProducts(page = 1) {
            this.loading = true;
            this.error = null;
            try {
                const response = await productService.getAll(page);
                this.products = response.data;
                this.pagination = {
                    current_page: response.current_page,
                    last_page: response.last_page,
                    total: response.total,
                    per_page: response.per_page
                };
            } catch (error) {
                this.error = error.message || 'Failed to fetch products';
            } finally {
                this.loading = false;
            }
        },

        async fetchProduct(id) {
            this.loading = true;
            this.error = null;
            try {
                this.currentProduct = await productService.getById(id);
            } catch (error) {
                this.error = error.message || 'Failed to fetch product';
            } finally {
                this.loading = false;
            }
        },

        async createProduct(productData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await productService.create(productData);
                await this.fetchProducts();
                return { success: true, data: response };
            } catch (error) {
                this.error = error.message || 'Failed to create product';
                return { success: false, error };
            } finally {
                this.loading = false;
            }
        },

        async updateProduct(id, productData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await productService.update(id, productData);
                await this.fetchProducts();
                return { success: true, data: response };
            } catch (error) {
                this.error = error.message || 'Failed to update product';
                return { success: false, error };
            } finally {
                this.loading = false;
            }
        },

        async deleteProduct(id) {
            this.loading = true;
            this.error = null;
            try {
                await productService.delete(id);
                await this.fetchProducts();
                return { success: true };
            } catch (error) {
                this.error = error.message || 'Failed to delete product';
                return { success: false, error };
            } finally {
                this.loading = false;
            }
        }
    }
});