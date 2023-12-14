<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="navigationDrawer">
      <v-list>
        <v-list-item v-if="getUserType === 1" to="/home">
          <v-list-item-title>Choisir mon restau</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="getUserType === 2" to="/creation-restaurant">
          <v-list-item-title v-if="getRestaurant === null">Création Restaurant</v-list-item-title>
          <v-list-item-title v-if="getRestaurant !== null">Gestion Restaurant</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="getUserType === 2 && getRestaurant !== null" to="/createarticle">
          <v-list-item-title>Création d'articles</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="getUserType === 2 && getRestaurant !== null" to="/myarticle">
          <v-list-item-title>Création d'un menu</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="getUserType === 2 && getRestaurant !== null" to="/mymenu">
          <v-list-item-title>Gestion de mes menus</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="getUserType === 2 && getRestaurant !== null" to="/command-restaurant">
          <v-list-item-title>Mes Commandes</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="getUserType === 3" to="/command-livreur">
          <v-list-item-title>Livraisons</v-list-item-title>
        </v-list-item>

        <v-list-item to="/historique">
          <v-list-item-title>Historique de commande</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="getUserType === 2" to="/stat">
          <v-list-item-title>Statistiques Restaurant</v-list-item-title>
        </v-list-item>
        <!-- autres éléments du menu -->
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="navigationDrawer = !navigationDrawer"></v-app-bar-nav-icon>

      <v-toolbar-title>CESI EATS</v-toolbar-title>

      <v-btn v-if="isAuthenticated" to="/profil">Voir le Profil</v-btn>
      <v-btn v-if="isAuthenticated" to="/signin" @click="logout()">Déconnexion</v-btn>
      <v-btn v-if="!isAuthenticated" to="/signin">Connexion</v-btn>
      <v-btn v-if="!isAuthenticated" to="/signup">Inscription</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
      <Notification />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed, onMounted } from 'vue';
import { useStore } from '@/service/store';
import Notification from '@/components/NotificationComponent.vue';

export default {
  components: { 
    Notification 
  },
  data() {
    return {
      navigationDrawer: false,
    }
  },
  setup() {
    const store = useStore();

    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const getUserType = computed(() => store.getters.getUserType);

    const getRestaurant = computed(() => store.getters.getRestaurantId);

    const logout = () => {
      store.dispatch('logoutRoutine');
    };

    onMounted(() => {
      store.dispatch('loginRoutine');
    });

    return {
      getUserType,
      isAuthenticated,
      getRestaurant,

      logout
    }
  },
}
</script>