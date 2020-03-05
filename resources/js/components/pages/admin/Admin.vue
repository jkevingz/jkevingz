<template>
  <v-card width="100%" height="100%">
    <v-card-title>
      <v-tabs right slider-color="indigo">
          <v-tab to="users">Users</v-tab>
          <v-tab to="products">Products</v-tab>
      </v-tabs>
    </v-card-title>
    <v-container>
      <router-view></router-view>
    </v-container>
  </v-card>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';

    @Component({
      
    })
    export default class extends Vue {
    };
</script>
