<template>
  <v-row style="height: 100%">
    <v-col cols="12" v-if="alert">
      <v-alert type="success">
        Thank you purchase! You will receive an email with further details.
        <template slot="close">
          <v-btn icon x-small @click="alert = false"><v-icon>mdi-close</v-icon></v-btn>
        </template>
      </v-alert>
    </v-col>
    <v-col md="7" style="height: 100%">
      <jkevingz-cart-list></jkevingz-cart-list>
    </v-col>
    <v-col md="5">
      <jkevingz-cart-form @formSubmitted="alert = true"></jkevingz-cart-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import CartList from './CartList.vue';
  import CartForm from './CartForm.vue';

  @Component({
    components: {
      'jkevingz-cart-list': CartList,
      'jkevingz-cart-form': CartForm
    },
  })
  export default class extends Vue {

    /**
     * Whether show the alert.
     */
    alert: boolean = false;

  };
</script>