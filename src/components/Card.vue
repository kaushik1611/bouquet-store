<template>
  <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
    <a href="#">
      <img class="p-4 rounded-t-sm" :src="image" alt="product image" />
    </a>
    <div class="px-5 pb-5">
      <a href="#">
        <h5 class="text-xl font-semibold tracking-tight text-gray-900">
          {{ title }}
        </h5>
      </a>
      <div class="flex items-center justify-between">
        <span class="text-3xl font-bold text-gray-900">{{ price }}€</span>
        <a
          @click="$router.push(goto)"
          class="text-white bg-indigo-600 hover:bg-indigo-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
          >View Details</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: null
  },

  price: {
    type: Number,
    default: 0
  },

  image: {
    type: String,
    default: null
  },

  goto: {
    type: String,
    default: '#'
  }
})
</script>