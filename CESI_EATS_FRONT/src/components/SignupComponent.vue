<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4" xl="4">
          <v-card class="mx-auto">
                <template v-slot:title>
                    Création de votre compte
                </template>

                <v-card-text />

                <v-card-text>
                    <v-text-field v-model="username" label="Nom d'utilisateur" density="compact" variant="outlined"></v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-text-field v-model="password" label="MDP" type="password" density="compact" variant="outlined"></v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-text-field v-model="confirmPassword" label="Confirmer" type="password" density="compact" variant="outlined" :rules="[() => confirmPassword === password || 'Les mots de passe ne correspondent pas']"></v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-text-field v-model="firstName" label="Prénom" density="compact" variant="outlined"></v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-text-field v-model="lastName" label="Nom" density="compact" variant="outlined"></v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-text-field v-model="phoneNumber" label="Numéro de téléphone" placeholder="XX XX XX XX XX" density="compact" variant="outlined"></v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-select v-model="gender" label="Sexe" density="compact" variant="outlined" :items="['Homme', 'Femme']" ></v-select>
                </v-card-text>

                <v-card-text>
                    <v-text-field v-model="address" label="Adresse" density="compact" variant="outlined"></v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-select v-model="country" label="Pays" density="compact" variant="outlined" :items="['France', 'Saint-Vincent-et-les-Grenadines', 'Papouasie Nouvelel-Guinne']"></v-select>
                </v-card-text>

                <v-card-text>
                    <v-select v-model="type" label="Type" density="compact" variant="outlined" :items="['Client', 'Restaurateur', 'Livreur']"></v-select>
                </v-card-text>

                <v-card-text>
                    <v-btn color="primary" @click="register()" location="center" size="large">S'enregistrer</v-btn>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from '@/service/axios'
import { useRouter } from 'vue-router';

export default {
    name: "signup",

    setup() {
        const username = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const firstName = ref('');
        const lastName = ref('');
        const phoneNumber = ref('');
        const gender = ref('');
        const address = ref('');
        const country = ref('');
        const type = ref('');

        const router = useRouter();

        const register = async () => {
            if(password.value === confirmPassword.value) {
                try {
                let result = await axios.post('/auth/create-user', {
                    nom: lastName.value,
                    prenom: firstName.value,
                    sexe: gender.value,
                    adresse: address.value,
                    pays: country.value,
                    username: username.value,
                    password: password.value,
                    type: type.value,
                    couleur: "",
                    phone: phoneNumber.value
                });

                router.push('/signin');
                console.log(result)
                }
                catch (error) {
                    console.log(error)
                }
            }
        };

        return {
            username,
            password,
            confirmPassword,
            firstName,
            lastName,
            phoneNumber,
            gender,
            address,
            country,
            type,
            
            register
        };
    },
}
</script>