<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link to="/store">
          <v-list-item-action>
            <v-icon>mdi-cash</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Store</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/cart">
          <v-list-item-action>
            <v-icon>mdi-cart-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Cart</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-subheader inset>Admin</v-subheader>
        <v-list-item link to="/admin/users">
          <v-list-item-action>
            <v-icon>mdi-account-group-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/admin/products">
          <v-list-item-action>
            <v-icon>mdi-storefront</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Products</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
    </v-app-bar>
    

    <v-content>
      <v-container class="fill-height" fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({
    computed: {
      pageTitle: function (): string {
        return this.$route.meta.title || 'Store';
      },
    },
  })
  export default class extends Vue {

    /**
     * The boolean to toggle the drawer. This needs to be initially null so
     * the component will determine its value based on the screen resolution.
     */
    drawer: boolean|null = null;

  };
</script>
