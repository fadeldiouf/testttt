// Utilities
import { defineStore } from 'pinia';
import axios from '@/plugins/axios.js'
import { format } from 'date-fns';
import { fr } from "date-fns/locale";

const  modulesURL = '/v1/bacheliers';
const all= modulesURL+'/all';
const search= modulesURL+'/search';
const add = modulesURL+'/';
const libelleAvailability = modulesURL +'/libelle-availability';
export const useBachelierStore = defineStore('bachelier', {
  state: () => ({
    dataListeBachelier: [],  //  List des données à afficher pour la table
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
    getDataListeBachelier: (state) => state.dataListeBachelier,
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
            this.dataListeBachelier = res;
          } 
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    // Dans votre store bachelierStore
    async searchBachelier(nom, prenoms, dateNaissance, lieuNaissance, serie, annee,recaptchaResponse) {
      this.loading = true;
      this.searchExecuted = false;
      this.successMessage = '';
      this.error = '';

      try {
        const response = await axios.get('/v1/bacheliers/search', {
          params: { nom, prenoms, dateNaissance, lieuNaissance, serie, annee,recaptchaResponse }
        });

        this.dataListeBachelier = response.data;
        this.successMessage = 'Résultats de recherche récupérés avec succès.';

        // Retourner un booléen pour indiquer s'il y a des résultats
        return response.data.length > 0;
      } catch (error) {
        this.error = 'Une erreur est survenue lors de la recherche.';
        console.error('Erreur lors de la recherche:', error);
        return false;
      } finally {
        this.searchExecuted = true;
        this.loading = false;
      }
    },

    // Autres actions
    async one(serie) {
      try {
        await axios.get(`${modulesURL}/${serie}`) 
        .then((response) => {
          if(response.status === 200){
            this.dataDetails = response.data;
          } 
        })
        console.log(this.dataDetails);
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
  persist: {
    enabled: true, // Activer la persistance
    strategies: [
      {
        key: 'bachelier-store',
        storage: sessionStorage, // Utiliser sessionStorage pour la persistance
        paths: ['dataListeBachelier', 'searchExecuted'] // Spécifiez les données à persister
      },
    ],
  },
})
