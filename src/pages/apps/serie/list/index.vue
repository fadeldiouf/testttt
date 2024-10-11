<template>
  <section>


    <VCard id="annee-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-6">
          <!-- 👉 Create annee -->
          <VBtn :to="{ name: 'apps-serie-add' }">
            Create Serie
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION Table -->
      <vue-good-table
        :columns="columns"
        :rows="dataListeSerie"
        styleClass="vgt-table condensed"
       :pagination-options="{
          enabled: true,
          nextLabel: 'suivant',
          prevLabel: 'précedant',
          rowsPerPageLabel: 'Lignes par page',
          ofLabel: 'sur',
          pageLabel: 'page', // for 'pages' mode
          allLabel: 'Tous',
        }"
        :select-options="{ enabled: true }"
        :search-options="{ enabled: true }"
        mode="local"
      >
        <template #table-row="props">
          <div v-if="props.column.field === 'actions'">
            <div class="actions-wrapper">
            <router-link :to="{ name: 'apps-serie-preview-id', params: { id: props.row.id } }"> <v-icon small flat >mdi-eye</v-icon> </router-link>
            <router-link :to="{ name: 'apps-serie-edit-id', params: { id: props.row.id } }" class="ml-4"> <v-icon small flat >mdi-pencil</v-icon> </router-link>
            <v-dialog transition="dialog-top-transition" width="50%" height="auto">
              <template v-slot:activator="{ props }">
                <v-btn variant="text"  class="text" v-bind="props">
                  <v-icon small flat >mdi-delete</v-icon>
              </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-toolbar color="primary" :title="$t('apps.forms.user.user')"></v-toolbar>
                  <v-card-text>
                    
                    <div class="text-h6">{{ $t('apps.forms.delteMessage') }}</div>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" color="primary" @click="isActive.value = false">{{ $t('apps.forms.annuler') }}</v-btn>
                    <v-btn variant="outlined" color="black"  @click="del(props.row.id);isActive.value = false">{{ $t('apps.forms.oui') }}</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
          </div> 
        </template>
      </vue-good-table>
      <!-- !SECTION -->

    </VCard>
  </section>
</template>

<script setup>
import { useSerieStore } from '@/views/apps/serie/store';
import { storeToRefs } from "pinia";
import { onMounted } from 'vue';

const serieStore = useSerieStore()
const {loading,columns,dataListeSerie } = storeToRefs(serieStore);
const { all, destroy } = serieStore;
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
