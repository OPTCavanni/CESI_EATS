<template>
    <component :is="getRestaurant === null ? 'creation-restaurant' : 'modification-restaurant'" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/service/store';

const store = useStore();
const getRestaurant = computed(() => store.getters.getRestaurantId);
</script>

<script lang="ts">
import CreationRestaurant from '@/components/Restaurateur/CreationRestaurantComponent.vue';
import ModificationRestaurant from '@/components/Restaurateur/ModificationRestaurantComponent.vue';

export default {
  components: {
    'creation-restaurant': CreationRestaurant,
    'modification-restaurant': ModificationRestaurant,
  },
}
</script>