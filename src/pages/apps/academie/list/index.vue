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
      :items="dataListeAcademie "
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
<script setup>
import { ref, computed, watchEffect,onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from "pinia";
import { useAcademieStore } from '@/views/apps/academie/store'

const acdemieStore = useAcademieStore()
const {loading,headerTable,dataListeAcademie } = storeToRefs(acdemieStore);
const { all, destroy } = acdemieStore;
const search = ref('')
onMounted(()=>{
  all();
});
</script>

<style lang="scss">
#annee-list {
  .annee-list-actions {
    inline-size: 8rem;
  }

  .annee-list-search {
    inline-size: 12rem;
  }
}

.red {
  color: red;
}

.green {
  color: green;
}

.yelow {
  color: #f57f17;
}

.small-select {
  margin-block: auto;

  .v-field__input {
    align-items: center;
    padding: 2px;
    font-size: 14px;
  }

  .v-field__append-inner {
    align-items: center;
    padding: 0;
    margin-inline-start: -2.5rem;

    .v-icon {
      margin-inline-start: 0 !important;
    }
  }
}
</style>
