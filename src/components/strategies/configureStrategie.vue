<template>
    <v-dialog v-model="dialog" max-width="800px" persistent>
        <v-card>
            <v-card-title class="text-h5 bg-grey-darken-3 text-white">
                Configure {{ strategieName }}
            </v-card-title>

            <v-card-text class="pa-6">
                <!-- Toggle and Symbol Row -->
                <div class="text-subtitle-2 mb-2">Entry Condition Type</div>
                <v-row class="mb-4">
                    <v-col cols="12">  
                        <div>
                            <v-btn-toggle
                                v-model="strategyType"
                                color="primary"
                                mandatory
                                divided
                                variant="outlined"
                                class="w-100"
                            >
                                <v-btn value="buy" class="flex-grow-1">
                                    <v-icon start>mdi-arrow-up-bold</v-icon>
                                    Buy
                                </v-btn>
                                <v-btn value="sell" class="flex-grow-1">
                                    <v-icon start>mdi-arrow-down-bold</v-icon>
                                    Sell
                                </v-btn>
                            </v-btn-toggle>
                        </div>
                    </v-col>
                    <!-- <v-col cols="6">
                        <v-select
                            v-model="selectedSymbol"
                            :items="symbols"
                            label="Symbol"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-chart-line"
                        ></v-select>
                    </v-col> -->
                </v-row>
                <v-divider class="my-4"></v-divider>

                <!-- Entry Conditions Section -->
                <div class="text-h6 mb-4">Entry Conditions</div>
                
                <v-row 
                    v-for="(condition, index) in entryConditions" 
                    :key="'entry-' + index"
                    class="mb-3"
                >
                    <v-col cols="4">
                        <v-select
                            v-model="condition.price1"
                            :items="priceOptions"
                            label="Price/Indicator"
                            variant="outlined"
                            density="comfortable"
                        ></v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="condition.operator"
                            :items="operators"
                            label="Operator"
                            variant="outlined"
                            density="comfortable"
                        ></v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="condition.price2"
                            :items="priceOptions"
                            label="Price/Indicator"
                            variant="outlined"
                            density="comfortable"
                        ></v-select>
                    </v-col>
                    <v-col v-if="condition.operator === 'price_difference'" cols="4" class="text-center">
                        <v-text-field
                            v-model="condition.value"
                            label="Price Difference Value"
                            variant="outlined"
                            density="comfortable"
                            type="number"
                            prepend-inner-icon="mdi-calculator"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-divider class="my-6"></v-divider>

                <!-- Exit Conditions Section -->
                <div class="text-h6 mb-4">Exit Conditions</div>
                
                <v-row 
                    v-for="(condition, index) in exitConditions" 
                    :key="'exit-' + index"
                    class="mb-3"
                >
                    <v-col cols="4">
                        <v-select
                            v-model="condition.price1"
                            :items="priceOptions"
                            label="Price/Indicator"
                            variant="outlined"
                            density="comfortable"
                        ></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-select
                            v-model="condition.operator"
                            :items="operators"
                            label="Operator"
                            variant="outlined"
                            density="comfortable"
                        ></v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="condition.price2"
                            :items="priceOptions"
                            label="Price/Indicator"
                            variant="outlined"
                            density="comfortable"
                        ></v-select>
                    </v-col>
                    <v-col v-if="condition.operator === 'price_difference'" cols="4" class="text-center">
                        <v-text-field
                            v-model="condition.value"
                            label="Price Difference Value"
                            variant="outlined"
                            density="comfortable"
                            type="number"
                            prepend-inner-icon="mdi-calculator"
                            class="hide-spin-buttons"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions class="px-6 pb-6">
                <v-spacer></v-spacer>
                <v-btn
                    color="grey-darken-3"
                    variant="flat"
                    size="large"
                    @click="closeDialog()"
                    class="mr-2"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="primary"
                    variant="flat"
                    size="large"
                    @click="saveLogic"
                >
                    Save Logic
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

const dialog = ref(false);
const strategyType = ref('buy');
// const selectedSymbol = ref(null);
const strategieName = ref('');
const strategieId = ref(null);
const is_edit = ref(false);

// const symbols = [
//   'XAUUSD',   
//   'XAGUSD',
//   'EURUSD',
//   'GBPUSD',
//   'USDJPY'
// ];


const priceOptions = [
    'Open',
    'High',
    'Low',
    'Close',
    'SMA(20)',
    'EMA(50)',
    'RSI(14)',
    'MACD',
    'Volume'
];

const operators = [
    { title: '=', value: '=' },
    { title: '>', value: '>' },
    { title: '<', value: '<' },
    { title: '>=', value: '>=' },
    { title: '<=', value: '<=' },
    { title: '!=', value: '!=' },
    { title: 'Price Difference', value: 'price_difference' },
];

const entryConditions = ref([
    {
        price1: null,
        operator: null,
        price2: null,
        value: null
    }
]);

const exitConditions = ref([
    {
        price1: null,
        operator: null,
        price2: null,
        value: null
    }
]);
const getStrategieConfigureData = () => {
    const successHandler = (response) => {
        dialog.value = true;
        if (response.data.length > 0) {
            is_edit.value = true;
        }
        console.log('Strategy Conditions Data:', is_edit.value);
        if (response.data && response.data.length > 0) {
            const entryCondition = response.data[0]
            const exitCondition = response.data[1];
            // Map entry condition
            if (entryCondition) {
                strategyType.value = entryCondition.action; // 'buy' or 'sell'
                entryConditions.value = [{
                    price1: entryCondition.left_condition,
                    operator: entryCondition.operator,
                    price2: entryCondition.right_condition,
                    value: entryCondition.value
                }];
            }
            
            // Map exit condition
            if (exitCondition) {
                exitConditions.value = [{
                    price1: exitCondition.left_condition,
                    operator: exitCondition.operator,
                    price2: exitCondition.right_condition,
                    value: exitCondition.value
                }];
            }
        }
    };

    const failureHandler = (error) => {
        console.error('Error fetching strategy conditions:', error);
    };
    proxy.$api.request_GET(
        `/admin/strategy-conditions/${strategieId.value}`,
        {},
        successHandler,
        failureHandler
    );
};

const saveLogic = () => {
    const conditions = [];
    conditions[0] = {
        condition_type: 'entry',
        left_condition: entryConditions.value[0].price1,
        operator: entryConditions.value[0].operator,
        right_condition: entryConditions.value[0].price2,
        action: strategyType.value,
        value: entryConditions.value[0].value
    };
    conditions[1] = {
        condition_type: 'exit',
        left_condition: exitConditions.value[0].price1,
        operator: exitConditions.value[0].operator,
        right_condition: exitConditions.value[0].price2,
        action: strategyType.value == 'buy' ? 'sell' : 'buy',
        value: exitConditions.value[0].value
    };
    const data = {
        strategy_id: strategieId.value,
        conditions: conditions
    };

    const successHandler = () => {
        console.log('Logic saved successfully');
        closeDialog();
    };

    const failureHandler = (error) => {
        console.error('Error saving logic:', error);
    };
    is_edit.value ? proxy.$api.request_PUT(
        "/admin/strategy-conditions",
        "",
        data,
        successHandler,
        failureHandler
    ) : proxy.$api.request_POST(
        "/admin/strategy-conditions",
        data,
        successHandler,
        failureHandler
    );
};
const resetForm = () => {
    strategyType.value = 'buy';
    strategieName.value = '';
    strategieId.value = null;
    
    entryConditions.value = [{
        price1: null,
        operator: null,
        price2: null,
        value: null
    }];
    
    exitConditions.value = [{
        price1: null,
        operator: null,
        price2: null,
        value: null
    }];
};

const closeDialog = () => {
    dialog.value = false;
    is_edit.value = false;
    resetForm();
};


const openDialog = (item) => {
    strategieName.value = item.name;
    strategieId.value = item.id;
    getStrategieConfigureData();
};

defineExpose({
    openDialog
});
</script>