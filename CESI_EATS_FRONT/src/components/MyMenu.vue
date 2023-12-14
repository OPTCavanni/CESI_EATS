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
            showMenu: false,
            menuItems: [],
            menutitle: '',
            menudescription: '',
            menufile: '',
            menupromotion: 0,
            prixmenu: 0,
            menuid: '',
            showSkeleton: false,
            showMyArticle: false,
            myarticles: [],

            getRestaurant
        };
    },
    mounted() {
        this.fetchArticles();
        this.showSkeleton = true;
        this.showMyArticle = false;
    },
    methods: {
        async fetchArticles() {
            try {
                const accessToken = localStorage.getItem('accessToken');

                let result = await axios.get('/menus/get-menu/' + this.getRestaurant, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.articles = result.data; // Mettez à jour le tableau d'articles avec les données de l'API
                console.log('récupération réussi');
            }
            catch (error) {
                console.log(error);
            }
        },
        async deleteMenu(menu) {

            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.delete('/menus/' + menu._id, {
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
        async toggleMenu(menu) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.get('/menus/' + menu._id, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.menuid = result.data.menus._id;
                this.menutitle = result.data.menus.title;
                this.menudescription = result.data.menus.description;
                this.menufile = result.data.menus.image;
                this.menupromotion = result.data.menus.promotion;
                for (let i = 0; i < result.data.articles.length; i++) {
                    this.menuItems.push(result.data.articles[i]);
                }
            }
            catch (error) {
                console.log(error);
            }
            this.showMenu = true;
        },
        updatePrice() {
            this.prixmenu = 0;
            // Mettre à jour le prix en fonction de la valeur du curseur
            for (let i = 0; i < this.menuItems.length; i++) {
                this.prixmenu += +this.menuItems[i].prix;
            }
            this.prixmenu = this.prixmenu * (1 - this.menupromotion / 100); // Exemple : multiplier la valeur par 10
            return this.prixmenu
        },
        closemenu() {
            this.showMenu = false;
            this.menuItems = [];
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
        async updateMenu() {

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
                let result = await axios.put('/menus/' + this.menuid, dataForm, {
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
        },
        async showMyArticles() {
            this.showMenu = false;
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.get('/articles/get/' + this.getRestaurant, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                for (let i = 0; i < result.data.length; i++) {
                    this.myarticles.push(result.data[i]);
                }
            }
            catch (error) {
                console.log(error);
            }
            this.showMyArticle = true;
        },
        addToMenu(article) {
            this.menuItems.push(article);
            this.showMyArticle = false;
            this.showMenu = true;
            this.myarticles = [];
        }
    },
};
</script>

<template>
    <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" class="flex" v-for="article in articles.menus" :key="article.id">
            <v-card class="card-with-truncate">
                <v-img class="align-end text-white" :src="article.image">
                    <v-card-title class="custom-title"> {{ article.title }}</v-card-title>
                </v-img>
                <v-card-subtitle class="text-wrap">
                    Description : {{ article.description }}
                </v-card-subtitle>
                <v-card-text>
                    <div> 🏬 Restaurant : {{ article.id_restaurant }}</div>
                    <div> 💱 {{ article.promotion }} % de réduction </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="orange" @click="toggleMenu(article)">
                        🗿 MODIFIER
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="red" @click="deleteMenu(article)">
                        ❌SUPPRIMER
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    <v-dialog v-model="showMenu" persistent max-width="600">
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
                    <v-img :src="menufile"></v-img>
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
                    <v-col cols="12" sm="6" md="4" lg="3">
                        <v-card v-if="showSkeleton" @click="showMyArticles()" class="mini-card">
                            <v-img
                                src="https://static.vecteezy.com/ti/vecteur-libre/p1/7479096-icone-ajouter-au-panier-adapte-pour-symbole-web-numerique-style-plat-conception-simple-modifiable-modele-conception-vecteur-illustration-symbole-simple-vectoriel.jpg"
                                class="align-end text-black"></v-img>
                            <v-card-title class="text-wrap"> + Article </v-card-title>
                            <v-card-text>
                                <div> Cliquer pour ajouter un article </div>
                            </v-card-text>
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
                <v-btn color="primary" @click="updateMenu()">Enregistrer modification</v-btn>
                <v-btn color="secondary" @click="closemenu()">Fermer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="showMyArticle" persistent max-width="600">
        <v-card>
            <v-card-title>
                Vos articles
            </v-card-title>
            <v-card-text> Sélectionnez l'article à ajouter à votre menu </v-card-text>
            <v-col v-for="item in myarticles" :key="item.id" cols="12" sm="6" md="4" lg="3">
                <v-card class="mini-card">
                    <v-img :src="item.image" class="align-end text-white"></v-img>
                    <v-card-title class="text-wrap">{{ item.title }}</v-card-title>
                    <v-card-text>
                        <div>💰 {{ item.prix }} €</div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn icon class="align-self-end" color="blue" @click="addToMenu(item)">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-card>
    </v-dialog>
</template>
  
<style scoped>
.article-card {
    margin-bottom: 20px;
    margin-left: 20px;
    margin-right: 20px;
}

.mini-card {
    margin-bottom: 20px;
}

.custom-title {
    font-size: 24px;
}
</style>
  