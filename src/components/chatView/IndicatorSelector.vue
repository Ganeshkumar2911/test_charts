<template>
    <v-menu v-model="menu" :close-on-content-click="false" location="top">
        <template v-slot:activator="{ props }">
            <v-btn
                flat
                v-bind="props"
                class="text-capitalize"
                :class="isDarkMode ? 'bg-grey-darken-4 text-white' : 'bg-white'"
            >
                <v-icon icon="mdi-chart-timeline-variant-shimmer" size="small" class="mr-2"></v-icon>
                Indicators
                <v-badge 
                    v-if="selectedIndicatorsModel.length > 0" 
                    :content="selectedIndicatorsModel.length" 
                    color="primary"
                    inline
                    class="ml-2"
                ></v-badge>
            </v-btn>
        </template>

        <v-card 
            class="my-2" 
            min-width="250"
            :class="isDarkMode ? 'bg-grey-darken-4' : 'bg-white'"
        >
            <v-card-title 
                class="text-subtitle-1 font-weight-bold pa-3"
                :class="isDarkMode ? 'text-white' : ''"
            >
                Select Indicators
            </v-card-title>
            <v-divider></v-divider>
            
            <v-list 
                density="compact" 
                max-height="600" 
                class="overflow-y-auto"
                :class="isDarkMode ? 'bg-grey-darken-4' : ''"
            >
                <v-list-item
                    v-for="indicator in indicators"
                    :key="indicator.value"
                    @click="toggleIndicator(indicator)"
                    class="cursor-pointer"
                    :class="isDarkMode ? 'text-white' : ''"
                >
                    <template v-slot:prepend>
                        <v-checkbox-btn
                            :model-value="isSelected(indicator)"
                            @click.stop="toggleIndicator(indicator)"
                            color="primary"
                        ></v-checkbox-btn>
                    </template>
                    <v-list-item-title>{{ indicator.label }}</v-list-item-title>
                </v-list-item>
            </v-list>
            
            <v-divider></v-divider>
            <v-card-actions :class="isDarkMode ? 'bg-grey-darken-4' : ''">
                <v-btn
                    variant="text"
                    size="small"
                    @click="clearAll"
                    :disabled="selectedIndicatorsModel.length === 0"
                    :class="isDarkMode ? 'text-white' : ''"
                >
                    Clear All
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDarkMode } from '@/constants/useDarkMode';
const { isDarkMode } = useDarkMode();

const props = defineProps({
    selectedIndicators: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['update:selectedIndicators']);

const menu = ref(false);

const selectedIndicatorsModel = computed({
    get: () => props.selectedIndicators,
    set: (value) => emit('update:selectedIndicators', value)
});

const indicators = [
    // On Chart (Overlay indicators)
    { label: 'MA', value: 'ma', params: '[5, 10, 30, 60]', inChartPane: true },
    { label: 'EMA', value: 'ema', params: '[6, 12, 20]', inChartPane: true },
    { label: 'SMA', value: 'sma', params: '[12, 2]', inChartPane: true },
    { label: 'BBI', value: 'bbi', params: '[3, 6, 12, 24]', inChartPane: true },
    { label: 'BOLL', value: 'boll', params: '[20, 2]', inChartPane: true },
    { label: 'DMA', value: 'dma', params: '[10, 50, 10]', inChartPane: true },
    { label: 'SAR', value: 'sar', params: '[2, 2, 20]', inChartPane: true },
    
    // Below Chart (Separate pane indicators)
    { label: 'VOL', value: 'vol', params: '[5, 10, 20]', inChartPane: false },
    { label: 'MACD', value: 'macd', params: '[12, 26, 9]', inChartPane: false },
    { label: 'KDJ', value: 'kdj', params: '[9, 3, 3]', inChartPane: false },
    { label: 'RSI', value: 'rsi', params: '[6, 12, 24]', inChartPane: false },
    { label: 'BIAS', value: 'bias', params: '[6, 12, 24]', inChartPane: false },
    { label: 'BRAR', value: 'brar', params: '[26]', inChartPane: false },
    { label: 'CCI', value: 'cci', params: '[13]', inChartPane: false },
    { label: 'DMI', value: 'dmi', params: '[14, 6]', inChartPane: false },
    { label: 'CR', value: 'cr', params: '[26, 10, 20, 40, 60]', inChartPane: false },
    { label: 'PSY', value: 'psy', params: '[12, 6]', inChartPane: false },
    { label: 'TRIX', value: 'trix', params: '[12, 20]', inChartPane: false },
    { label: 'OBV', value: 'obv', params: '[30]', inChartPane: false },
    { label: 'VR', value: 'vr', params: '[24, 30]', inChartPane: false },
    { label: 'WR', value: 'wr', params: '[6, 10, 14]', inChartPane: false },
    { label: 'MTM', value: 'mtm', params: '[6, 10]', inChartPane: false },
    { label: 'EMV', value: 'emv', params: '[14, 9]', inChartPane: false },
    { label: 'AO', value: 'ao', params: '[5, 34]', inChartPane: false },
    { label: 'ROC', value: 'roc', params: '[12, 6]', inChartPane: false },
    { label: 'PVT', value: 'pvt', params: 'None', inChartPane: false },
    { label: 'AVP', value: 'avp', params: 'None', inChartPane: false }
];

const isSelected = (indicator) => {
    return selectedIndicatorsModel.value.some(i => i.value === indicator.value);
};

const toggleIndicator = (indicator) => {
    const index = selectedIndicatorsModel.value.findIndex(i => i.value === indicator.value);
    if (index > -1) {
        selectedIndicatorsModel.value = selectedIndicatorsModel.value.filter(i => i.value !== indicator.value);
    } else {
        selectedIndicatorsModel.value = [...selectedIndicatorsModel.value, indicator];
    }
};

const clearAll = () => {
    selectedIndicatorsModel.value = [];
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>