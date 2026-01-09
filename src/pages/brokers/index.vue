<template>
    <div>
       <v-row>
        <v-col 
            cols="12"
            class="d-flex justify-end px-6 my-4">
            <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                variant="flat"
                @click="openBrokerDialog()"
            >Add Broker</v-btn>
        </v-col>
       </v-row>
       
       <v-row>
        <v-col cols="12" class="px-6">
            <v-data-table
                :headers="headers"
                :items="brokersData"
                :loading="tableLoanding"
                hide-default-footer
                class="elevation-1"
            >
                <template v-slot:item.actions="{ item }">
                        <v-btn  
                            :color="item.is_connected ? 'error' : 'primary'" 
                            variant="outlined"
                            class="rounded-xl"
                            size="small"
                            :disabled="DisbaleDisconnect"
                            :loading="DisbaleDisconnect"
                            @click="ConnectDisconnectBroker(item)"
                        >
                            {{ item.is_connected ? 'Disconnect' : 'Connect' }}
                        </v-btn>
                        <v-btn
                            icon
                            @click="editBroker(item)"
                            flat
                            class="rounded-xl mx-2"
                        >
                            <v-icon color="primary">mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                            icon
                            flat
                            class="rounded-xl mx-2"
                        >
                            <v-icon color="primary">mdi-wallet-bifold</v-icon>
                        </v-btn>
                </template>

                <template v-slot:item.is_enabled="{ item }">
                    <div class="d-flex justify-center">
                        <v-switch
                            v-model="item.is_enabled"
                            color="primary"
                            inset
                            hide-details
                            density="compact"
                            @change="enableBroker(item)"
                        ></v-switch>
                    </div>
                </template>
            </v-data-table>
        </v-col>
       </v-row>
       
       <AddBrokerDialog @reloadBrokers="getBrokers()" ref="brokerDialog"/>
       
       <!-- Connecting Bottom Sheet -->
       <v-bottom-sheet v-model="showConnectingSheet" persistent>
           <v-card>
               <v-card-text class="text-center py-8">
                   <v-progress-circular
                       indeterminate
                       color="primary"
                       size="64"
                       class="mb-4"
                   ></v-progress-circular>
                   <div class="text-h6">Connecting...</div>
                   <div class="text-caption text-grey mt-2">Please wait while we establish connection</div>
               </v-card-text>
           </v-card>
       </v-bottom-sheet>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AddBrokerDialog from '@/components/brokers/addBrokerDialog.vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

const brokerDialog = ref(null);
const tableLoanding = ref(false);
const brokersData = ref([]);
const DisbaleDisconnect = ref(false);
const showConnectingSheet = ref(false);

const headers = [
    { 
        title: 'Broker Key', 
        key: 'broker_key', 
        sortable: false,
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    { 
        title: 'Broker Name', 
        key: 'broker_name', 
        sortable: false,
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    { 
        title: 'User ID', 
        key: 'broker_userid', 
        sortable: false,
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    { 
        title: 'Server', 
        key: 'server_name', 
        sortable: false,
        align: 'center',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    { 
        title: 'Enabled', 
        key: 'is_enabled', 
        sortable: false, 
        align: 'center',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold text-center' }
    },
    { 
        title: 'Actions', 
        key: 'actions', 
        sortable: false, 
        align: 'center',
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold text-center' }
    }
];

onMounted(() => {
    getBrokers();
});

const openBrokerDialog = () => {
    brokerDialog.value.openBrokerDialog();
};

const editBroker = (item) => {
    brokerDialog.value.dialog = true;
    brokerDialog.value.editMode = true;
    brokerDialog.value.brokerForm.brokerName = item.broker_name;
    brokerDialog.value.brokerForm.brokerId = item.broker_userid;
    brokerDialog.value.brokerForm.companyName = item.company_name;
    brokerDialog.value.brokerForm.server = item.server_name; 
    brokerDialog.value.brokerForm.brokerPassword = item.broker_password; 
    brokerDialog.value.brokerForm.user_id = item.user_id; 
};

const getBrokers = () => {
    tableLoanding.value = true;
    const successHandler = (response) => {
        console.log("Brokers Data:", response.data);
        brokersData.value = response.data;
        tableLoanding.value = false;
    };
    const failureHandler = (error) => {
        console.error("Error:", error);
        tableLoanding.value = false;
    };
    proxy.$api.request_GET(
        'admin/brokers',
        {},
        successHandler,
        failureHandler
    );
};

const getBrokersConnectionStatus = (item) => {
    const successHandler = (response) => {
        if(response.status === "processing") {
            setTimeout(() => {
                getBrokersConnectionStatus(item);
            }, 1000);
        } else if (response.status === "connected") {
            item.is_connected = true;
            showConnectingSheet.value = false;
        } else {
            item.is_connected = false;
            showConnectingSheet.value = false;
        }
    };
    const failureHandler = (error) => {
        console.error("Error:", error);
        showConnectingSheet.value = false;
    };
    proxy.$api.request_GET(
        `/admin/brokers/connect/status/${item.user_id}`,
        {},
        successHandler,
        failureHandler
    );
};

const ConnectDisconnectBroker = (item) => {
    const look_up_key = item.user_id;
    const data = {
        is_connected: !item.is_connected
    };
    
    if(item.is_connected) {
        DisbaleDisconnect.value = true;
    } else {
        showConnectingSheet.value = true;
    }
    
    const successHandler = () => {
       if (!item.is_connected) {
            getBrokersConnectionStatus(item); 
        } else {
            item.is_connected = false;
        }
        DisbaleDisconnect.value = false;
    };
    const failureHandler = (error) => {
        console.error("Error:", error);
        showConnectingSheet.value = false;
    };
    proxy.$api.request_PUT(
        item.is_connected ? "/admin/brokers/disconnect/" : "/admin/brokers/connect/",
        look_up_key,
        data,
        successHandler,
        failureHandler
    );
};

const enableBroker = (item) => {
    const look_up_key = item.user_id;
    const data = {
        is_enabled: item.is_enabled
    };
    const successHandler = () => {
        // item.is_enabled = response.data.is_enabled;
    };
    const failureHandler = (error) => {
        item.is_enabled = !item.is_enabled;
    };
    proxy.$api.request_PUT(
        "admin/brokers/",
        look_up_key,
        data,
        successHandler,
        failureHandler
    );
};
</script>