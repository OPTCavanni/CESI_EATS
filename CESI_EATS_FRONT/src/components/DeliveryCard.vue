<script>
import { ref } from 'vue'
import axios from '../service/axios'
import { useRouter } from 'vue-router';

export default {
    data() {
        return {
            commands: [],
        };
    },
    mounted() {
        this.fetchCommands();
    },
    methods: {
        async fetchCommands() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.get('/commandes/get-livreur', {
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
            if (text === 'En attente livraison') {
                return 'orange'; // Rouge pour le texte A
            } else if (text === 'En livraison') {
                return 'blue'; // Bleu pour le texte B
            } else {
                return 'red'; // Vert pour tout autre texte
            }
        },
        async accept(command) {
            const dataForm = {
                status: 'En livraison'
            };

            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.put('/commandes/' + command.id_commande, dataForm, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                window.location.reload();
            }
            catch (error) {
                console.log(error);
            }
        },
        async done(command) {
            const dataForm = {
                status: 'Livré'
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
                <v-card-actions v-if="commande.status === 'En attente livraison'">
                    <v-spacer></v-spacer>
                    <v-btn color="blue" @click="accept(commande)">
                        🔵 ACCEPTER
                    </v-btn>
                </v-card-actions>
                <v-card-actions v-if="commande.status === 'En livraison'">
                    <v-spacer></v-spacer>
                    <v-btn color="green" @click="done(commande)">
                        📦 LIVRE
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