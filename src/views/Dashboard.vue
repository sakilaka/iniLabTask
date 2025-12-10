<template>
    <div class="min-h-screen bg-gray-100">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <!-- User Info -->
            <div class="mb-8">
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 class="text-lg leading-6 font-medium text-gray-900">
                                Welcome, {{ user.name }}!
                            </h3>
                            <p class="mt-1 max-w-2xl text-sm text-gray-500">
                                {{ user.email }}
                            </p>
                        </div>
                        <button
                            @click="handleLogout"
                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <!-- Products Section -->
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Your Products</h2>
                    
                    <div v-if="loading" class="text-center py-8">
                        <p>Loading your products...</p>
                    </div>

                    <div v-else-if="error" class="text-red-500 text-center py-8">
                        {{ error }}
                    </div>

                    <div v-else-if="userProducts.length === 0" class="text-center py-8">
                        <p class="text-gray-500">You haven't created any products yet.</p>
                        <button
                            @click="$router.push('/products')"
                            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Create Your First Product
                        </button>
                    </div>

                    <div v-else class="space-y-4">
                        <div v-for="product in userProducts" :key="product.id" class="border rounded-lg p-4">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
                                    <p class="text-sm text-gray-500">SKU: {{ product.sku }}</p>
                                    <p class="text-sm text-gray-500 mt-1">{{ product.description }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-lg font-bold text-gray-900">${{ parseFloat(product.price).toFixed(2) }}</p>
                                    <p class="text-sm text-gray-500">Quantity: {{ product.quantity }}</p>
                                </div>
                            </div>
                            <div class="mt-4 flex space-x-3">
                                <button
                                    @click="editProduct(product)"
                                    class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="deleteProduct(product.id)"
                                    class="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal" class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Edit Product
                                </h3>
                                <ProductForm
                                    :product="editingProduct"
                                    :loading="formLoading"
                                    :error="formError"
                                    @submit="handleUpdate"
                                    @cancel="closeEditModal"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { useProductStore } from "../stores/products";
import ProductForm from "../components/products/ProductForm.vue";

const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();

const { user } = storeToRefs(authStore);
const { products, loading, error } = storeToRefs(productStore);

const showEditModal = ref(false);
const editingProduct = ref(null);
const formLoading = ref(false);
const formError = ref('');

const userProducts = computed(() => {
    return products.value.filter(product => product.user_id === user.value?.id);
});

const fetchProducts = () => {
    productStore.fetchProducts();
};

const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
};

const editProduct = (product) => {
    editingProduct.value = product;
    showEditModal.value = true;
};

const handleUpdate = async (formData) => {
    formLoading.value = true;
    formError.value = '';

    try {
        await productStore.updateProduct(editingProduct.value.id, formData);
        closeEditModal();
    } catch (error) {
        formError.value = error.message || 'Update failed';
    } finally {
        formLoading.value = false;
    }
};

const deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        await productStore.deleteProduct(id);
    }
};

const closeEditModal = () => {
    showEditModal.value = false;
    editingProduct.value = null;
    formError.value = '';
};

onMounted(() => {
    fetchProducts();
});
</script>