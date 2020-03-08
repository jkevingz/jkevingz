<template>
  <v-card height="100%" width="100%">
    <v-card-title>
      Billing Details
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">
        <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>

        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

        <v-text-field v-model="card" :rules="cardRules" label="Card Number" required ></v-text-field>

        <v-btn :disabled="!valid" color="success" class="mr-4" type="submit">
          Submit
        </v-btn>

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { mapActions } from 'vuex';

  @Component({
    methods: mapActions('cart', ['clearCart']),
  })
  export default class extends Vue {

    /**
     * The name of the customer.
     */
    name: string = '';

    /**
     * The email of the customer.
     */
    email: string = '';

    /**
     * The card of the costumer.
     */
    card: string = '';

    /**
     * Rules for name validation.
     */
    nameRules = [
      (v: string) => !!v || 'Name is required',
    ];

    /**
     * Rules for email validation.
     */
    emailRules = [
      (v: string) => !!v || 'E-mail is required',
      (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ];

    /**
     * Rules for card validation.
     */
    cardRules = [
      (v: string) => !!v || 'Card is required',
      (v: string) => (v && v.length === 16) || 'Card must be 16 characters',
    ];

    /**
     * Whether the form is valid.
     */
    valid: boolean = false;

    /**
     * Empty the cart for current user.
     */
    clearCart!: () => void;

    onSubmit(): void {
      const form: any = this.$refs.form;
      if (form.validate()) {
        // @todo: Actually do something with this info. c:
        this.name = '';
        this.email = '';
        this.card = '';
        form.reset();
        this.clearCart();
        this.$emit('formSubmitted');
      }
    }

  };
</script>