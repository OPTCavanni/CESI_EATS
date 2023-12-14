<template>
    <main>     
        <div class="mes-articles">
            <h2 class="text-center">Nos Menus</h2>
            <v-container class="my-5">
                    <MyMenu />
            </v-container>
        </div>
    </main>
</template>

<script lang="ts">
import MyMenu from '@/components/Menu.vue';

export default {
  components: {
    MyMenu
  }
};
</script>