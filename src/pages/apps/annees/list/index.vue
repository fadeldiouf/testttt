<script setup>

import { useAnneeStore } from '@/views/apps/annees/store';
import { storeToRefs } from "pinia";
import { onMounted } from 'vue';

const anneesStore = useAnneeStore()
const {loading,headerTable,dataListe } = storeToRefs(anneesStore);
const { all, destroy } = anneesStore
const search = ref('')
onMounted(()=>{
  all();
});
</script>

<template>
  
  <div>
    <VCardText class="pt-0">
      <VRow>
        <VCol
          cols="12"
          offset-md="8"
          md="4"
        >
          <AppTextField
            v-model="search"
            placeholder="Search ..."
            append-inner-icon="bx-search"
            single-line
            hide-details
            dense
            outlined
          />
        </VCol>
      </VRow>
    </VCardText>
    <VSheet class="pa-4 sheet text-center" color="orange lighten-1" dark>
      <VCardTitle>Liste des années</VCardTitle>
    </VSheet>
    <!-- 👉 Data Table  -->
    <VDataTable
      :headers="headerTable"
      :items="dataListe"
      :search="search"
       density="compact"
      :items-per-page="5"
      class="text-no-wrap"
    >
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <IconBtn @click="editItem(item)">
            <VIcon class="icon-edit" icon="bx-edit" />
          </IconBtn>
          <IconBtn @click="deleteItem(item)">
            <VIcon class="icon-delete" icon="bx-trash" />
          </IconBtn>
        </div>
      </template>
    </VDataTable>
  </div>
</template>

<style scoped>
.icon-edit {
  color: deepskyblue; /* Couleur pour l'icône d'édition */
}

.icon-delete {
  color: red;
}
</style>
