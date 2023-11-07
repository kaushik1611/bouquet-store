<template>
  <section class="text-gray-600 body-font overflow-hidden" v-if="product">
    <div class="container px-5 py-24 mx-auto">
      <div class="lg:w-4/5 mx-auto flex flex-wrap">
        <div
          id="alert-4"
          class="w-full flex items-center p-4 mb-4 text-yellow-800 rounded-lg bg-yellow-50"
          role="alert"
        >
          <span class="sr-only">Info</span>
          <div class="ml-3 text-sm font-medium">
            <a @click="$router.push('/')" class="font-semibold hover:no-underline cursor-pointer"
              >⬅️ Back</a
            >
          </div>
        </div>
        <div
          v-if="state.showAlert"
          class="font-regular relative mb-4 block w-full rounded-lg bg-green-500 p-4 text-base leading-5 text-white opacity-100"
          v-text="state.message"
        ></div>
      </div>
      <div class="lg:w-4/5 mx-auto flex flex-wrap">
        <img
          alt="ecommerce"
          class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
          :src="product.image_url"
        />
        <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
          <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">{{ product.name }}</h1>
          <p class="leading-relaxed">
            {{ product.description }}
          </p>
          <div class="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
            <div class="flex ml-6 items-center">
              <span class="mr-3">Qty</span>
              <div class="relative">
                <input
                  class="border border-dashed text-center"
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="1"
                  max="100"
                  v-model="state.quantity"
                />
                <span
                  class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div class="flex">
            <span class="title-font font-medium text-2xl text-gray-900">{{ product.price }}€</span>
            <button
              :class="{ 'bg-green-500': state.alreadyInCart }"
              class="flex ml-auto text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
              @click="addToCart()"
            >
              {{ state.alreadyInCart ? 'Update Cart' : 'Add To Cart' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

import { useCart } from '../stores/cart'

const cart = useCart()
const product = ref(null)

// Back-end base url
const baseUrl = import.meta.env.VITE_BASE_URL

const state = reactive({
  quantity: 1,
  message: '',

  alreadyInCart: false,
  showAlert: false,

  cartItems: []
})

// To hide alert
const initialState = () => {
  state.showAlert = false
}

// Add specific product in cart with quantity
const addToCart = async () => {
  const cartResponse = await axios.post(baseUrl + '/cart/add', {
    product_id: product.value.id,
    quantity: state.quantity
  })

  if (cartResponse.data.status) {
    state.showAlert = true
    state.message = 'Product added into cart successfully.'

    setTimeout(initialState, 3000)
  }

  if (cartResponse.data.data.product_id === product.value.id) {
    state.alreadyInCart = true
  }

  getCart()
}

// To identify product is already in cart or not
const isProductInCart = (productId) => {
  return state.cartItems.some((item) => item.product_id === productId)
}

// To get specific product quantity from the cart
const getQuantity = (productId) => {
  const foundItem = state.cartItems.find((item) => item.product_id === productId)
  return foundItem ? foundItem.quantity : 0
}

// To get product details
const getProduct = async () => {
  const route = useRoute()
  const bouquetsResponse = await axios.get(baseUrl + '/bouquets/' + route.params.id)
  product.value = bouquetsResponse.data.data
}

// To get cart details (To update the cart button -> total cart items badge)
const getCart = async () => {
  const cartResponse = await axios.get(baseUrl + '/cart')
  state.cartItems = cartResponse.data.data.cart.cart_items

  cart.updateTotal(state.cartItems.length ?? 0)

  if (isProductInCart(product.value.id)) {
    state.alreadyInCart = true
    state.quantity = getQuantity(product.value.id)
  }
}

// Mounted
onMounted(async () => {
  try {
    getProduct()
    getCart()
  } catch (error) {
    console.error('Error fetching product data:', error)
  }
})
</script>