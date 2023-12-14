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
                let result = await axios.get('/commandes/historique', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.commands = result.data;
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
            } else if (text === 'En attente') {
                return 'blue'; // Rouge pour le texte A
            } else if (text === 'En cours') {
                return 'green'; // Bleu pour le texte B
            } else if (text === 'Livré') {
                return 'gray'; // Bleu pour le texte B
            } else {
                return 'red'; // Vert pour tout autre texte
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
                        <v-chip size="large" class="ma-2" :color="getChipColor(commande.status)" text-color="white">
                            <b>Status : {{ commande.status }}</b>
                        </v-chip>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="gray">
                        {{ commande.created_at }}
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