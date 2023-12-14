<script>
import { ref } from 'vue'
import axios from '@/service/axios'
import { useRouter } from 'vue-router';
import { useStore } from '@/service/store';

export default {
    data() {
        const store = useStore();

        return {
            title: '',
            description: '',
            price: '',
            file: '',
            vegan: 'Non-végétarien',
            stock: 'Rupture',
            dialog: false,
            dialogDelete: false,
            headers: [
                {
                    title: 'Liste et composition',
                    align: 'start',
                    sortable: false,
                    key: 'name',
                },
                { title: 'Dose', key: 'dose' },
                { title: 'Actions', key: 'actions', sortable: false },
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                name: '',
                dose: ''
            },
            defaultItem: {
                name: '',
                dose: '0g'
            },
            store,

            snackbar: false,
            snackbarText: '',
            snackbarColor: ''
        };
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nouvel Ingrédient' : 'Edit Item'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.initialize()
    },
    methods: {
        initialize() {
            // this.desserts = [{
            //     name: 'Ingrédient de 159g',
            //     dose: '159g'
            // }]
        },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.desserts.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem)
            } else {
                this.desserts.push(this.editedItem)
            }
            this.close()
        },
        async saveData() {
            const formData = {
                id_restaurant: this.store.getters.getRestaurantId,
                title: this.title,
                description: this.description,
                image: this.file,
                stock: this.stock,
                prix: this.price,
                vegan: this.vegan,
                ingredients: this.desserts
            };

            this.snackbar = true;
            this.snackbarText = 'Vous avez créé un nouvel article';
            this.snackbarColor = 'success';

            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.post('/articles/create-article', formData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
};
</script>

<template>
    <v-form>
        <v-container>
            <v-row justify="center"><v-col cols="8" md="8">
                    <v-text-field v-model="title" :counter="10" label="Nom de l'article"
                        required></v-text-field>
                </v-col>

                <v-col cols="8" md="8">
                    <v-textarea v-model="description" name="description" variant="filled" label="Description"
                        auto-grow></v-textarea>
                </v-col>

                <v-col cols="8" md="8">
                    <v-text-field v-model="price" label="Prix €" required></v-text-field>
                </v-col>

                <v-col cols="8" md="8">
                    <v-switch v-model="vegan" color="blue" hide-details true-value="Adapté au régime végétarien"
                        false-value="Non-végétarien" :label="`Vegan : ${vegan}`"></v-switch>
                    <v-switch v-model="stock" color="blue" hide-details true-value="Disponible" false-value="Rupture"
                        :label="`Stock : ${stock}`"></v-switch>
                </v-col>
                <v-col cols="8" md="8">
                    <v-text-field v-model="file" placeholder="Saisissez l'url de votre image" label="Image"
                        prepend-icon="mdi-camera"></v-text-field>
                </v-col>
                <v-col cols="8" md="8">
                    <v-data-table :headers="headers" :items="desserts" :sort-by="[{ key: 'dose', order: 'asc' }]"
                        class="elevation-1">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Mes ingrédients</v-toolbar-title>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>
                                <v-dialog v-model="dialog" max-width="500px">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="primary" dark class="mb-2" v-bind="props">
                                            Nouvel ingrédient
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span class="text-h5">{{ formTitle }}</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-row justify="center">
                                                    <v-col cols="12" sm="6" md="10">
                                                        <v-text-field v-model="editedItem.name"
                                                            label="Ingrédient"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="10">
                                                        <v-text-field v-model="editedItem.dose" label="Dose"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue-darken-1" variant="text" @click="close">
                                                Annuler
                                            </v-btn>
                                            <v-btn color="blue-darken-1" variant="text" @click="save">
                                                Enregistrer
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card>
                                        <v-card-title class="text-h5 text-center">Voulez-vous supprimer <br> définitivement
                                            cet ingrédient ?</v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Annuler</v-btn>
                                            <v-btn color="blue-darken-1" variant="text"
                                                @click="deleteItemConfirm">OK</v-btn>
                                            <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                                mdi-pencil
                            </v-icon>
                            <v-icon size="small" @click="deleteItem(item.raw)">
                                mdi-delete
                            </v-icon>
                        </template>
                        <template v-slot:no-data>
                            <v-btn color="primary" @click="initialize">
                                Aucun ingrédient
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col cols="8" md="8">
                    <v-btn class="me-4" @click="saveData()" color="primary">
                        Enregistrer
                    </v-btn>
                    <v-btn @click="initialize" color="secondary">
                        Réinitialiser le formulaire
                    </v-btn>
                </v-col>
            </v-row>
            <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
                {{ snackbarText }}
            </v-snackbar>
        </v-container>
    </v-form>
</template>