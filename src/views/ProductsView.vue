<template>
    <div class="min-h-screen bg-gray-100">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <ProductList
                        :products="userProducts"
                        :pagination="pagination"
                        :loading="loading"
                        :error="error"
                        :isAuthenticated="isAuthenticated"
                        @create="showCreateModal = true"
                        @edit="editProduct"
                        @delete="deleteProduct"
                        @page-change="changePage"
                    />
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
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
                                    {{ editingProduct ? 'Edit Product' : 'Create New Product' }}
                                </h3>
                                <ProductForm
                                    :product="editingProduct"
                                    :loading="formLoading"
                                    :error="formError"
                                    @submit="handleSubmit"
                                    @cancel="closeModal"
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
import { ref, onMounted, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useProductStore } from '../stores/products';
import ProductList from '../components/products/ProductList.vue';
import ProductForm from '../components/products/ProductForm.vue';

const authStore = useAuthStore();
const productStore = useProductStore();

const { isAuthenticated, user } = storeToRefs(authStore);
const { products, pagination, loading, error } = storeToRefs(productStore);

const userProducts = computed(() => {
    return products.value.filter(product => product.user_id === user.value?.id);
});

const showModal = ref(false);
const showCreateModal = ref(false);
const editingProduct = ref(null);
const formLoading = ref(false);
const formError = ref('');

const fetchProducts = (page = 1) => {
    productStore.fetchProducts(page);
};

const editProduct = (product) => {
    editingProduct.value = product;
    showModal.value = true;
};

const deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        await productStore.deleteProduct(id);
    }
};

const changePage = (page) => {
    fetchProducts(page);
};

const handleSubmit = async (formData) => {
    formLoading.value = true;
    formError.value = '';

    try {
        if (editingProduct.value) {
            await productStore.updateProduct(editingProduct.value.id, formData);
        } else {
            await productStore.createProduct(formData);
        }
        
        closeModal();
    } catch (error) {
        formError.value = error.message || 'Operation failed';
    } finally {
        formLoading.value = false;
    }
};

const closeModal = () => {
    showModal.value = false;
    showCreateModal.value = false;
    editingProduct.value = null;
    formError.value = '';
};

watch(showCreateModal, (value) => {
    if (value) {
        showModal.value = true;
        editingProduct.value = null;
    }
});

onMounted(() => {
    fetchProducts();
});
</script>
