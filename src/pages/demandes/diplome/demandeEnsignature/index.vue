<template>
  <section>
<p class="text-h6">Diplômes en attente de signature</p>

    <VCard id="annee-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-6">
        <div class="bg-green">
          
        </div>
       <v-btn class="text-right" color="info">
        <download-excel
          class="btn"
          :data="dataListeBachelier"
          :fields="json_fields"
          worksheet="My Worksheet"
          type="xlsx"
          name="Releve à traité.xlsx"
        >
          Exporter 
          <v-icon right>mdi-cloud-download</v-icon>  
        </download-excel> 
      </v-btn>

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
      <template #selected-row-actions>
          <v-btn size="small"  @click="showConfirmDialog()"><v-icon class="mr-1">mdi-cursor-move</v-icon>déplacer dans [à traiter]</v-btn>
      </template>
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
      <v-dialog v-model="confirmDialog" max-width="600">
      <v-card >
        <v-toolbar color="primary" title="Confirmation"></v-toolbar>
        <v-card-text>Voulez vous déplacer la liste selectionnée dans les demandes disponibles?</v-card-text>
        <v-card-actions>
          <v-btn color="info" @click="confirmAction">Oui</v-btn>
          <v-btn color="error" text @click="cancelAction">Non</v-btn>
        </v-card-actions>
      </v-card>
     </v-dialog>

    </VCard>
  </section>
</template>

<script setup>
import { ref, computed, watchEffect,onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from "pinia";
import { useDiplomeStore} from '@/views/demandes/diplome/store'
import { toast } from 'vue3-toastify';

const diplomeStore = useDiplomeStore()
const {loading,columns,dataListeBachelier,etatCouleurs } = storeToRefs(diplomeStore);
const { atraiterPayer, destroym,moveToDisponible } = diplomeStore;
const confirmDialog = ref(false);
const selectedRows = ref([]);
const route = useRoute()
const router = useRouter() // Variable pour stocker les lignes sélectionnées

const selectionChanged = (data) => {
  console.log("Données reçues dans selectionChanged:", data);

  if (data && Array.isArray(data.selectedRows)) {
    const selectedIds = data.selectedRows.map(row => row.demandeId);
    console.log("Demande ids:", selectedIds);
    selectedRows.value = selectedIds;
  } else {
    selectedRows.value = [];
    console.error("La sélection n'est pas un tableau ou ne contient pas `selectedRows`:", data);
  }
};
const showConfirmDialog = () => {
  confirmDialog.value = true;
};
const cancelAction = () => {
  closeConfirmDialog();
};
const closeConfirmDialog = () => {
  confirmDialog.value = false;
  };
const confirmAction = async () => {
  try {
    console.log('Selected Rows:', selectedRows.value);
    await moveToDisponible(selectedRows.value);
    toast.success("Demandes déplacés avec succes !", {
      position: toast.POSITION.TOP_CENTER,
    });
    router.push({ name: 'demandes-diplome-demande-disponible'} )
    // Optionnel : rafraîchir les données ou effectuer d'autres actions
  } catch (error) {
    alert('Une erreur est survenue : ' + error.message);
  } finally {
    confirmDialog.value = false;
  }
};
let json_fields = {
  "NUMERO TABLE": "numeroTable" || "", // Si code est null, utilisez une chaîne vide
  "Prenoms": "prenoms" || "",
  "NOM": "nom" || "",
  "DATE DE NAISSANCE": "dateNaissance" || "",
  "LIEU DE NAISSSANCE": "lieuNaissance" || "",
  "SERIE": "serie" || "",
  "ANNEE": "annee" || ""
};
onMounted(()=>{
  atraiterPayer();
});
</script>

<style lang="scss" >
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
