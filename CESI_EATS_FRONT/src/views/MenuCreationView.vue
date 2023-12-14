<template>
    <main>     
        <div class="mes-articles">
            <h2 class="text-center"> Voici la liste de vos articles <br> Ici, vous pouvez créer de nouveaux menus</h2>
            <h3 class="text-center">Commencez par sélectionner vos articles composant votre menu, puis finaliser votre menu avec le bouton de création en bas à droite</h3>
            <v-container class="my-5">
                    <Articles />
            </v-container>
        </div>
    </main>
</template>

<script lang="ts">
import Articles from '@/components/MyArticle.vue';

export default {
  components: {
    Articles
  }
};
</script>