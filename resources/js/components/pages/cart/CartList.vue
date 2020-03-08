<template>
  <v-card height="100%" width="100%">
    <v-card-title>
      Summary
    </v-card-title>

    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Units</th>
              <th class="text-left">Price</th>
              <th class="text-left">Total</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in cartProducts" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.cartUnits }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.price * product.cartUnits }}</td>
              <td>
                <v-btn icon x-small @click="onAddUnit(product)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn icon x-small @click="onSubstractUnit(product)" :disabled="product.cartUnits < 2">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-btn icon x-small @click="onRemoveFromCart(product)">
                  <v-icon>mdi-cart-minus</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>

    <v-card-actions class="mr-8">
      <v-spacer></v-spacer>
      Total: ${{ total }}
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { mapActions, mapGetters } from 'vuex';
  import { Product } from '../../../data/Product';

  @Component({
    computed: mapGetters('cart', ['productIds', 'cartProducts']),
    methods: mapActions('cart', [
      'fetchProductIds', 
      'fetchCartProducts', 
      'addProductUnit', 
      'substractProductUnit',
      'removeProductId',
      ]),
  })
  export default class extends Vue {
    
    /**
     * The products in the cart.
     */
    cartProducts!: Product[];

    /**
     * The products that we have in local storage.
     */
    productIds!: number[];

    /**
     * Call the api to get the products info.
     */
    fetchCartProducts!: (ids?: number[]) => Promise<void>;

    /**
     * Call the storage to get the products in the cart.
     */
    fetchProductIds!: () => Promise<void>;

    /**
     * Add a unit to a product in the cart.
     */
    addProductUnit!: (id: number) => void;

    /**
     * Substract a unit from the product in the cart.
     */
    substractProductUnit!: (id: number) => void;

    /**
     * Remove the product from the cart.
     */
    removeProductId!: (id: number) => void;

    /**
     * Get products when the component is created.
     */
    created() {
      this.fetchProductIds().then(() => this.fetchCartProducts(this.productIds));
    }

    get total() {
      let total = 0;
      this.cartProducts.forEach(product => {
        total += product.cartUnits * product.price;
      });

      return total;
    }

    /**
     * Add a unit to the given product.
     */
    onAddUnit(product: Product): void {
      product.cartUnits++;
      this.addProductUnit(product.id);
    };

    /**
     * Substract a unit from the given product.
     */
    onSubstractUnit(product: Product): void {
      product.cartUnits--;
      this.substractProductUnit(product.id);
    };

    /**
     * Remove the given product from the cart.
     */
    onRemoveFromCart(product: Product): void {
      this.removeProductId(product.id);
    };

  };
</script>
