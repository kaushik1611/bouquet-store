<template>
  <header class="text-gray-600 body-font">
    <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
      <nav class="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
        <a class="mr-5 hover:text-gray-900">Link</a>
        <a class="mr-5 hover:text-gray-900">Link</a>
        <a class="mr-5 hover:text-gray-900">Link</a>
        <a class="hover:text-gray-900">Link</a>
      </nav>
      <a
        class="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0"
      >
        <img :src="logo" alt="bouquet Store" />
      </a>
      <div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
        <CartButton />
      </div>
    </div>
  </header>
</template>

<script setup>
import CartButton from '../components/CartButton.vue'

defineProps({
  logo: {
    type: String,
    default: null
  }
})
</script>