<template>
    <main>
        <h2 class="text-center"> Statistiques de votre restaurant : </h2>
        <v-container>
            <Stat/>
        </v-container>
    </main>
</template>

<script lang="ts">
    import Stat from '@/components/Stat.vue';
export default {
  components: {
    Stat
  }
};
</script>