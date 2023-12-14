<template>
    <main>     
        <div class="mes-articles">
            <h2 class="text-center"> Ici, vous pouvez modifier et/ou supprimer vos différents menus</h2>
            <v-container class="my-5">
                    <MyMenu />
            </v-container>
        </div>
    </main>
</template>

<script lang="ts">
import MyMenu from '@/components/MyMenu.vue';

export default {
  components: {
    MyMenu
  }
};
</script>