<script>
import { ref } from 'vue';
import axios from '@/service/axios';
import { useStore } from '@/service/store';

export default {
    data() {
        const store = useStore();
        const getRestaurant = store.getters.getRestaurantId;

        return {
            articles: [],
            badgeValue: 0,
            showMenu: false,
            menuItems: [],
            menutitle: '',
            menudescription: '',
            menufile: '',
            menupromotion: 0,
            prixmenu: 0,

            getRestaurant
        };
    },
    mounted() {
        this.fetchArticles();
    },
    methods: {
        async fetchArticles() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.get('/articles/get/' + this.getRestaurant, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.articles = result.data; // Mettez à jour le tableau d'articles avec les données de l'API
            }
            catch (error) {
                console.log(error);
            }
        },
        async deleteArticle(article) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.delete('/articles/' + article.id_article, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.fetchArticles();
            }
            catch (error) {
                console.log(error);
            }
        },
        addToMenu(article) {
            this.menuItems.push(article); // Ajouter l'article au tableau menuItems
            this.badgeValue += 1; // Augmenter la valeur du badge
        },
        toggleMenu(value) {
            this.showMenu = value;
        },
        removeFromMenu(item_id) {
            // Recherche de l'index de l'article dans le panier
            const index = this.menuItems.findIndex(item => item._id === item_id._id);

            // Vérification si l'article existe dans le panier
            if (index !== -1) {
                // Suppression de l'article du panier en utilisant splice()
                this.menuItems.splice(index, 1);
                this.badgeValue -= 1; // Diminue la valeur du badge
            }
        },
        updatePrice() {
            this.prixmenu = 0;
            // Mettre à jour le prix en fonction de la valeur du curseur
            for (let i = 0; i < this.menuItems.length; i++) {
                this.prixmenu += + this.menuItems[i].prix;
            }
            this.prixmenu = this.prixmenu * (1 - this.menupromotion / 100); // Exemple : multiplier la valeur par 10
            return this.prixmenu
        },
        async createMenu() {
            const dataForm = {
                id_restaurant: this.getRestaurant,
                title: this.menutitle,
                description: this.menudescription,
                image: this.menufile,
                promotion: this.menupromotion,
                id_article: []
            }
            for (let i = 0; i < this.menuItems.length; i++) {
                dataForm.id_article.push(this.menuItems[i].id_article);
            }
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.post('/menus/create-menu', dataForm, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
            this.showMenu = false;
            this.menuItems = [];
            this.badgeValue = 0;
        }
    }
}
</script>

<template>
    <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" class="flex" v-for="article in articles" :key="article.id">
            <v-card class="card-with-truncate">
                <v-img class="align-end text-white" :src="article.image">
                    <v-card-title class="custom-title"> {{ article.title }}</v-card-title>
                </v-img>
                <v-card-text class="description-text">
                    Description : {{ article.description }}
                </v-card-text>
                <v-card-text>
                    <div> 💰 Prix : {{ article.prix }} €</div>
                    <div> 📦 Stock : {{ article.stock }}</div>
                    <div> 🌱 Régime Végétarien : {{ article.vegan }}</div>
                    <div> 🧩 Liste des ingrédients : <br>
                        <ul>
                            <li v-for="ingredient in article.ingredients" :key="ingredient.id" class="my-list-item">{{
                                ingredient.dose }} de {{ ingredient.name }}</li>
                        </ul>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" @click="deleteArticle(article)">
                        ❌ SUPPRIMER
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green" @click="addToMenu(article)">
                        🃏 + MENU
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    <div class="floating-button">
        <v-badge v-if="badgeValue > 0" :content="this.badgeValue" color="red">
            <span @click="toggleMenu(true)">
                <v-btn class="flt-btn" prepend-icon stacked variant="tonal" block rounded="lg" color="white">
                    📜
                    Créer un menu
                </v-btn>
            </span>
        </v-badge>
        <span v-else>
            <v-btn class="flt-btn" prepend-icon stacked variant="tonal" block rounded="lg" color="white">
                📜
                Créer un menu
            </v-btn>
        </span>
    </div>
    <v-dialog v-model="showMenu" max-width="600">
        <v-card>
            <v-card-title>Détails du menu</v-card-title>
            <v-row justify="center">
                <v-col cols="10" md="11">
                    <v-text-field label="Nom de votre Menu" v-model="menutitle"></v-text-field>
                </v-col>
                <v-col cols="10" md="11">
                    <v-textarea label="Description de votre menu" v-model="menudescription"></v-textarea>
                </v-col>
                <v-col cols="10" md="11">
                    <v-text-field v-model="menufile" placeholder="Saisissez l'url de votre image" label="Image"
                        prepend-icon="mdi-camera"></v-text-field>
                </v-col>
                <v-col cols="10" md="11">
                    <v-slider label="Promotion" v-model="menupromotion" thumb-label="always" :step="1"
                        @input="updatePrice()"></v-slider>
                </v-col>
            </v-row>
            <v-card-text>
                <v-row>
                    <v-col v-for="item in menuItems" :key="item.id" cols="12" sm="6" md="4" lg="3">
                        <v-card class="mini-card">
                            <v-img :src="item.image" class="align-end text-white"></v-img>
                            <v-card-title class="text-wrap">{{ item.title }}</v-card-title>
                            <v-card-text>
                                <div>💰 {{ item.prix }} €</div>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn icon class="align-self-end" color="red" @click="removeFromMenu(item)">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <v-banner lines="two" icon="mdi-cash" color="green" class="my-4">
                    <v-banner-text>
                        Prix du menu : <br> {{ updatePrice() }} €
                    </v-banner-text>
                </v-banner>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="createMenu()">Créer un menu</v-btn>
                <v-btn color="secondary" @click="toggleMenu(false)">Fermer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.article-card {
    margin-bottom: 20px;
    margin-left: 20px;
    margin-right: 20px;
}

.floating-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
}

.flt-btn {
    background-color: #845fef;
}

.mini-card {
    margin-bottom: 20px;
}

.v-badge__badge {
    cursor: pointer;
}

.custom-title {
    font-size: 24px;
}

.description-text {
    max-height: 100px;
    overflow-y: auto;
}
.my-list-item {
  margin-left: 20px;
}
</style>