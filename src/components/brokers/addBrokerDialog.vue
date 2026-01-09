<template>
    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title class="text-h5 bg-primary">{{ editMode ? 'Edit Broker' : 'Add Broker' }}</v-card-title>
            <v-card-text class="px-6 pb-6">
                <v-text-field 
                    v-model="brokerForm.brokerName"
                    label="Broker Name"
                    placeholder="Enter the name of your broker"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                ></v-text-field>

                <v-row>
                    <v-col cols="6">
                        <v-text-field 
                            v-model="brokerForm.brokerId"
                            label="Broker ID"
                            placeholder="Enter your broker user ID"
                            variant="outlined"
                            density="comfortable"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field 
                            v-model="brokerForm.brokerPassword"
                            label="Broker Password"
                            placeholder="Enter your broker account password"
                            variant="outlined"
                            density="comfortable"
                            type="password"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-text-field
                    v-model="brokerForm.companyName"
                    label="Company Name (Must exactly match the registered company name)"
                    placeholder="Select or enter the company name"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                ></v-text-field>

                <v-text-field
                    v-model="brokerForm.server"
                    label="Server (Must exactly match the registered company name)"
                    placeholder="Select or enter the server name"
                    variant="outlined"
                    density="comfortable"
                ></v-text-field>
            </v-card-text>
            <v-card-actions class="px-6 pb-6">
                <v-row>
                    <v-col cols="6">
                        <v-btn 
                            color="grey-darken-3" 
                            variant="flat"
                            class="mr-2"
                            block
                            @click="closeDialog()"
                            size="large"
                        >CANCEL
                        </v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn 
                            color="primary" 
                            variant="flat"
                            block
                            size="large"
                            @click="editMode ? editBroker() : submitBroker()"
                        >SUBMIT</v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup> 
import { ref, reactive } from 'vue';
import { getCurrentInstance } from 'vue';
import { defineEmits } from 'vue';
const { proxy } = getCurrentInstance();
const emit = defineEmits(['eventName', 'anotherEvent']);

const dialog = ref(false);
const editMode = ref(false);

const brokerForm = reactive({
    brokerName: '',
    brokerId: '',
    brokerPassword: '',
    companyName: '',
    server: ''
});

const openBrokerDialog = () => {
    dialog.value = true;    
}
const closeDialog = () => {
    dialog.value = false;
    brokerForm.brokerName = '';
    brokerForm.brokerId = '';
    brokerForm.brokerPassword = '';
    brokerForm.companyName = '';
    brokerForm.server = '';
    brokerForm.user_id = '';

}
const submitBroker = () => {
    dialog.value = false;

    const data = {
        broker_name: brokerForm.brokerName,
        broker_userid: brokerForm.brokerId,
        broker_password: brokerForm.brokerPassword,
        company_name: brokerForm.companyName,
        server_name: brokerForm.server
    };

    const successHandler = () => {
        closeDialog();
        emit('reloadBrokers');
    };
    const failureHandler = (error) => {
        console.error("Error:", error);
    };
    proxy.$api.request_POST( 
        "admin/brokers",
        data,
        successHandler,
        failureHandler
    );

};
const editBroker = () => {
    const look_up_key = brokerForm.user_id;
    const data = {
        broker_name: brokerForm.brokerName,
        broker_userid: brokerForm.brokerId,
        broker_password: brokerForm.brokerPassword,
        company_name: brokerForm.companyName,
        server_name: brokerForm.server
    };

    const successHandler = () => {
        closeDialog();
        emit('reloadBrokers');
    };
    const failureHandler = (error) => {
        console.error("Error:", error);
    };
    proxy.$api.request_PUT( 
        "admin/brokers/",
        look_up_key,
        data,
        successHandler,
        failureHandler
    );

};

defineExpose({
    openBrokerDialog,
    dialog,
    editMode,
    brokerForm
});
</script>