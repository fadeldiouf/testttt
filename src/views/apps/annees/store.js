// Utilities
import axios from '@/plugins/axios.js';
import { defineStore } from 'pinia';

const  modulesURL = '/v1/annees';
const all= modulesURL+'/all';
const add = modulesURL+'/';
const encours = modulesURL+'/encours';
const libelleAvailability = modulesURL +'/libelle-availability';
export const useAnneeStore = defineStore('annee', {
  state: () => ({
    dataListe: [],  //  List des données à afficher pour la table
    dataDetails: {},
    dataAnneeEnours:[],  //  Détails d'un élment,
    loading: true,  //  utilisé pour le chargement
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
      { title: 'Libelle', key: 'libelle', align: 'start', sortable: true },
      { title: 'Actions', key: 'actions', sortable: false }
    ],
    columns : [
      { label: 'LIBELLE', field: 'libelle', sortable: true,},
      { label: 'ACTIONS',field: 'actions', sortable: false, },
    ]
  }),

  getters: {
    getDataListe: (state) => state.dataListe,
    getDataAnneeEncours: (state) => state.dataAnneeEnours,
  },

  actions: {
    //  recupérer la liste des annees et le mettre dans la tabel dataListe
    async all() {
      try {
        await axios.get(`${all}`)
        .then((response) => {
          if(response.status === 200){
            let res=response.data.map((element) => {
              let encoursLabel = element.encours ? 'en cours' : 'obselete';
              return{
                id: element.id,
                libelle: element.libelle,
                encours:encoursLabel,
              }
              
            });
            this.dataListe = res;
          } 
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async anneeEnours() {
      try {
        await axios.get(`${encours}`)
        .then((response) => {
          if(response.status === 200){
            let res=response.data.map((element) => {
              return{
                id: element.id,
                libelleLong: element.libelleLong,
                encours: element.encours,
              }  
            });
            this.dataAnneeEnours = res;
          } 
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    //  recupérer les informations d'une académie par son ide et le mettre dans la tabel dataDetails
    async one(annee) {
      try {
        await axios.get(`${modulesURL}/${annee}`) 
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
    getLibelleById(id) {
      const annee = this.dataAnneeEnours.find(item => item.id === id);
      return annee ? annee.libelleLong : '';
    },
    //  ajouter une annee
    async add(payload) {
      try {
        await axios.post(`${add}`, payload) 
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
    async checkLibelleExistence(libelleLong) {
      try {
        const response = await axios.get(`${libelleAvailability}?libelleLong=${libelleLong}`);
        console.log("Réponse de libelleAvailability :", response);
        response.data=response.data.isAvailable;
        return true;
      } catch (error) {
        console.error('Erreur lors de la vérification du nom :', error);
        return false;
      }
    },
    async toggleAnneeState(id) {
      try {
        const response = await axios.put(`${modulesURL}/${id}/etatAnnee`);
        if (response.status === 200) {
          // Mettre à jour la liste après le basculement d'état
          this.all();
        }
      } catch (error) {
        console.error(error);
        this.error = error;
      } finally {
        this.loading = false;
      }
    }
  },
  
})
