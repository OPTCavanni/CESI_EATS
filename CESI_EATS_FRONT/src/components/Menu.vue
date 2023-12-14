<script>
import { ref } from 'vue';
import axios from '@/service/axios';
import { useStore } from '@/service/store';
import webSocketService from '@/service/websocket';

export default {
  data() {
    const store = useStore();
    const getRestaurant = store.getters.getRestaurantId;

    return {
      articles: [],
      badgeValue: 0,
      showCart: false,
      cartItems: [],
      menuItems: [],
      showMenu: false,
      showConfirm: false,
      confirmMsg: 'Error',
      id: null,

      getRestaurant
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    this.fetchArticles();
  },
  methods: {
    async fetchArticles() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        let result = await axios.get('/menus/get-menu/' + this.id, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        this.articles = result.data; // Mettez à jour le tableau d'articles avec les données de l'API
        console.log('récupération réussi');

        for (let i = 0; i < this.articles.articles.length; i++) {
          let total = 0;
          for (let j = 0; j < this.articles.articles[i].length; j++) {
            total += +this.articles.articles[i][j].prix;
          }
          this.articles.menus[i].total = total * (1 - this.articles.menus[i].promotion / 100);
        }
      }
      catch (error) {
        console.log(error);
      }
    },
    addToCart(article) {
      this.cartItems.push(article); // Ajouter l'article au tableau cartItems
      this.badgeValue += 1; // Augmenter la valeur du badge
    },
    toggleCart(value) {
      this.showCart = value;
    },
    removeFromCart(item_id) {
      // Recherche de l'index de l'article dans le panier
      const index = this.cartItems.findIndex(item => item._id === item_id._id);

      // Vérification si l'article existe dans le panier
      if (index !== -1) {
        // Suppression de l'article du panier en utilisant splice()
        this.cartItems.splice(index, 1);
        this.badgeValue -= 1; // Diminue la valeur du badge
      }
      if (this.cartItems.length === 0) {
        this.showCart = false;
      }
    },
    async getInfo(item) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        let result = await axios.get('/menus/' + item._id, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        this.menuItems = result.data.articles; // Mettez à jour le tableau d'articles avec les données de l'API
        console.log('récupération réussi');
      }
      catch (error) {
        console.log(error);
      }
      this.showMenu = true;
    },
    toggleMenu(value) {
      this.showMenu = value;
    },
    toggleConfirm(value) {
      this.showConfirm = value;
    },
    async createCommand() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const dataForm = {
          id_restaurant: this.cartItems[0].id_restaurant,
          id_menu: [],
          status: 'En attente'
        }

        for (let i = 0; i < this.cartItems.length; i++) {
          dataForm.id_menu.push(this.cartItems[i]._id)
        }

        let result = await axios.post('/commandes/create-commande', dataForm, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        webSocketService.newCommand();
        this.confirmMsg = 'Commande effectuée avec succès. Le restaurant prépare votre commande, un livreur s\'occupera de votre livraison sous peu.'
      }
      catch (error) {
        console.log(error);
        this.confirmMsg = ('Une erreur s\'est produite lors de la réception de votre commande. Veuillez réssayer plus tard')
      }
      this.showCart = false;
      this.showConfirm = true;
      this.badgeValue = 0;
      this.cartItems = [];
    },
    updatePrice() {
      let groprix = 0;
      for (let i = 0; i < this.cartItems.length; i++) {
        groprix += +this.cartItems[i].total;
      }
      return groprix;
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
          <div class="d-flex justify-end">
            <v-chip size="large" class="ma-2" color="orange" text-color="white" append-icon="mdi-cash">
              Prix : {{ article.total }}€
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="getInfo(article)">
            🍴 MENU
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" @click="addToCart(article)">
            🎫 ACHAT
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <div class="floating-button">
    <v-badge v-if="badgeValue > 0" :content="this.badgeValue" color="red">
      <span @click="toggleCart(true)">
        <v-btn class="flt-btn" prepend-icon stacked variant="tonal" block rounded="lg" color="white">
          🛒
          Panier
        </v-btn>
      </span>
    </v-badge>
    <span v-else>
      <v-btn class="flt-btn" prepend-icon stacked variant="tonal" block rounded="lg" color="white">
        🛒
        Panier
      </v-btn>
    </span>
  </div>
  <v-dialog v-model="showCart" persistent max-width="600">
    <v-card>
      <v-card-title>Contenu du panier</v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="item in cartItems" :key="item.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="mini-card">
              <v-img :src="item.image" class="align-end text-white"></v-img>
              <v-card-title class="text-wrap">{{ item.title }}</v-card-title>
              <v-card-text>
                <div>💰 {{ item.total }} €</div>
              </v-card-text>
              <v-card-actions>
                <v-btn icon class="align-self-end" color="blue">
                  <v-icon>mdi-information</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon class="align-self-end" color="red" @click="removeFromCart(item)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="createCommand(false)">Passer Commande</v-btn>
        <v-btn color="secondary" @click="toggleCart(false)">Fermer</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="align-self-end" color="green">
          <v-icon>mdi-cash</v-icon>
          {{ updatePrice() }} €
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showMenu" max-width="600">
    <v-card>
      <v-card-title class="text-h5">Contenu du menu</v-card-title>
      <v-card-subtitle class="text-h6">Détails des articles du menu :</v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col v-for="item in menuItems" :key="item.id" cols="12">
            <v-card color="#e3b28a" theme="dark">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h5">
                    {{ item.title }}
                  </v-card-title>
                  <v-card-text class="description-text"> {{ item.description }}</v-card-text>
                  <v-card-text>
                    💵 Prix unitaire : {{ item.prix }} € <br>
                    📦 Statut stock : {{ item.stock }} <br>
                    🌱 {{ item.vegan }} <br>
                    🧩 Liste des ingrédients : <br>
                    <ul>
                      <li v-for="ingredient in item.ingredients" :key="ingredient.id" class="my-list-item">{{
                        ingredient.dose }} de {{ ingredient.name }}</li>
                    </ul>
                  </v-card-text>
                </div>
                <v-avatar class="ma-3" size="125" rounded="0">
                  <v-img :src="item.image"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="toggleMenu(false)">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showConfirm" max-width="400px">
    <v-card>
      <v-card-title classe="text-h3">
        Statut de votre commande :
      </v-card-title>
      <v-card-text>
        {{ this.confirmMsg }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green" @click="toggleConfirm(false)">Merci</v-btn>
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
  background-color: #7F2A9B;
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

.my-list-item {
  margin-left: 20px;
}.description-text {
    max-height: 100px;
    overflow-y: auto;
}
</style>
  