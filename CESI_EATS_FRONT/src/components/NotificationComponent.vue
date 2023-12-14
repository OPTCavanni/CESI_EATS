<template>
    <v-container fill-height>
      <v-snackbar v-model="dialog" :color="snackbarColor" :timeout="6000">
        <v-card>
            <v-card-title class="headline">Vous avez une nouvelle commande</v-card-title>

            <v-card-actions>
                <v-btn color="green darken-1" @click="dialog = false" to="/command-restaurant">Voir la commande</v-btn>
            </v-card-actions>
        </v-card>
      </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import { ref } from 'vue';
import webSocketService from '@/service/websocket';

export default {
  name: 'notification',

  setup() {
    let dialog = ref(false);
    const snackbarColor = ref('');

    // Écoute de l'événement 'commande' du web socket
    webSocketService.socket.on('commande', (message: string) => {
      console.log('Commande reçue :', message);
      // Afficher le dialogue lorsque la commande est reçue
      dialog.value = true;
    });

    return {
      dialog,
      snackbarColor
    };
  },
};
</script>