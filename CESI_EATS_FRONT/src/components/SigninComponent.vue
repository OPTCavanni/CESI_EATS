<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4" xl="4">
          <v-card class="mx-auto">
                <template v-slot:title>
                    Connexion à votre compte
                </template>

                <v-card-text />

                <v-card-text>
                  <v-text-field v-model="username" label="Login" density="compact" variant="outlined"></v-text-field>
                </v-card-text>

                <v-card-text>
                  <v-text-field v-model="password" label="Mot de passe" type="password" density="compact" variant="outlined"></v-text-field>
                </v-card-text>

                <v-card-text>
                  <v-btn color="primary" @click="login()" location="center" size="large">Se connecter</v-btn>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from '@/service/axios'
import { useStore } from '@/service/store';
import { useRouter } from 'vue-router';

export default {
  name: "signin",

  setup() {
    const username = ref('');
    const password = ref('');
    const store = useStore();

    const router = useRouter();

    const login = async () => {
      try {
        let result = await axios.post('/auth/login', {
          username: username.value,
          password: password.value
        });
        let accessToken = result.data.accessToken;
        let refreshToken = result.data.refreshToken;

        store.commit('setAccessToken', accessToken);
        store.commit('setRefreshToken', refreshToken);

        store.dispatch('loginRoutine');

        router.push('/');
        console.log(result)
      }
      catch (error) {
        console.log(error)
      }
    };

    return {
      username,
      password,
      login
    };
  },
}
</script>