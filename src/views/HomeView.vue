<template>
  <div class="container mx-auto">
    <div class="grid grid-cols-5 gap-4 m-5">
      <Card
        v-for="(bouquet, index) in bouquets"
        :key="index"
        :image="bouquet.image_url"
        :title="bouquet.name"
        :price="bouquet.price"
        :goto="'bouquet/' + bouquet.id + '/edit'"
      />
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, reactive } from 'vue'

import Card from '../components/Card.vue'

import { useCart } from '../stores/cart'

const cart = useCart()
const bouquets = ref([])

// Back-end base url
const baseUrl = import.meta.env.VITE_BASE_URL

const state = reactive({
  cartItems: []
})

// To get products list
const getProducts = async () => {
  const response = await axios.get(baseUrl + '/bouquets')
  bouquets.value = response.data.data
}

// To get cart details (To update the cart button -> total cart items badge)
const getCart = async () => {
  const cartResponse = await axios.get(baseUrl + '/cart')
  state.cartItems = cartResponse.data.data.cart.cart_items

  cart.updateTotal(state.cartItems.length ?? 0)
}

// Mounted
onMounted(async () => {
  try {
    getProducts()
    getCart()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>