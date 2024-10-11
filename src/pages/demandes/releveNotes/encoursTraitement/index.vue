<template>
  <section>
<p class="text-h6">Demandes de relevés de notes </p>

    <VCard id="annee-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-6">
       
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION Table -->
      <vue-good-table
        v-on:selected-rows-change="selectionChanged"
        :columns="columns"
        :rows="dataListeBachelier"
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
       <template >
          <div v-if="props.column.field === 'actions'">
            <div class="actions-wrapper">
              <v-chip :style="{ 'font-size': '15px', 'height': '20px' }" color="green" variant="tonal">
                <router-link :to="{ name: 'accepte-Demande', params: { id: props.row.id } }">
                  <v-icon small flat color="green">mdi-check</v-icon> Accepte
                </router-link>
              </v-chip>
            </div>
          </div>
        </template>
        <template #table-row="props">
        <span v-if="props.column.field == 'statut'">
            <v-chip 
              :style="{ 
                'font-size': '15px', 
                'height': '20px', 
                'background-color': etatCouleurs[props.row.statut], 
                'color': 'white' 
              }" 
              variant="flat"
            >
              <span>{{ props.row.statut }}</span>
            </v-chip>
        </span>
          <div v-if="props.column.field === 'actions'">
            <div class="actions-wrapper">
            <router-link :to="{ name: 'apps-bachelier-preview-id', params: { id: props.row.id } }"> <v-icon small flat class="green">mdi-eye</v-icon> </router-link>
            <router-link :to="{ name: 'apps-bachelier-edit-id', params: { id: props.row.id } }" class="ml-4"> <v-icon small flat class="yelow">mdi-pencil</v-icon> </router-link>
            <v-dialog transition="dialog-top-transition" width="50%" height="auto">
              <template v-slot:activator="{ props }">
                <v-btn variant="text"  class="text" v-bind="props">
                  <v-icon small flat class="red">mdi-delete</v-icon>
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
      <!-- Confirmation Dialog for Update -->
      <v-dialog v-model:active="updateDialogActive" transition="dialog-top-transition" width="50%" height="auto">
        <template v-slot:activator="{ props }">
          <!-- You can use a button to trigger this dialog -->
        </template>
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-toolbar color="primary" title="Confirmation de Mise à Jour"></v-toolbar>
            <v-card-text>
              <div class="text-h6">Êtes-vous sûr de vouloir mettre à jour les demandes sélectionnées ?</div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn variant="text" color="primary" @click="updateDialogActive = false">Annuler</v-btn>
              <v-btn variant="outlined" color="black" @click="updateDemandes; updateDialogActive = false">Oui</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

    </VCard>
  </section>
</template>

<script setup>
import { ref, computed, watchEffect,onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from "pinia";
import { useReleveStore } from '@/views/demandes/releve/store'

const releveStore = useReleveStore()
const {loading,columns,dataListeBachelier,etatCouleurs } = storeToRefs(releveStore);
const { encours, destroy } = releveStore;
onMounted(()=>{
  encours();
});
</script>

<style lang="scss" >

.red{
    color: red;
}

.green{
    color: green;
}

.yelow{
    color: #F57F17;
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
