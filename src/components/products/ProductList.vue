<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Products</h2>
            <button
                @click="$emit('create')"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                v-if="isAuthenticated"
            >
                Add Product
            </button>
        </div>

        <div v-if="loading" class="text-center py-8">
            <p>Loading products...</p>
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-8">
            {{ error }}
        </div>

        <div v-else-if="products.length === 0" class="text-center py-8">
            <p class="text-gray-500">No products found.</p>
        </div>

        <div v-else>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" v-if="isAuthenticated">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="product in products" :key="product.id">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                                <div class="text-sm text-gray-500" v-if="product.description">{{ product.description }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ product.sku }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${{ parseFloat(product.price).toFixed(2) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ product.quantity }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" v-if="isAuthenticated">
                                <button
                                    @click="$emit('edit', product)"
                                    class="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="$emit('delete', product.id)"
                                    class="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.last_page > 1" class="mt-6 flex justify-center">
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                        @click="changePage(pagination.current_page - 1)"
                        :disabled="pagination.current_page === 1"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span
                        v-for="page in pagination.last_page"
                        :key="page"
                        @click="changePage(page)"
                        :class="[
                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer',
                            page === pagination.current_page
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        ]"
                    >
                        {{ page }}
                    </span>
                    <button
                        @click="changePage(pagination.current_page + 1)"
                        :disabled="pagination.current_page === pagination.last_page"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    products: {
        type: Array,
        default: () => []
    },
    pagination: {
        type: Object,
        default: () => ({})
    },
    loading: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['create', 'edit', 'delete', 'page-change']);

const changePage = (page) => {
    emit('page-change', page);
};
</script>