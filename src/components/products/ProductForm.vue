<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700"
        >Product Name</label
      >
      <input
        type="text"
        id="name"
        v-model="form.name"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700"
        >Description</label
      >
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700"
          >Price</label
        >
        <input
          type="number"
          step="0.01"
          id="price"
          v-model="form.price"
          required
          min="0"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="quantity" class="block text-sm font-medium text-gray-700"
          >Quantity</label
        >
        <input
          type="number"
          id="quantity"
          v-model="form.quantity"
          required
          min="0"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label for="sku" class="block text-sm font-medium text-gray-700"
        >SKU</label
      >
      <input
        type="text"
        id="sku"
        v-model="form.sku"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>

    <div v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        <span v-if="loading">Saving...</span>
        <span v-else>{{ isEdit ? "Update" : "Create" }} Product</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["submit", "cancel"]);

const form = ref({
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  sku: "",
});

const isEdit = ref(false);

const resetForm = () => {
  form.value = {
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    sku: "",
  };
};

watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      isEdit.value = true;
      form.value = {
        name: newProduct.name || "",
        description: newProduct.description || "",
        price: newProduct.price || 0,
        quantity: newProduct.quantity || 0,
        sku: newProduct.sku || "",
      };
    } else {
      isEdit.value = false;
      resetForm();
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit("submit", form.value);
};
</script>
