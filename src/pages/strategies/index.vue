<template>
    <div>
       <v-row>
        <v-col 
            cols="12"
            class="d-flex justify-end px-6 my-4">
            <v-btn
                color="success"
                prepend-icon="mdi-plus"
                variant="flat"
                @click="openStrategieDialog()"
            >Add Strategiest</v-btn>
        </v-col>
       </v-row>

       <v-row>
        <v-col cols="12" class="px-6">
            <v-data-table
                :headers="headers"
                :items="strategiesList"
                :loading="tableLoading"
                hide-default-footer
                class="elevation-1"
                @click:row="OpenConfigureStrategieDialog"
            >
                <template v-slot:item.is_enabled="{ item }">
                    <div @click.stop class="d-flex justify-center">
                        <v-switch
                            v-model="item.is_enabled"
                            color="success"
                            inset
                            hide-details
                            density="compact"
                            @change="toggleStrategie(item)"
                        ></v-switch>
                    </div>
                </template>

                <template v-slot:item.created_at="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:item.actions="{ item }">
                    <div @click.stop>
                        <v-btn
                        icon
                        variant="text"
                        color="primary"
                        @click="editStrategie(item)"
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        variant="text"
                        color="error"
                        @click="deleteStrategie(item)"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-col>
       </v-row>

        <addStrategieDialog @reloadStrategies="getStrategieList()" ref="strategieDialog" />
        <conformationDialog @reloadStrategies="getStrategieList()" ref="conformation" />
        <configureStrategie ref="configureStrategie"/>
    </div>
</template>

<script setup>
import addStrategieDialog from '@/components/strategies/addstrategieDialog.vue';
import conformationDialog from '@/components/strategies/conformationDialog.vue';
import  ConfigureStrategie from '@/components/strategies/configureStrategie.vue';
import { onMounted, ref } from 'vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

const strategieDialog = ref(null);
const configureStrategie = ref(null);
const conformation = ref(null);
const strategiesList = ref([]);
const tableLoading = ref(false);

const headers = [
    {
        title: 'ID',
        key: 'id',
        sortable: false,
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    {
        title: 'Strategy Name',
        key: 'name',
        sortable: false,
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    {
        title: 'Symbol',
        key: 'symbol',
        sortable: false,
        headerProps: { class: 'bg-grey-darken-3 text-white font-weight-bold' }
    },
    {
        title: 'Created At',
        key: 'created_at',
        sortable: false,
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

const openStrategieDialog = () => {
    strategieDialog.value.openDialog();    
}
const OpenConfigureStrategieDialog = (event, { item }) => {
    configureStrategie.value.openDialog(item);
}
const deleteStrategie = (item) => {
    conformation.value.openDialog(item);
}

const getStrategieList = () => {
    tableLoading.value = true;
    const successHandler = (response) => {
        strategiesList.value = response.data;
        tableLoading.value = false;
    };
    const failureHandler = (error) => {
        console.error('Error:', error);
        tableLoading.value = false;
    }
    proxy.$api.request_GET(
        'admin/strategies',
        {},
        successHandler,
        failureHandler
    );
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const toggleStrategie = (item) => {
    const look_up_key = item.id;
    const data = {
        is_enabled: item.is_enabled
    };
    const successHandler = () => {
        // Success: no-op (UI already updated via v-model)
    };
    const failureHandler = (error) => {
        console.error('Error:', error);
        item.is_enabled = !item.is_enabled; // Revert on error
    };
    proxy.$api.request_PUT(
        'admin/strategies/',
        look_up_key,
        data,
        successHandler,
        failureHandler
    );
}

const editStrategie = (item) => {
    // Open the strategie dialog in edit mode and populate fields
    if (strategieDialog.value && strategieDialog.value.openDialog) {
        strategieDialog.value.openDialog(item);
    }
}

onMounted(() => {
    getStrategieList();
});
</script>