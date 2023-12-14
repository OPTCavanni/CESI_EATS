<template>
    <main>
        <h2 class="text-center"> Régalez-vous !</h2>
        <v-container>
            <Restaurants/>
        </v-container>
    </main>
</template>

<script lang="ts">
    import Restaurants from '@/components/RestoList.vue';
export default {
  components: {
    Restaurants
  }
};
</script>