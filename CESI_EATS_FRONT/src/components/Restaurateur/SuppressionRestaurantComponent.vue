<template>
    <v-card-text>
        <v-btn color="primary" location="center" size="large" @click="dialog = true">Supprimer mon compte</v-btn>
    </v-card-text>

    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title class="headline">Supprimer mon restaurant</v-card-title>

            <v-card-text>
                <v-text-field v-model="password" label="Mot de passe" density="compact" variant="outlined"></v-text-field>
                <v-text-field v-model="confirmPassword" label="Confirmer mot de passe" type="password" density="compact"
                    variant="outlined"
                    :rules="[() => confirmPassword === password || 'Les mots de passe ne correspondent pas']"></v-text-field>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" @click="deleteRestaurant">Confirmer Suppression</v-btn>
                <v-btn color="red darken-1" @click="dialog = false">Fermer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from '@/service/axios'
import { useStore } from '@/service/store';

export default {
    name: "profil",

    setup() {
        let password = ref('');
        let confirmPassword = ref('');

        let dialog = ref(false);

        const store = useStore();

        const deleteRestaurant = async () => {
            if (password.value === confirmPassword.value) {
                try {
                    const accessToken = localStorage.getItem('accessToken');

                    const response = await axios.delete('/api/delete-restaurant',
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });

                    dialog.value = true;

                    await store.dispatch('getRestaurant');
                }
                catch (error) {
                    console.log(error)
                }
            }
        }

        return {
            password,
            confirmPassword,
            dialog,

            deleteRestaurant
        }
    }
}
</script>