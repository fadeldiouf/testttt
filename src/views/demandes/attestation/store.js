// Utilities
import { defineStore } from 'pinia';
import axios from '@/plugins/axios.js'
import { format } from 'date-fns';
import { fr } from "date-fns/locale";

const  modulesURL = '/v1/attestations';
const encoursPayer = modulesURL+'/encoursPayer';
const encours = modulesURL+'/encours';
const moveToAtraiter = modulesURL+'/moveToAtraiter';
const moveToDisponible = modulesURL+'/moveToDisponible';
const disponiblePayer = modulesURL+'/disponiblePayer';
const atraiterPayer = modulesURL+'/atraiterPayer';
export const useAttestationStore = defineStore('attestation', {
  state: () => ({
    dataListeBachelier: [],
    dataListeBachelierIdS: [],   //  List des données à afficher pour la table
    dataDetails: {},  //  Détails d'un élment,
    loading: true,
    successMessage: '',
    error: '',
    searchExecuted: false,
    etatCouleurs: {
      'en attente de signature': 'blue',
      'en cours de traitement': 'orange',
      'disponible': 'teal',
      // Ajoutez d'autres états et couleurs selon vos besoins
    }, 
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
    columns: [
      { label: 'NUMERO', field: 'numeroTable',resizable: true },
      { label: 'PRENOM(S)', field: 'prenoms',width: "200px",resizable: true},
      { label: 'NOM', field: 'nom',width: "100px",resizable: true },
      { label: 'DATE DE NAISSANCE', field: 'dateNaissance',width: "210px" ,resizable: true},
      // { label: 'NEE VERT', field: 'neeVert',width: "120px",resizable: true},
      // { label: 'LIEU DE NAISSANCE', field: 'lieuNaissance',width: "200px",resizable: true},
      // { label: 'ADMIS', field: 'admis',width: "100px",resizable: true},
      { label: 'SERIE', field: 'serie',resizable: true },
      { label: 'ANNEE', field: 'annee',resizable: true},
      { label: 'DATE  DEMANDE', field: 'dateDemande',width: "200px",resizable: true },
      { label: 'MONTANT', field: 'montantPayer',resizable: true},
      { label: 'DESTINATION', field: 'organisme',resizable: true},
      { label: 'STATUT', field: 'statut',width: "200px",resizable: true},
      { label: 'Actions', field: 'actions',width: "200px",resizable: true },
    ],
  }),

  getters: {
    getDataListeBachelier: (state) => state.dataListeBachelier,
    getDataListeBachelierIds: (state) => state.dataListeBachelierIds,
  },

  actions: {
    async encours() {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.get(`${encours}`);
        if (response.status === 200) {
          // Transformation des données pour correspondre aux colonnes
          this.dataListeBachelier = response.data.flatMap(bachelier =>
            bachelier.demandes.map(demande => {
              let serieLabel = bachelier.serie? bachelier.serie.libelle:null;
              let anneeLabel = bachelier.annee? bachelier.annee.libelle:null;
              let typeLabel = demande.typeDemande? demande.typeDemande.libelle:null;
              let organismeLabel = demande.organisme? demande.organisme.libelle:null;
              return{
              id: bachelier.id,
              numeroTable: bachelier.numeroTable,
              nom: bachelier.nom,
              prenoms: bachelier.prenoms,
              dateNaissance: bachelier.dateNaissance,
              lieuNaissance: bachelier.lieuNaissance,
              typeDemande: typeLabel,
              dateDemande:this.formatDate(demande.dateDemande),
              statut: demande.statut,
              organisme:organismeLabel,
              montantPayer: demande.montantPayer,
              serie: serieLabel,
              annee: anneeLabel,
              }
            })
          );
        }
      } catch (error) {
        this.error = error.message;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async encoursPayer() {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.get(`${encoursPayer}`);
        if (response.status === 200) {
          // Transformation des données pour correspondre aux colonnes
          const res = response.data.flatMap(bachelier =>
            bachelier.demandes.map(demande => {
              let serieLabel = bachelier.serie ? bachelier.serie.libelle : null;
              let anneeLabel = bachelier.annee ? bachelier.annee.libelle : null;
              let typeLabel = demande.typeDemande ? demande.typeDemande.libelle : null;
              let organismeLabel = demande.organisme ? demande.organisme.libelle : null;
              return {
                id: bachelier.id,
                numeroTable: bachelier.numeroTable,
                nom: bachelier.nom,
                prenoms: bachelier.prenoms,
                dateNaissance: bachelier.dateNaissance,
                typeDemande: typeLabel,
                dateDemande: this.formatDate(demande.dateDemande),
                statut: demande.statut,
                montantPayer: demande.montantPayer,
                organisme:organismeLabel,
                demandeId: demande.id,
                serie: serieLabel,
                annee: anneeLabel,
              };
            })
          );
    
          // Mise à jour des données de bachelier
          this.dataListeBachelier = res;
          console.log("dataListeBachelier",this.dataListeBachelier);
        }
      } catch (error) {
        this.error = error.message;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },    
    async atraiterPayer() {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.get(`${atraiterPayer}`);
        if (response.status === 200) {
          // Transformation des données pour correspondre aux colonnes
          const res = response.data.flatMap(bachelier =>
            bachelier.demandes.map(demande => {
              let serieLabel = bachelier.serie ? bachelier.serie.libelle : null;
              let anneeLabel = bachelier.annee ? bachelier.annee.libelle : null;
              let typeLabel = demande.typeDemande ? demande.typeDemande.libelle : null;
              let organismeLabel = demande.organisme ? demande.organisme.libelle : null;
              return {
                id: bachelier.id,
                numeroTable: bachelier.numeroTable,
                nom: bachelier.nom,
                prenoms: bachelier.prenoms,
                dateNaissance: bachelier.dateNaissance,
                typeDemande: typeLabel,
                dateDemande: this.formatDate(demande.dateDemande),
                statut: demande.statut,
                montantPayer: demande.montantPayer,
                organisme:organismeLabel,
                demandeId: demande.id,
                serie: serieLabel,
                annee: anneeLabel,
              };
            })
          );
    
          // Mise à jour des données de bachelier
          this.dataListeBachelier = res;
          console.log("dataListeBachelier",this.dataListeBachelier);
        }
      } catch (error) {
        this.error = error.message;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async disponiblePayer() {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.get(`${disponiblePayer}`);
        if (response.status === 200) {
          // Transformation des données pour correspondre aux colonnes
          const res = response.data.flatMap(bachelier =>
            bachelier.demandes.map(demande => {
              let serieLabel = bachelier.serie ? bachelier.serie.libelle : null;
              let anneeLabel = bachelier.annee ? bachelier.annee.libelle : null;
              let typeLabel = demande.typeDemande ? demande.typeDemande.libelle : null;
              let organismeLabel = demande.organisme ? demande.organisme.libelle : null;
              return {
                id: bachelier.id,
                numeroTable: bachelier.numeroTable,
                nom: bachelier.nom,
                prenoms: bachelier.prenoms,
                dateNaissance: bachelier.dateNaissance,
                typeDemande: typeLabel,
                dateDemande: this.formatDate(demande.dateDemande),
                statut: demande.statut,
                montantPayer: demande.montantPayer,
                organisme:organismeLabel,
                demandeId: demande.id,
                serie: serieLabel,
                annee: anneeLabel,
              };
            })
          );
    
          // Mise à jour des données de bachelier
          this.dataListeBachelier = res;
          console.log("dataListeBachelier",this.dataListeBachelier);
        }
      } catch (error) {
        this.error = error.message;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // Dans votre store bachelierStore
    async searchBachelier(nom, prenoms, dateNaissance, lieuNaissance, serie, annee) {
      this.loading = true;
      this.searchExecuted = false;
      this.successMessage = '';
      this.error = '';

      try {
        const response = await axios.get('/v1/bacheliers/search', {
          params: { nom, prenoms, dateNaissance, lieuNaissance, serie, annee }
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
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async moveToAtraiter(ids) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      try {
        const response = await axios.put(`${moveToAtraiter}`, ids);
        if (response.status === 200) {
          this.successMessage = response.data;
          // Optionnel : Mettre à jour les données ou effectuer d'autres actions
        }
      } catch (error) {
        this.error = error.response?.data || 'Une erreur est survenue';
        console.error('Erreur lors du déplacement des demandes:', error);
      } finally {
        this.loading = false;
      }
    },
    async moveToDisponible(ids) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      try {
        const response = await axios.put(`${moveToDisponible}`, ids);
        if (response.status === 200) {
          this.successMessage = response.data;
          // Optionnel : Mettre à jour les données ou effectuer d'autres actions
        }
      } catch (error) {
        this.error = error.response?.data || 'Une erreur est survenue';
        console.error('Erreur lors du déplacement des demandes:', error);
      } finally {
        this.loading = false;
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
