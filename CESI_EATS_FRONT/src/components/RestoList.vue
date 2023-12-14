<script>
import { ref } from 'vue'
import axios from '../service/axios'
import { useRouter } from 'vue-router';

export default {
    data() {
        return {
            restaurants: [],
        };
    },
    mounted() {
        this.fetchRestaurants();
    },
    methods: {
        async fetchRestaurants() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.get('/api/restaurant-all', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.restaurants = result.data; // Met à jour le tableau d'articles avec les données de l'API
                console.log('récupération réussi');
            }
            catch (error) {
                console.log(error);
            }
        },
        allerNouvellePage(id_resto) {
            this.$router.push('/shop/' + id_resto);
        },
        color(restaurant) {
            switch (restaurant.restaurants_type) {
                case 'Pizzeria':
                    return 'orange'
                    break;
                case 'Pizza':
                    return 'orange'
                    break;
                case 'Fast Food':
                    return 'yellow'
                    break;
                case 'Chinois':
                    return 'green'
                    break;
                case 'Japonais':
                    return 'red'
                    break;
                case 'Kebab':
                    return 'blue'
                    break;
                default:
                    return 'black'
                    break;
            }
        }
    }
};
</script>

<template>
    <v-row>
        <v-col cols="12" sm="6" md="12" lg="3" class="flex" v-for="restaurant in restaurants" :key="restaurant.id">
            <v-card :color="color(restaurant)" theme="dark">
                <v-card-title class="text-h5">
                    🏬 {{ restaurant.restaurants_nom }}
                </v-card-title>
                <v-card-text class="description-text"> <b>{{ restaurant.restaurants_description }}</b> </v-card-text>
                <v-card-text> 🍱 Type de cuisine : {{ restaurant.restaurants_type }} </v-card-text>
                <v-card-text> 🈹 Adresse : {{ restaurant.restaurants_adresse }}, {{ restaurant.restaurants_pays}}</v-card-text>
                <v-avatar class="ma-3" size="250" rounded="0">
                    <v-img src="https://a.storyblok.com/f/123939/2240x1260/ceebc9c756/emplacement-restaurant.png"></v-img>
                </v-avatar>
                <v-card-actions>
                    <v-btn class="ms-2" variant="outlined" size="large"
                        @click="allerNouvellePage(restaurant.restaurants_id)">
                        🥡 VOIR MENU
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<style>
.description-text {
  max-height: 75px;
  min-height: 100px;
  overflow-y: auto;
}
</style>