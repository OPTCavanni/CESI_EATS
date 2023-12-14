<script>
import { ref } from 'vue';
import axios from '../service/axios';
import { useRouter } from 'vue-router';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },
    data() {
        return {
            showGraph1: false,
            showGraph2: false,
            chartData: {
                labels: [],
                datasets: []
            },
            chartOptions: {
                responsive: true,
            },
            chartData2: {
                labels: [],
                datasets: []
            }
        };
    },
    mounted() {
        this.showGraph1 = false;
        this.showGraph2 = false;
        this.fetchStat();
    },
    methods: {
        async fetchStat() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result = await axios.get('/api/stats/1', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.chartData.labels = Object.keys(result.data);
                this.chartData.datasets = [{ label: "Nombre", 
                backgroundColor: 'rgba(66, 135, 245, 0.2)',
                data: Object.values(result.data) }];
            }
            catch (error) {
                console.log(error);
            }
            try {
                const accessToken = localStorage.getItem('accessToken');
                let result2 = await axios.get('/api/stats/2', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                this.chartData2.labels = result2.data[0].menu;
                this.chartData2.datasets = [{ label: "Nombre", 
                backgroundColor: 'rgba(66, 135, 245, 0.2)',
                data: result2.data[0].nombre }];
            }
            catch (error) {
                console.log(error);
            }
        },
        togglegraph1() {
            this.showGraph1 = true;
        },
        togglegraph2() {
            this.showGraph2 = true;
        }
    },
}


</script>

<template>
    <v-btn color="red" @click="togglegraph1()">
        Etat commandes
    </v-btn>
    <br>
    <v-btn color="green" @click="togglegraph2()">
        Vente menus
    </v-btn>
    <v-dialog v-model="showGraph1" max-width="600">
        <v-card>
            <v-card-title>Statistiques :</v-card-title>
            <v-card-text>
                <Bar id="stat1" :options="this.chartOptions" :data="this.chartData" />
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="showGraph2" max-width="600">
        <v-card>
            <v-card-title>Statistiques :</v-card-title>
            <v-card-text>
                <Bar id="stat2" :options="this.chartOptions" :data="this.chartData2" />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>