<script>
import { ref } from 'vue'
import axios from '../service/axios'
import { useRouter } from 'vue-router';
import { useStore } from '@/service/store';

export default {
    data() {
        const store = useStore();
        const id_restaurant = store.getters.getRestaurantId;
        return {
            commands: [],
            id_restaurant,
        };
    },
    mounted() {
        this.fetchCommands();
    },
    methods: {
        async fetchCommands() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.get('/commandes/get-restaurant/' + this.id_restaurant, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.commands = result.data; // Met à jour le tableau d'articles avec les données de l'API
                console.log('récupération réussi');
            }
            catch (error) {
                console.log(error);
            }
        },
        getChipColor(text) {
            // Condition pour déterminer la couleur en fonction du texte
            if (text === 'En attente') {
                return 'blue'; // Rouge pour le texte A
            } else if (text === 'En cours') {
                return 'green'; // Bleu pour le texte B
            } else {
                return 'red'; // Vert pour tout autre texte
            }
        },
        async cancel(command) {

            const dataForm = {
                status: 'Refus'
            };

            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.put('/commandes/' + command.id_commande, dataForm, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.fetchCommands();
            }
            catch (error) {
                console.log(error);
            }
        },
        async accept(command) {
            const dataForm = {
                status: 'En cours'
            };

            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.put('/commandes/' + command.id_commande, dataForm, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.fetchCommands();
            }
            catch (error) {
                console.log(error);
            }
        },
        async go(command) {
            const dataForm = {
                status: 'En attente livraison'
            }; 

            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.put('/commandes/' + command.id_commande, dataForm, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.fetchCommands();
            }
            catch (error) {
                console.log(error);
            }
        },
    }
};
</script>

<template>
    <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" class="flex" v-for="commande in commands" :key="commande.id">
            <v-card class="card-with-truncate">
                <v-card-title class="text-wrap">
                    Commande : {{ commande.id_commande }}
                </v-card-title>
                <v-card-text>
                    <div> 🏬 <b>Restaurant :</b> {{ commande.restaurant_nom }}</div>
                    <div> 🗾 <b>Adresse Etablissement :</b> {{ commande.restaurant_adresse }}</div>
                    <v-divider></v-divider>
                    <div> 🧓 <b>Client :</b> {{ commande.client_username }}</div>
                    <div> 🎴 <b>Adresse Client :</b> {{ commande.client_adresse }}</div>
                    <v-divider></v-divider>
                    <div>
                        <b>MENU :</b>
                        <ul>
                            <li v-for="menu in commande.menus" :key="menu.id" class="my-list-item">
                            {{ menu }} </li>
                        </ul>
                    </div>
                    <div class="d-flex justify-end">
                        <v-chip size="large" class="ma-2" :color="getChipColor(commande.status)" text-color="white"  append-icon="mdi-list">
                            <b>Status : </b> {{ commande.status }}
                        </v-chip>
                    </div>
                </v-card-text>
                <v-card-actions v-if="commande.status === 'En attente'">
                    <v-btn color="red" @click="cancel(commande)">
                        ❌ REFUSER
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green" @click="accept(commande)">
                        ✅ ACCEPTER
                    </v-btn>
                </v-card-actions>
                <v-card-actions v-if="commande.status === 'En cours'">
                    <v-spacer></v-spacer>
                    <v-btn color="green" @click="go(commande)">
                        🚴‍♀️ PRET POUR LIVRAISON
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<style>
.my-list-item {
  margin-left: 20px;
}
</style>