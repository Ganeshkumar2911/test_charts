<template>
    <v-dialog v-model="dialog" max-width="500px" persistent>
        <v-card>
            <v-card-title class="text-h6 px-6 bg-grey-darken-3">{{ editMode ? 'Edit Strategie' : 'Add New Strategie' }}</v-card-title>
            <v-card-text class="px-6">
                <v-text-field
                    label="Strategie Name"
                    v-model="strategieName"
                    placeholder="Enter the name of your strategie"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                ></v-text-field>
                <v-select
                    v-model="selectedSymbol"
                    :items="symbols"
                    class="mt-6"
                    label="Symbol"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-chart-line"
                ></v-select>
            </v-card-text>
            <v-card-actions class="px-6 pb-6">
                <v-spacer></v-spacer>
                <v-btn
                    color="error"
                    variant="outlined"
                    @click="closeDialog()"
                    class="mr-2"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="success"
                    variant="flat"
                    :loading="isSubmitting"
                    :disabled="isSubmitting"
                    @click="createStrategie()"
                >
                    {{ editMode ? 'Save' : 'Create' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
import { defineEmits } from 'vue';
const emit = defineEmits(['eventName', 'anotherEvent']);

    const dialog = ref(false);
    const editMode = ref(false);
    const strategieId = ref(null);
    const selectedSymbol = ref(null);
    const strategieName = ref('');
    const isSubmitting = ref(false);
    const symbols = [
        'XAUUSD',   
        'XAGUSD',
        'EURUSD',
        'GBPUSD',
        'USDJPY'
    ];
    const openDialog = (item = null) => {
        if (item) {
            editMode.value = true;
            strategieId.value = item.id;
            strategieName.value = item.name;
            selectedSymbol.value = item.symbol;
        } else {
            editMode.value = false;
            strategieId.value = null;
            strategieName.value = '';
        }
        dialog.value = true;
    }
    const closeDialog = () => {
        dialog.value = false;
        editMode.value = false;
        strategieId.value = null;
        strategieName.value = '';
    }   
    const createStrategie = () => {
        const data = {
            name: strategieName.value,
            symbol: selectedSymbol.value
        };
        isSubmitting.value = true;
        const successHandler = () => {
            isSubmitting.value = false;
            dialog.value = false;
            editMode.value = false;
            strategieId.value = null;
            emit('reloadStrategies');
        };
        const failureHandler = (error) => {
            isSubmitting.value = false;
            console.error("Error:", error);
        };
        if (editMode.value && strategieId.value !== null) {
            proxy.$api.request_PUT(
                "/admin/strategies/",
                strategieId.value,
                data,
                successHandler,
                failureHandler
            );
        } else {
            proxy.$api.request_POST(
                "/admin/strategies",
                data,
                successHandler,
                failureHandler
            );
        }
    } 
    defineExpose({
        openDialog,
        dialog,
        editMode,
        strategieName,
        strategieId
    });
</script>