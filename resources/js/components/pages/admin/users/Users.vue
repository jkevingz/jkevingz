<template>
  <!-- @todo: This component is too large, break this down into displaying, 
    removing, updating, and creating data. -->
  <div>
      <!-- Fab button to create a new item. -->
      <v-btn large fab bottom right fixed color="primary" dark class="mb-2" @click="onCreate()">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn> 

      <!-- Data table to show all items. -->
      <v-data-table :headers="headers" :items="users" class="elevation-1">
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="onEdit(item)">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="deletedUser = item; confirmationDialog = true;">mdi-delete</v-icon>
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
                    <!-- @todo: Better rules managing (create a rules object
                      property in the script, and match the rules against the
                      ones in the API) -->
                    <v-col cols="12" sm="6">
                      <v-text-field :rules="[v => !!v || 'Name is required']" v-model="formUser.name" label="Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field :rules="[
                      v => !!v || 'E-mail is required',
                      v => /.+@.+\..+/.test(v) || 'E-mail must be valid']" 
                      v-model="formUser.email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" v-if="formUser.isNew()">
                      <v-text-field :rules="[v => !!v || 'Password is required']" type="password" 
                        v-model="formUser.password" label="Password"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" v-if="formUser.isNew()">
                      <v-text-field :rules="[v => !!v || 'Password confirmation is required']" type="password" 
                        v-model="formUser.password_confirmation" label="Password Confirmation">
                      </v-text-field>
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
              <v-btn color="indigo" text @click="dialog = false;">Cancel</v-btn>
              <v-btn type="submit" color="indigo" text>Save</v-btn>
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
            <v-btn color="red" text @click="onDelete(deletedUser)">Continue</v-btn>
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
    import { User } from '../../../../data/User';
    import { AxiosResponse } from 'axios';

    @Component({
      computed: mapGetters('user', ['users']),
      methods: mapActions('user', ['fetchUsers', 'addUser', 'editUser', 'deleteUser']),
    })
    export default class extends Vue {

      /**
       * A list of users to display on the data table. 
       */
      users!: User[];

      /**
       * Fetch the users from the api.
       */
      fetchUsers!: () => Promise<void>;

      /**
       * Add a new user to the database.
       */
      addUser!: (user: User) => Promise<void>;

      /**
       * Edit a user in the databse.
       */
      editUser!: (user: User) => Promise<void>;

      /**
       * Delete a user from the database.
       */
      deleteUser!: (user: User) => Promise<void>;

      /**
       * Toggle boolean for form dialog.
       */
      dialog: boolean = false;

      /**
       * Toggle boolean for confirmation dialog.
       */
      confirmationDialog: boolean = false;

      /**
       * The user that the dialog form will work with.
       */
      formUser: User = new User();

      /**
       * The user to be deleted. This needs to be in the global scope as the
       * dialog confirmation for will not know about the user otherwise.
       */
      deletedUser: User = new User();

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
       * The table headers.
       * - ID: The unique identifier of the product.
       * - Name: The name of the product.
       * - Email: The email the user logs in with.
       * - Actions: The actions to perform on the product (edit and delete).
       */
      headers = [
        { text: 'ID', value: 'id'},
        { text: 'Name', value: 'name'},
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Actions', value: 'action', sortable: false },
      ];

      /**
       * The form dialog title. This will depend on the value returned by isNew
       * method in the form user object.
       */
      get formTitle(): string {
        return this.formUser.isNew() ? 'Add a new user' : 'Edit your user';
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
       * Fetch all users when this component is created.
       */
      created(): void {
        this.fetchUsers();
      }

      /**
       * Open up the modal to edit a user, and set the form item to have the
       * properties the new item has.
       */
      onEdit(user: User): void {
        this.resetForm();
        // Clone user object to avoid updating the user in the table.
        this.formUser = User.createSingleFromResponse(user);
        this.dialog = true;
        
      }

      /**
       * Callback for confirmation form. This will call the store to delete the
       * given item.
       */
      onDelete(user: User): void {
        // No feedback expected from the api. If there are errors, they'll be
        // handled in the store.
        this.deleteUser(user);

        this.confirmationDialog = false;
        this.showSnackbar('User was deleted successfully.');
      }

      /**
       * Open up the modal to create a new user, and reset the form user object.
       */
      onCreate(): void {
        this.formUser = new User();
        this.dialog = true; 
        this.resetForm();
      }
      
      /**
       * Callback for dialog form. This will either update the user or create a
       * new one depending on the current action.
       */
      onSave(): void {
        if (!this.validateForm()) {
          return;
        }

        this.formUser.isNew() ? this.callSave() : this.callUpdate();
      }

      /**
       * Call the store the add a new user.
       */
      async callSave(): Promise<void>{
        try {
          await this.addUser(this.formUser);
          this.dialog = false;
          this.showSnackbar('User was successfully created.');
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
          await this.editUser(this.formUser);
          this.dialog = false;
          this.showSnackbar('User was successfully updated.');
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
