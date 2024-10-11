// Utilities
import { defineStore } from 'pinia';
import axios from '@/plugins/axios.js'
import { format } from 'date-fns';
import { fr } from "date-fns/locale";

const  modulesURL = '/v1/demandes';
const all= modulesURL+'/all';
const search= modulesURL+'/search';
const demandeReleve= modulesURL+'/demandeReleve';
const demandeDiplome= modulesURL+'/demandeDiplome';
const demandeDuplicata= modulesURL+'/demandeDuplicata';
const demandeAttestation= modulesURL+'/demandeAttestation';
export const useDemandeStore = defineStore('demande', {
  state: () => ({
    dataListeDemande: [],  //  List des données à afficher pour la table
    dataDetails: {},  //  Détails d'un élment,
    loading: true,
    successMessage: '',
    error: '',
    searchExecuted: false,  //  utilisé pour le chargement
    /*breadcrumbs: [
      {
        text: 'Paramétrage',
        disabled: true,
        route: 'home',
      },
      {
        text: 'Académies',
        disabled: true,
        route: 'src/modules/academie/routes.js',
      }
    ],*/
    headerTable: [
      { text: 'Libelle', value: 'libelle', align: 'start', sortable: true },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    columns: [
      { label: 'PRENOM(S)', field: 'prenoms',width: "200px",resizable: true},
      { label: 'NOM', field: 'nom',width: "100px",resizable: true },
      { label: 'NUMERO', field: 'numeroTable',resizable: true },
      { label: 'DATE DE NAISSANCE', field: 'dateNaissance',width: "210px" ,resizable: true},
      { label: 'NEE VERT', field: 'neeVert',width: "120px",resizable: true},
      { label: 'LIEU DE NAISSANCE', field: 'lieuNaissance',width: "200px",resizable: true},
      { label: 'ADMIS', field: 'admis',width: "100px",resizable: true},
      { label: 'SERIE', field: 'serie',resizable: true },
      { label: 'ANNEE', field: 'annee',resizable: true},
      { label: 'Actions', field: 'actions',width: "200px",resizable: true }
    ],
  }),

  getters: {
    getDataListedemande: (state) => state.dataListedemande,
  },

  actions: {
    //  recupérer la liste des annees et le mettre dans la tabel dataListe
    async all() {
      try {
        await axios.get(`${all}`)
        .then((response) => {
          if(response.status === 200){
            let res=response.data.map((element) => {
              let serieLabel = element.serie? element.serie.libelle:null;
              let anneeLabel = element.annee? element.annee.libelle:null;
              return{
                id:element.id, 
                prenoms: element.prenoms,
                nom: element.nom,
                numeroTable: element.numeroTable,
                neeVert: element.neeVert,
                admis: element.admis,
                dateNaissance:element.dateNaissance,
                lieuNaissance: element.lieuNaissance,
                serie: serieLabel,
                annee: anneeLabel,
                }
              
            });
            this.dataListedemande = res;
          } 
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async one(demande) {
      try {
        await axios.get(`${modulesURL}/${demande}`) 
        .then((response) => {
          if(response.status === 200){
            this.dataDetails = response.data;
          } 
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    //  ajouter une annee
    async demandeReleve(id,payload) {
      try {
        console.log("Id: ", id);
        console.log("Payload: ", payload);
        await axios.post(`${demandeReleve}/${id}`, payload) 
        .then((response) => {
          if(response.status === 200 ){
            this.dataDetails = response.data;
            console.log("Response: ", this.dataDetails);
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async demandeDiplome(id,payload) {
      try {
        console.log("Id: ", id);
        console.log("Payload: ", payload);
        await axios.post(`${demandeDiplome}/${id}`, payload) 
        .then((response) => {
          if(response.status === 200 ){
            this.dataDetails = response.data;
            console.log("Response: ", this.dataDetails);
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async demandeDuplicata(id,payload) {
      try {
        console.log("Id: ", id);
        console.log("Payload: ", payload);
        await axios.post(`${demandeDuplicata}/${id}`, payload) 
        .then((response) => {
          if(response.status === 200 ){
            this.dataDetails = response.data;
            console.log("Response: ", this.dataDetails);
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async demandeAttestation(id,payload) {
      try {
        console.log("Id: ", id);
        console.log("Payload: ", payload);
        await axios.post(`${demandeAttestation}/${id}`, payload) 
        .then((response) => {
          if(response.status === 200 ){
            this.dataDetails = response.data;
            console.log("Response: ", this.dataDetails);
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    //  modifier une annee
    async modify(id, payload) {
      try {
        console.log("Id: ", id);
        console.log("Payload: ", payload);
        await axios.put(`${modulesURL}/${id}`, payload) 
        .then((response) => {
          if(response.status === 200 ){
            this.dataDetails = response.data;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    //  modifier une annee
    async destroy(id) {
      try {
        await axios.delete(`${modulesURL}/${id}`) 
        .then((response) => {
          if(response.status === 200 ){
            this.dataDetails = response.data;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
  
})
