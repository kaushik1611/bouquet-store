<template>
  <Header
    :logo="'https://theflowercompany.net/cdn/shop/files/Untitled-design-74_690x.png?v=1613232505'"
  />
  <RouterView />
  <Footer />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from '../src/components/Header.vue'
import Footer from '../src/components/Footer.vue'
</script>
