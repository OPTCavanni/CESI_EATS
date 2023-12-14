<template>
    <v-container fill-height>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6" lg="4" xl="4">
                <v-card class="mx-auto">
                    <template v-slot:title>
                        Vos Informations Personnelles
                    </template>

                    <v-card-text />

                    <v-card-text>
                        <v-text-field v-model="firstname" label="Nom" density="compact" variant="outlined" :rules="[required]"></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-text-field v-model="lastname" label="Prénom" density="compact" variant="outlined" :rules="[required]"></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-text-field v-model="phoneNumber" label="N° Téléphone" density="compact"
                            variant="outlined" :rules="[required]"></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-select v-model="gender" label="Sexe" density="compact" variant="outlined"
                            :items="['Homme', 'Femme']" :rules="[required]"></v-select>
                    </v-card-text>

                    <v-card-text>
                        <v-text-field v-model="address" label="Addresse" density="compact"
                            variant="outlined" :rules="[required]"></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-select v-model="country" label="Pays" density="compact" variant="outlined"
                            :items="['France', 'Saint-Vincent-et-les-Grenadines', 'Papouasie Nouvelel-Guinne']" :rules="[required]"></v-select>
                    </v-card-text>

                    <v-card-text>
                        <v-text-field v-model="user_code" label="Votre Code de parainnage" density="compact" variant="outlined" disabled :rules="[required]"></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-text-field v-model="parain" label="Le code de votre parain" density="compact" variant="outlined" :rules="[required]"></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-btn color="primary" @click="modifyInformation" location="center" size="large" :rules="[required]">Modifier mes
                            informations</v-btn>
                    </v-card-text>

                    <v-card-text>
                        <v-btn color="primary" location="center" size="large" @click="dialog = true">Changer login ou mot de passe</v-btn>
                    </v-card-text>

                    <v-card-text>
                        <v-btn color="primary" location="center" size="large" @click="deleteAccount">Supprimer mon compte</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="headline">Changer login ou mot de passe</v-card-title>

                <v-card-text>
                    <v-text-field v-model="username" label="Nouveau Login" density="compact" variant="outlined" :rules="[required]"></v-text-field>
                    <v-text-field v-model="newPassword" label="Nouveau Mot de passe" type="password" density="compact" variant="outlined" :rules="[required]"></v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-text-field v-model="password" label="Mot de passe" density="compact" variant="outlined" :rules="[required]"></v-text-field>
                    <v-text-field v-model="confirmPassword" label="Confirmer mot de passe" type="password" density="compact" variant="outlined" :rules="[() => confirmPassword === password || 'Les mots de passe ne correspondent pas']"></v-text-field>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" @click="changeLoginPassword">Changer</v-btn>
                    <v-btn color="red darken-1" @click="dialog = false">Fermer</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
            {{ snackbarText }}
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from '@/service/axios'
import { pauseTracking } from '@vue/reactivity';

export default {
    name: "profil",

    setup() {
        let firstname = ref('');
        let lastname = ref('');
        let phoneNumber = ref('');
        let gender = ref('');
        let address = ref('');
        let country = ref('');
        let user_code = ref('');
        let parain = ref('');

        let dialog = ref(false);
        let username = ref('');
        let newPassword = ref('');
        let password = ref('');
        let confirmPassword = ref('');

        const snackbar = ref(false);
        const snackbarText = ref('');
        const snackbarColor = ref('');

        const changeLoginPassword = async () => {
            if (password.value === confirmPassword.value) {
                try {
                    const accessToken = localStorage.getItem('accessToken');

                    const response = await axios.put('/api/update-user-credential',
                        {
                            password: password.value,
                            new_username: username.value,
                            new_password: newPassword.value,
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });

                    dialog.value = true;
                }
                catch (error) {
                    console.log(error)
                }
            }
        };

        const getInfo = async () => {

            try {
                const accessToken = localStorage.getItem('accessToken');

                const response = await axios.get('/api/display-user', 
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                firstname.value = response.data.o_user_prenom
                lastname.value = response.data.o_user_nom
                phoneNumber.value = response.data.o_user_phone
                gender.value = response.data.o_user_sexe
                address.value = response.data.o_user_adresse
                country.value = response.data.o_user_pays
                user_code.value = response.data.o_user_code_parain
                parain.value = response.data.o_user_parain
            }

            catch (error) {
                console.log(error);
            }
        }

        const modifyInformation = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                const response = await axios.put('/api/update-user',
                    {
                        nom: firstname.value,
                        prenom: lastname.value,
                        sexe: gender.value,
                        adresse: address.value,
                        pays: country.value,
                        color: "",
                        phone: phoneNumber.value,
                        parain: parseInt(parain.value),

                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                snackbar.value = true;
                snackbarText.value = 'Modification effectuée avec succès !';
                snackbarColor.value = 'success';
            }
            catch (error) {
                console.log(error)
            }
        }

        const deleteAccount = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                const response = await axios.delete('/api/delete-user',
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
            }
            catch (error) {
                console.log(error)
            }
        }

        getInfo()

        return {
            firstname,
            lastname,
            phoneNumber,
            gender,
            address,
            country,
            user_code,
            parain, 

            getInfo,
            modifyInformation,

            dialog,
            username,
            newPassword,
            password,
            confirmPassword,
            changeLoginPassword,

            deleteAccount,

            snackbar,
            snackbarText,
            snackbarColor,
        }
    },

    methods: {
        required(v: string) {
            return !!v || 'Field is required'
        },
    }
}
</script>