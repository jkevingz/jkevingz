<template>
  <v-card class="mx-auto product-card" max-width="374">
    <v-img height="135" src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg"></v-img>

    <v-card-title>{{ product.name }}</v-card-title>

    <v-card-text>
      <div class="my-4 subtitle-1">$ {{ product.price }} </div>

      <div class="text-no-wrap text-truncate">{{ product.description || 'No description' }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="indigo lighten-2" text @click="onAddToCart" v-if="!product.inCart">
        <v-icon>mdi-cart-plus</v-icon> Add
      </v-btn>
      <v-btn color="red lighten-2" text @click="onRemoveFromCart" v-if="product.inCart">
        <v-icon>mdi-cart-remove</v-icon> Remove
      </v-btn>
    </v-card-actions>
  </v-card>   
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';    
  import { Product } from '../../../data/Product';
  import { mapGetters, mapActions } from 'vuex';

  @Component({
    props: {
        product: Product,
    },
    methods: mapActions('cart', ['addProductId', 'removeProductId'])
  })
  export default class extends Vue {

    /**
     * The product to render in this component.
     */
    product!: Product;

    /**
     * The store method to add a new product to the cart.
     */
    addProductId!: (id: number) => void;
    
    /**
     * The store method to remove a product from the cart.
     */
    removeProductId!: (id: number) => void;

    /**
     * Callback for adding a new product.
     */
    onAddToCart() {
      this.product.inCart = true;
      this.$emit('productAdded');
      this.addProductId(this.product.id);
    }

    /**
     * Callback for removing a product.
     */
    onRemoveFromCart() {
      this.product.inCart = false;
      this.$emit('productRemoved');
      this.removeProductId(this.product.id);
    }

  };
</script>

<style scoped>
  .product-card {
    transition: all .3s ease;
  }

  .product-card:hover {
    transform: scale(1.05);
    border: 1px solid orangered;
  }
</style>
