<template>
    <div class="pa-4">
        <v-card>
            <v-card-title class="text-h5 pa-4">
                Broker Data
            </v-card-title>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="brokersData || []"
                    :items-per-page="10"
                    hide-default-footer
                    class="elevation-1"
                >
                    <template v-slot:item.price="{ item }">
                        ${{ item.price.toFixed(2) }}
                    </template>
                    <template v-slot:item.day="{ item }">
                        <v-chip 
                            :color="item.day === 'today' ? 'green' : 'blue'" 
                            small 
                            text-color="white"
                        >
                            {{ item.day }}
                        </v-chip>
                    </template>
                    <template v-slot:item.updated_at="{ item }">
                        {{ formatDate(item.updated_at) }}
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getCurrentInstance, onMounted } from 'vue';

const { proxy } = getCurrentInstance();
const brokersData = ref(null);

const headers = ref([
    { title: 'Broker Key', key: 'broker_key', align: 'start' },
    { title: 'Broker Name', key: 'broker_name' },
    { title: 'User ID', key: 'broker_userid' },
    { title: 'Day', key: 'day' },
    { title: 'Price', key: 'price' },
    { title: 'Source', key: 'source' },
    { title: 'Updated At', key: 'updated_at' }
]);

const getBrokersData = async () => {
    const params = {};
    const successHandler = (response) => {
        brokersData.value = response.data;
    };
    const failureHandler = (error) => {
        console.error("Error fetching brokers data:", error);
    };
    proxy.$api.request_GET(
        "/admin/broker/data",
        params,
        successHandler,
        failureHandler
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(() => {
    getBrokersData();
});
</script>