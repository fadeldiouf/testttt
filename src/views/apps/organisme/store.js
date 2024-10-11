// Utilities
import { defineStore } from 'pinia';
import axios from '@/plugins/axios.js'
import { format } from 'date-fns';
import { fr } from "date-fns/locale";

const  modulesURL = '/v1/organismes';
const all= modulesURL+'/all';
const search= modulesURL+'/search';
const add = modulesURL+'/';
const libelleAvailability = modulesURL +'/libelle-availability';
export const useOrganismeStore = defineStore('organisme', {
  state: () => ({
    dataListeOrganisme: [],  //  List des données à afficher pour la table
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
      { label: 'LIBELLE', field: 'libelle',width: "200px",resizable: true},
      { label: 'ACADEMIE', field: 'academie',width: "200px",resizable: true},
      { label: 'Actions', field: 'actions',width: "200px",resizable: true }
    ],
  }),

  getters: {
    getDataListeOrganisme: (state) => state.dataListeOrganisme,
  },

  actions: {
    //  recupérer la liste des annees et le mettre dans la tabel dataListe
    async all() {
      try {
        await axios.get(`${all}`)
        .then((response) => {
          if(response.status === 200){
            let res=response.data.map((element) => {
              let academieLabel = element.academie? element.academie.libelle:null;
              return{
                id:element.id, 
                libelle: element.libelle,
                academie: academieLabel,
                }
              
            });
            this.dataListeOrganisme = res;
          } 
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async one(serie) {
      try {
        await axios.get(`${modulesURL}/${serie}`) 
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
    },
    formatDate(date) {
      return format(new Date(date), 'dd-MM-yyyy', { locale: fr }); // Exemple de format, ajustez selon vos besoins
    },
  },
})
