<template>
    <v-container fill-height>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6" lg="4" xl="4">
                <v-card class="mx-auto">
                    <template v-slot:title>
                        Création de votre Restaurant
                    </template>

                    <v-card-text />

                    <v-card-text>
                        <v-text-field v-model="restaurantName" label="Nom de votre restaurant" density="compact"
                            variant="outlined" :rules="[required]"></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-text-field v-model="restaurantAddress" label="Adresse" density="compact" variant="outlined"
                            :rules="[required]"></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-textarea v-model="restaurantDescription" label="Description de votre restaurant" density="compact"
                            variant="outlined" :rules="[required]"></v-textarea>
                    </v-card-text>

                    <v-card-text>
                        <v-text-field v-model="restaurantMail" label="E-mail" density="compact" variant="outlined"
                            :rules="[required]"></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-select v-model="restaurantType" label="Catégorie de cuisine" density="compact" variant="outlined"
                            :items="['Pizza', 'Fast Food', 'Français', 'Chinois', 'Kebab', 'Japonais']"
                            :rules="[required]"></v-select>
                    </v-card-text>

                    <v-card-text>
                        <v-select v-model="restaurantCountry" label="Pays" density="compact" variant="outlined"
                            :items="['France', 'Saint-Vincent-et-les-Grenadines', 'Papouasie Nouvelel-Guinne']"
                            :rules="[required]"></v-select>
                    </v-card-text>

                    <v-card-text>
                        <v-btn color="primary" location="center" size="large" @click="createRestaurant">Créer mon
                            restaurant</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { ref } from 'vue';
import axios from '@/service/axios';
import { useStore } from '@/service/store';

export default {
    name: "creationrestaurantcomponent",

    setup() {
        const restaurantName = ref('');
        const restaurantAddress = ref('');
        const restaurantDescription = ref('');
        const restaurantMail = ref('');
        const restaurantType = ref('');
        const restaurantCountry = ref('');

        const store = useStore();

        const createRestaurant = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                let result = await axios.post('/api/create-restaurant',
                    {
                        name: restaurantName.value,
                        adresse: restaurantAddress.value,
                        description: restaurantDescription.value,
                        type: restaurantType.value,
                        pays: restaurantCountry.value,
                        email: restaurantMail.value
                    },
                    {
                        headers:
                        {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                store.dispatch('getRestaurant');
            }
            catch (error) {
                console.log(error)
            }
        };

        return {
            restaurantName,
            restaurantAddress,
            restaurantDescription,
            restaurantMail,
            restaurantType,
            restaurantCountry,

            createRestaurant
        };
    },

    methods: {
        required(v: string) {
            return !!v || 'Field is required'
        },
    },
}
</script>