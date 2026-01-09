<template>
    <div>
       <v-row>
        <v-col 
            cols="12"
            class="d-flex justify-end px-6 my-4">
            <v-btn
                color="primary"
                prepend-icon="mdi-refresh"
                variant="flat"
                @click="getBrokersData()"
            >Refresh Broker Price</v-btn>
        </v-col>
       </v-row>

       <v-row>
        <v-col cols="12" class="px-6">
            <v-data-table
                :headers="headers"
                :items="brokersData"
                :loading="tableLoading"
                hide-default-footer
                class="elevation-1"
            >
                <template v-slot:item.price="{ item }">
                    ${{ item.price.toFixed(2) }}
                </template>
                
                <template v-slot:item.day="{ item }">
                    <v-chip 
                        :color="item.day === 'today' ? 'green' : 'blue'" 
                        size="small"
                        variant="flat"
                    >
                        {{ item.day }}
                    </v-chip>
                </template>
                
                <template v-slot:item.updated_at="{ item }">
                    {{ formatDate(item.updated_at) }}
                </template>
            </v-data-table>
        </v-col>
       </v-row>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const brokersData = ref([]);
const tableLoading = ref(false);

const headers = [
    { 
        title: 'Broker Key', 
        key: 'broker_key', 
        align: 'start',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    { 
        title: 'Broker Name', 
        key: 'broker_name',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    { 
        title: 'User ID', 
        key: 'broker_userid',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    { 
        title: 'Day', 
        key: 'day',
        align: 'center',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold text-center' }
    },
    { 
        title: 'Price', 
        key: 'price',
        align: 'end',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    { 
        title: 'Source', 
        key: 'source',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    { 
        title: 'Updated At', 
        key: 'updated_at',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    }
];

const getBrokersData = () => {
    tableLoading.value = true;
    const successHandler = (response) => {
        console.log('Brokers Data:', response.data);
        brokersData.value = response.data;
        tableLoading.value = false;
    };
    const failureHandler = (error) => {
        console.error("Error fetching brokers data:", error);
        tableLoading.value = false;
    };
    proxy.$api.request_GET(
        "/admin/broker/data",
        {},
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