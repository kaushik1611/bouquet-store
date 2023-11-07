<template>
  <div class="container mx-auto mt-10">
    <div
      v-if="state.showAlert"
      class="font-regular relative mb-4 block w-full rounded-lg bg-green-500 p-4 text-base leading-5 text-white opacity-100"
      v-text="state.message"
    >
    </div>
    <div class="flex shadow-md my-10" v-if="state.cartItems.length > 0">
      <div class="w-3/4 bg-white px-10 py-10">
        <div class="flex justify-between border-b pb-8">
          <h1 class="font-semibold text-2xl">Shopping Cart</h1>
          <h2 class="font-semibold text-2xl">{{ cart.total }} Items</h2>
        </div>
        <div class="flex mt-10 mb-5">
          <h3 class="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
          <h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">
            Quantity
          </h3>
          <h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">
            Price
          </h3>
          <h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">
            Total
          </h3>
        </div>

        <div
          class="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
          v-for="(cartItem, index) in state.cartItems"
          :key="index"
        >
          <div class="flex w-2/5">
            <!-- product -->
            <div class="w-20">
              <img class="h-24" :src="cartItem.product.image_url" alt="" />
            </div>
            <div class="flex flex-col justify-between ml-4 flex-grow">
              <span class="font-bold text-sm">{{ cartItem.product.name }}</span>
              <span class="text-sm text-gray-400">{{ cartItem.product.description }}</span>
              <a
                @click="removeFromCart(cartItem.product.id)"
                class="font-semibold hover:text-red-500 text-gray-500 text-xs cursor-pointer"
              >
                Remove
              </a>
            </div>
          </div>
          <div class="flex justify-center w-1/5">
            <input
              class="border border-dashed text-center"
              type="number"
              name="quantity"
              id="quantity"
              min="1"
              max="100"
              v-model="cartItem.quantity"
              @change="debouncedUpdateQuantity(cartItem.product.id, cartItem.quantity)"
            />
          </div>
          <span class="text-center w-1/5 font-semibold text-sm">{{ cartItem.product.price }}€</span>
          <span class="text-center w-1/5 font-semibold text-sm"
            >{{ productTotal(cartItem.quantity, cartItem.product.price) }}€</span
          >
        </div>

        <a
          @click="$router.push('/')"
          class="flex font-semibold text-indigo-600 text-sm mt-10 cursor-pointer"
        >
          <svg class="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512">
            <path
              d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z"
            />
          </svg>
          Continue Shopping
        </a>
      </div>

      <div id="summary" class="w-1/4 px-8 py-10">
        <h1 class="font-semibold text-2xl border-b pb-8">Order Summary</h1>
        <div class="flex justify-between mt-10 mb-5">
          <span class="font-semibold text-sm uppercase">Items {{ cart.total }}</span>
          <span class="font-semibold text-sm">{{ subTotal() }}€</span>
        </div>
        <div class="flex justify-between py-1 text-sm uppercase">
          <span>Delivery Fee</span>
          <span>{{ state.convenienceFee.deliveryFee ?? 0 }}€</span>
        </div>
        <hr />
        <div class="flex justify-between py-1 text-sm uppercase">
          <span>Packaging Fee</span>
          <span>{{ state.convenienceFee.packagingFee ?? 0 }}€</span>
        </div>
        <hr />
        <div class="flex justify-between py-1 text-sm uppercase">
          <span>Sale Tax</span>
          <span>{{ state.convenienceFee.saleTax ?? 0 }}€</span>
        </div>

        <br />

        <hr />
        <div v-if="state.discount.totalSavings > 0" class="flex justify-between py-1 text-sm uppercase">
          <span>Voucher Savings</span>
          <span>-{{ state.discount.totalSavings ?? 0 }}€</span>
        </div>
        <div class="py-10">
          <label for="promo" class="font-semibold inline-block mb-3 text-sm uppercase"
            >Promo Code</label
          >
          <div class="flex my-3" v-for="(voucher, index) in state.vouchers" :key="index">
            <div class="flex items-center h-5">
              <input
                :disabled="!voucher.status"
                id="helper-radio"
                aria-describedby="helper-radio-text"
                type="radio"
                :value="voucher.code"
                :checked="voucher.status ? (voucher.code === selectedVoucher) : false"
                @change="handleRadioChange(voucher.code)"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="ml-2 text-sm">
              <label
                :class="!voucher.status ? 'text-gray-400' : 'text-gray-900'"
                for="helper-radio"
                class="font-medium"
                >{{ voucher.code }} (Savings: {{ voucher.savings }})</label>
              <p id="helper-radio-text" class="text-xs font-normal text-gray-500">
                {{ voucher.label }}
              </p>
            </div>
          </div>
        </div>
        <div class="border-t mt-8">
          <div class="flex font-semibold justify-between py-6 text-sm uppercase">
            <span>Total cost</span>
            <span>{{ state.grandTotal ?? 0 }}€</span>
          </div>
          <button
            class="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
    <div
      id="alert-border-5"
      class="flex items-center p-4 border-t-4 border-gray-300 bg-gray-50"
      role="alert"
      v-else
    >
      <svg
        class="flex-shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
        />
      </svg>
      <div class="ml-3 text-sm font-medium text-gray-800">
        Please add items first to see the checkout section.
        <a @click="$router.push('/')" class="font-semibold text-indigo-600 cursor-pointer"
          >Continue Shopping</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, reactive } from 'vue'
import { debounce } from 'lodash'

import { useCart } from '../stores/cart'

const cart = useCart()
const bouquets = ref([])
const selectedVoucher = ref('')

// Back-end base url
const baseUrl = import.meta.env.VITE_BASE_URL;

const state = reactive({
  showAlert: false,
  message: '',

  subTotal: 0,
  grandTotal: 0,

  convenienceFee: {
    deliveryFee: 0,
    packagingFee: 0,
    saleTax: 0
  },

  discount: {
    totalSavings: 0
  },

  cartItems: [],
  vouchers: []
})

// To hide alert
const initialState = () => {
  state.showAlert = false
}

// To get the applied voucher code
const handleRadioChange = (code) => {
  selectedVoucher.value = code
  applyVoucher()
}

// To get cart details
const getCart = async () => {
  const cartResponse = await axios.get(baseUrl + '/cart')
  const responseData = cartResponse.data.data

  state.cartItems = responseData.cart.cart_items
  state.vouchers = responseData.voucher

  state.convenienceFee.deliveryFee = responseData.cart.convenience_fee.delivery_fee
  state.convenienceFee.packagingFee = responseData.cart.convenience_fee.packaging_fee
  state.convenienceFee.saleTax = responseData.cart.convenience_fee.sale_tax

  state.discount.totalSavings = responseData.cart.discount.total_savings

  state.grandTotal = responseData.cart.grand_total

  state.vouchers.forEach(function(voucher) {
    if (voucher.is_applied) {
      selectedVoucher.value = voucher.code 
    }
  })

  cart.updateTotal(state.cartItems.length ?? 0)
}

// To get the product total
const productTotal = (quantity, price) => {
  const parsedQuantity = Number(quantity)
  const parsedPrice = Number(price)
  return isNaN(parsedQuantity) || isNaN(parsedPrice) ? 0 : parsedQuantity * parsedPrice
}

// To get the sub total of the all cart item products
const subTotal = () => {
  let productTotals = []

  state.cartItems.forEach(function (cartItem) {
    productTotals.push(productTotal(cartItem.quantity, cartItem.product.price))
  })

  return productTotals.reduce((total, num) => total + num, 0)
}

// To remove the product from the cart
const removeFromCart = async (id) => {
  await axios.post(baseUrl + '/cart/remove', {
    product_id: id
  })

  getCart()
}

// debounce while changing the product quantity
const debouncedUpdateQuantity = debounce((id, quantity) => {
  updateQuantity(id, quantity)
}, 400)


// To update the product quantity and update the cart based on that
const updateQuantity = async (id, quantity) => {
  const cartResponse = await axios.post(baseUrl + '/cart/add', {
    product_id: id,
    quantity
  })

  if (cartResponse.data.status) {
    state.showAlert = true
    state.message = 'Cart updated successfully.'
    
    setTimeout(initialState, 3000)
  }

  getCart()
}

// To apply the selected voucher
const applyVoucher = async () => {
  const response = await axios.post(baseUrl + '/cart/voucher/apply', {
    code: selectedVoucher.value
  })

  if (response.data.status) {
    state.showAlert = true
    state.message = 'Voucher applied successfully.'
    
    setTimeout(initialState, 3000)
  }

  getCart()
}

// Mounted
onMounted(async () => {
  try {
    getCart()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>
