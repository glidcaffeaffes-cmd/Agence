<template>
  <div>
    <h2>Partners Management</h2>
    
    <div style="margin-bottom: 20px; border: 1px solid #000; padding: 10px;">
      <h3>Add New Partner</h3>  
      <form @submit.prevent="handleAdd">
        <div style="margin-bottom: 10px;">
          <label>Name: </label>
          <input type="text" v-model="newPartner.name" required />
        </div>
        <div style="margin-bottom: 10px;">
          <label>Contact Email: </label>
          <input type="email" v-model="newPartner.contactEmail" required />
        </div>
        <button type="submit">Add Partner</button>
      </form>
    </div>

    <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Contact Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="partner in store.partners" :key="partner.id">
          <td>{{ partner.id }}</td>
          <td>{{ partner.name }}</td>
          <td>{{ partner.contactEmail }}</td>
          <td>
            <button @click="handleDelete(partner.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAgencyStore } from '~/stores/agency'

definePageMeta({
  layout: 'admin'
})

const store = useAgencyStore()

const newPartner = ref({
  name: '',
  contactEmail: ''
})

const handleAdd = () => {
  store.addPartner({
    id: Date.now(),
    name: newPartner.value.name,
    contactEmail: newPartner.value.contactEmail
  })
  newPartner.value.name = ''
  newPartner.value.contactEmail = ''
}

const handleDelete = (id: number) => {
  store.deletePartner(id)
}
</script>
