<template>
    <v-dialog v-model="dialog" max-width="500">
        <v-card>
            <v-card-title class="bg-grey-darken-3">Are you sure ?</v-card-title>
            <v-card-text class="text-medium-emphasis">
                You want to delete strategie {{ strategieName }}?
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="outlined" color="grey lighten-1" text @click="dialog = false">Cancel</v-btn>
                <v-btn variant="flat" color="error darken-1" text @click="confirmAction">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { ref } from 'vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const emit = defineEmits(['close', 'confirm']);
const dialog = ref(false);
const strategieName = ref('');
const look_up_key = ref("");

const openDialog = (item) => {
    strategieName.value = item.name;
    look_up_key.value = item.id;
    dialog.value = true;
};
const confirmAction = () => {
    const successHandler = () => {
        dialog.value = false;
        emit('reloadStrategies');
    };
    const failureHandler = (error) => {
        console.error("Error:", error);
    };
    proxy.$api.request_DELETE(
    'admin/strategies/',
    look_up_key.value, 
    successHandler,
    failureHandler
);
};
defineExpose({
    openDialog
});
</script>