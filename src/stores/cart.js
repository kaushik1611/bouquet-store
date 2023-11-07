import { defineStore } from "pinia";

export const useCart = defineStore("cart", {
    state: () => ({
        total: 0,
        cartItems: [],
    }),
    actions: {
        updateTotal(total) {
            this.total = total;
        },
    },
});

