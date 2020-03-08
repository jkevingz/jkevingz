<template>
  <div>
      <!-- Fab button to create a new item. -->
      <v-btn large fab bottom right fixed color="primary" dark class="mb-2" @click="onCreate()">
        <v-icon>mdi-qrcode-plus</v-icon>
      </v-btn> 

      <!-- Data table to show all items. -->
      <v-data-table :headers="headers" :items="products" class="elevation-1">
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="onEdit(item)">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="deletedProduct = item; confirmationDialog = true;">mdi-delete</v-icon>
        </template>

        <!-- No results found slot. -->
        <template v-slot:no-data>
          No results found :c
        </template>
      </v-data-table>

      <!-- Form dialog to edit or create an item. -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-form @submit.prevent="onSave" ref="form">
          <v-card>
            <v-card-title><span class="headline">{{ formTitle }}</span></v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="formProduct.name" 
                      :rules="[v => !!v || 'Name is required']" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="formProduct.price" 
                    :rules="[v => !!v || 'Price is required']" prefix="$" label="Price"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="formProduct.description" label="Description"></v-textarea>
                  </v-col>
                </v-row>
              </v-container>

              <v-alert v-if="errors.length" border="right" colored-border type="error" elevation="2" >
                The following data is invalid:
                <ul>
                  <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
            </v-alert>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="indigo" text @click="dialog = false">Cancel</v-btn>
              <v-btn color="indigo" text type="submit">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

      <!-- The confirmation dialog for deleting an item. -->
      <v-dialog v-model="confirmationDialog" width="500">
        <v-card>
          <v-card-title>Are you sure you want do continue?</v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo" text @click="confirmationDialog = false">No</v-btn>
            <v-btn color="red" text @click="onDelete(deletedProduct)">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar" :timeout="3000"> {{ snackbarText }} </v-snackbar>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { mapGetters, mapActions } from 'vuex';
  import { Product } from '../../../../data/Product';

  @Component({
    computed: mapGetters('product', ['products']),
    methods: mapActions('product', ['fetchProducts', 'addProduct', 'editProduct', 'deleteProduct']),
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
     * Add a new product to the database.
     */
    addProduct!: (product: Product) => Promise<void>;

    /**
     * Edit a product in the databse.
     */
    editProduct!: (product: Product) => Promise<void>;

    /**
     * Delete a product from the database.
     */
    deleteProduct!: (product: Product) => Promise<void>;

    /**
     * Toggle boolean for form dialog.
     */
    dialog: boolean = false;

    /**
     * Toggle boolean for confirmation dialog.
     */
    confirmationDialog: boolean = false;

    /**
     * The product that the dialog form will work with.
     */
    formProduct: Product = new Product();

    /**
     * The product to be deleted. This needs to be in the global scope as
     * the dialog confirmation for will not know about the product otherwise.
     */
    deletedProduct: Product = new Product();

    /**
     * The table headers.
     * - ID: The unique identifier of the product.
     * - Name: The name of the product.
     * - Price: The price of the product.
     * - Slug: The slug based on the product name.
     * - Description: The product's description.
     * - Actions: The actions to perform on the product (edit and delete).
     */
    headers = [
      { text: 'ID', value: 'id'},
      { text: 'Name', value: 'name'},
      { text: 'Price', value: 'price'},
      { text: 'Slug', value: 'slug', sortable: false},
      { text: 'Description', value: 'description', sortable: false },
      { text: 'Actions', value: 'action', sortable: false },
    ];

    /**
     * The errors when calling the api.
     */
    errors: string[] = [];

    /**
     * The boolean to display the snackbar.
     */
    snackbar: boolean = false;

    /**
     * The text to display on the snackbar.
     */
    snackbarText: string = '';

    /**
     * The form dialog title. This will depend on the isNew value returned by
     * the form product.
     */
    get formTitle(): string {
      return this.formProduct.isNew() ? 'Add a new product' : 'Edit your product';
    };
    
          /**
     * Returns the form element.
     */
    form(): any {
      return this.$refs.form;
    }
    
    /**
     * Reset the form if set.
     */
    resetForm(): void {
      this.errors = [];
      if (this.form()) {
        this.form().resetValidation();
      }
    }

    /**
     * Validate the form if set.
     */
    validateForm(): boolean {
      this.errors = [];
      if (this.form()) {
        return this.form().validate();
      }

      return false;
    }

    /**
     * Fetch all products when this component is created.
     */
    created(): void {
      this.fetchProducts();
    }

    /**
     * Open up the modal to edit a product, and set the form item to have the
     * properties the new item has.
     */
    onEdit(product: Product): void {
      this.formProduct = Product.createSingleFromResponse(product);
      this.dialog = true;
    }

    /**
     * Callback for confirmation form. This will call the store to delete the
     * given item.
     */
    onDelete(product: Product): void {
      // No feedback expected from the api. If there are errors, they'll be
      // handled in the store.
      this.deleteProduct(product);
      
      this.confirmationDialog = false;
      this.showSnackbar('User was deleted successfully.');
    }

    /**
     * Open up the modal to create a new product, and set the form product as
     * a new one.
     */
    onCreate() {
      this.formProduct = new Product();
      this.dialog = true; 
    }

    
    /**
     * Callback for dialog form. This will either update the product or create
     * a new one depending on the current action.
     */
    onSave(): void {
      if (!this.validateForm()) {
        return;
      }

      this.formProduct.isNew() ? this.callSave() : this.callUpdate();
    }

    /**
     * Call the store the add a new user.
     */
    async callSave(): Promise<void>{
      try {
        await this.addProduct(this.formProduct);
        this.dialog = false;
        this.showSnackbar('Product was successfully created.');
      } 
      catch (error) {
        this.handleError(error);
      }
    }

    /**
     * Call the store to update a user.
     */
    async callUpdate() {
      try {
        await this.editProduct(this.formProduct);
        this.dialog = false;
        this.showSnackbar('Product was successfully updated.');
      } 
      catch (error) {
        this.handleError(error);
      }
    }

    /**
     * Handles the errors. This will basically just set the errors variables
     * with the given error response data.
     */
    handleError(error: any): void {
      const fields = Object.keys(error.response.data.errors);
      fields.forEach((field: string) => {
        error.response.data.errors[field].forEach((errorMessage: string) => {
          this.errors.push(errorMessage);
        });
      });
    }

    /**
     * Displays the snackbar with the given message.
     */
    showSnackbar(message: string): void {
        this.snackbarText = message;
        this.snackbar = true;
    }
  }
</script>
