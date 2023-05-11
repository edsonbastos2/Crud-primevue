<template>
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <Button
          label="Novo usuário"
          icon="pi pi-plus"
          severity="success"
          class="mr-2"
          @click="openNew"
        />
      </template>
    </Toolbar>
    <DataTable :value="users" responsiveLayout="stack">
      <Column field="id" header="ID"></Column>
      <Column field="avatar" header="Foto">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <img
              :alt="data.first_name"
              :src="data.avatar"
              :class="`flag flag-${data.id}`"
              style="width: 24px"
            />
          </div>
        </template>
      </Column>
      <Column field="first_name" header="Nome"></Column>
      <Column field="email" header="email"></Column>
      <Column header="Ação" style="min-width: 8rem">
        <template #body="{ data }">
          <div style="display: flex; gap: 20px">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="ml-2"
              @click="editProduct(data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              class="mr-2"
              severity="danger"
              @click="deleteUser(data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

    <Dialog
        v-model:visible="userDialog"
        :style="{width: '700px'}"
        header="Detalhes do Usuário"
        :modal="true" class="p-fluid"
    >
        <div class="field">
            <label for="name">Nome</label>
            <InputText id="name" v-model.trim="user.first_name" required="true" autofocus :class="{'p-invalid': submitted && !user.first_name}" />
            <small class="p-error" v-if="submitted && !user.first_name">Name is required.</small>
        </div>
        <div class="field">
            <label for="name">Sobrenome</label>
            <InputText id="name" v-model.trim="user.last_name" required="true" autofocus :class="{'p-invalid': submitted && !user.last_name}" />
            <small class="p-error" v-if="submitted && !user.last_name">Name is required.</small>
        </div>

        <div class="field">
            <label for="description">E-mal</label>
            <InputText id="email" v-model.trim="user.email" required="true" autofocus :class="{'p-invalid': submitted && !user.email}" />
            <small class="p-error" v-if="submitted && !user.email">Job is required.</small>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" text @click="saveUser" />
        </template>
    </Dialog>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext"
import Dialog from 'primevue/dialog';
import { api } from "../../service";

export default {
  name: "HomeTable",
  components: {
    DataTable,
    Column,
    Button,
    Toolbar,
    InputText,
    Dialog
  },
  data() {
    return {
      users: [],
      user: {},
      userDialog: false,
      submitted: false,
    };
  },
  computed: {
    createId() {
        const id = this.users.length + 1
        return id
    }
  },
  created() {
    this.getAllUsers();
  },
  methods: {
    async getAllUsers() {
      try {
        const { data } = await api.get("/users");
        this.users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [...data.data];
      } catch (error) {
        throw new Error("Erro na requisição");
      }
    },
    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    },
    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    },
    async saveUser() {
        this.submitted = true
        if(this.user.id && this.user.first_name && this.user.last_name) {

            const userObjct = {
              first_name: this.user.first_name,
              last_name: this.user.last_name,
              email: this.user.email,
              avatar: this.user.avatar
            }

            const resp = await api.put(`/users/${this.user.id}`, userObjct)
            const index = this.users.findIndex((item) => item.id === this.user.id)
            this.users[index] = {...resp.data, id: this.user.id}
            localStorage.setItem('users',JSON.stringify(this.users))
            this.userDialog = false;
            return;
        }else {
          try {
              if(!this.user.first_name && !this.user.last_name) return;
              this.user.avatar = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png' 
              const resp = await api.post('/users', this.user)
              this.users.unshift(resp.data)
              localStorage.setItem('users',JSON.stringify(this.users))
              this.clearForm()
              this.userDialog = false;
          } catch (error) {
              throw new Error('Erro na requisição')
          }
        }
    },
    async deleteUser(id) {
        try {
            await api.delete(`/users/${id}`)
            this.users = this.users.filter(item => item.id !== id)
            localStorage.setItem('users',JSON.stringify(this.users))
        } catch (error) {
            throw new Error('Erro na requisição')
        }
    },

    async editProduct(data) {
      this.userDialog = true
      this.user = {...data}
    },
    clearForm() {
        this.user = {}
    }
  },
};
</script>

<style>
</style>