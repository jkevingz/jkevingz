<template>
  <div style="width: 100% ;height: 100%">
    <v-text-field v-model="queryText" label="Find your product" solo prepend-inner-icon="mdi-magnify"></v-text-field>

    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" xl="2"
        v-for="product in filteredProducts" :key="product.id">
        <jkevingz-product :product="product" 
          @productAdded="showSnackbar('Product Added!')" @productRemoved="showSnackbar('Removed :c')">
        </jkevingz-product>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="3000"> {{ snackbarText }} </v-snackbar>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { mapActions, mapGetters } from 'vuex';
  import ProductComponent from './Product.vue';
  import { Product } from '../../../data/Product';

  @Component({
    components: {
      'jkevingz-product': ProductComponent,
    },
    computed: mapGetters('product', ['products']),
    methods: mapActions('product', ['fetchProducts']),
  })
  export default class extends Vue {

    /**
     * A list of products to display on the data table. 
     */
    products!: Product[];

    /**
     * Fetch the products from the api.
     */
    fetchProducts!: () => Promise<void>;  

    /**
     * The query text string to filter the products by.
     */
    queryText: string = '';

    /**
     * The boolean to display the snackbar.
     */
    snackbar: boolean = false;

    /**
     * The text to display on the snackbar.
     */
    snackbarText: string = '';

    /**
     * The product list filtered by the query text set by the user.
     */
    get filteredProducts() {
      return this.products.filter(product => {
        return product.name.toLowerCase().indexOf(this.queryText.toLowerCase()) !== -1;
      });
    }

    /**
     * Fetch all products on component creation.
     */
    created() {
      this.fetchProducts();
    }

    /**
     * Displays the snackbar with the given message.
     */
    showSnackbar(message: string): void {
        this.snackbarText = message;
        this.snackbar = true;
    }

  };
</script>
