<template>
    <v-menu v-model="menu" :close-on-content-click="false" location="top">
        <template v-slot:activator="{ props }">
            <v-btn
                flat
                v-bind="props"
                class="text-capitalize"
                :class="themeStore.isDarkMode ? 'bg-grey-darken-4 text-white' : 'bg-white'"
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
            min-width="300"
            :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : 'bg-white'"
        >
            <v-card-title 
                class="text-subtitle-1 font-weight-bold pa-3"
                :class="themeStore.isDarkMode ? 'text-white' : ''"
            >
                Select Indicators
            </v-card-title>
            <v-divider></v-divider>
            
            <v-list 
                density="compact" 
                max-height="600" 
                class="overflow-y-auto"
                :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : ''"
            >
                <v-list-item
                    v-for="indicator in indicators"
                    :key="indicator.value"
                    @click="toggleIndicator(indicator)"
                    class="cursor-pointer"
                    :class="themeStore.isDarkMode ? 'text-white' : ''"
                >
                    <template v-slot:prepend>
                        <v-checkbox-btn
                            :model-value="isSelected(indicator)"
                            @click.stop="toggleIndicator(indicator)"
                            color="primary"
                        ></v-checkbox-btn>
                    </template>
                    
                    <template v-slot:default>
                        <div class="d-flex align-center">
                            <span class="material-symbols-outlined mr-3" style="font-size: 20px;">
                                {{ indicator.icon }}
                            </span>
                            <v-list-item-title>
                                {{ indicator.fullName }} ({{ indicator.label }})
                            </v-list-item-title>
                        </div>
                    </template>
                </v-list-item>
            </v-list>
            
            <v-divider></v-divider>
            <v-card-actions :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : ''">
                <v-btn
                    variant="text"
                    size="small"
                    @click="clearAll"
                    :disabled="selectedIndicatorsModel.length === 0"
                    :class="themeStore.isDarkMode ? 'text-white' : ''"
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
import { useThemeStore } from '@/store/theme';

const themeStore = useThemeStore()

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
    { label: 'MA', fullName: 'Moving Average', value: 'ma', params: '[5, 10, 30, 60]', inChartPane: true, icon: 'show_chart' },
    { label: 'EMA', fullName: 'Exponential Moving Average', value: 'ema', params: '[6, 12, 20]', inChartPane: true, icon: 'trending_up' },
    { label: 'SMA', fullName: 'Simple Moving Average', value: 'sma', params: '[12, 2]', inChartPane: true, icon: 'timeline' },
    { label: 'BBI', fullName: 'Bull and Bear Index', value: 'bbi', params: '[3, 6, 12, 24]', inChartPane: true, icon: 'finance' },
    { label: 'BOLL', fullName: 'Bollinger Bands', value: 'boll', params: '[20, 2]', inChartPane: true, icon: 'linear_scale' },
    { label: 'DMA', fullName: 'Different Moving Average', value: 'dma', params: '[10, 50, 10]', inChartPane: true, icon: 'stacked_line_chart' },
    { label: 'SAR', fullName: 'Stop and Reverse', value: 'sar', params: '[2, 2, 20]', inChartPane: true, icon: 'bubble_chart' },
    
    // Below Chart (Separate pane indicators)
    { label: 'VOL', fullName: 'Volume', value: 'vol', params: '[5, 10, 20]', inChartPane: false, icon: 'bar_chart' },
    { label: 'MACD', fullName: 'Moving Average Convergence Divergence', value: 'macd', params: '[12, 26, 9]', inChartPane: false, icon: 'analytics' },
    { label: 'KDJ', fullName: 'Stochastic Oscillator', value: 'kdj', params: '[9, 3, 3]', inChartPane: false, icon: 'multiline_chart' },
    { label: 'RSI', fullName: 'Relative Strength Index', value: 'rsi', params: '[6, 12, 24]', inChartPane: false, icon: 'speed' },
    { label: 'BIAS', fullName: 'Bias Ratio', value: 'bias', params: '[6, 12, 24]', inChartPane: false, icon: 'align_vertical_bottom' },
    { label: 'BRAR', fullName: 'Bull Ratio and Bear Ratio', value: 'brar', params: '[26]', inChartPane: false, icon: 'compare_arrows' },
    { label: 'CCI', fullName: 'Commodity Channel Index', value: 'cci', params: '[13]', inChartPane: false, icon: 'waves' },
    { label: 'DMI', fullName: 'Directional Movement Index', value: 'dmi', params: '[14, 6]', inChartPane: false, icon: 'call_split' },
    { label: 'CR', fullName: 'Energy Index', value: 'cr', params: '[26, 10, 20, 40, 60]', inChartPane: false, icon: 'bolt' },
    { label: 'PSY', fullName: 'Psychological Line', value: 'psy', params: '[12, 6]', inChartPane: false, icon: 'psychology' },
    { label: 'TRIX', fullName: 'Triple Exponential Average', value: 'trix', params: '[12, 20]', inChartPane: false, icon: 'layers' },
    { label: 'OBV', fullName: 'On Balance Volume', value: 'obv', params: '[30]', inChartPane: false, icon: 'balance' },
    { label: 'VR', fullName: 'Volume Ratio', value: 'vr', params: '[24, 30]', inChartPane: false, icon: 'pie_chart' },
    { label: 'WR', fullName: 'Williams %R', value: 'wr', params: '[6, 10, 14]', inChartPane: false, icon: 'percent' },
    { label: 'MTM', fullName: 'Momentum', value: 'mtm', params: '[6, 10]', inChartPane: false, icon: 'rocket_launch' },
    { label: 'EMV', fullName: 'Ease of Movement', value: 'emv', params: '[14, 9]', inChartPane: false, icon: 'motion_photos_on' },
    { label: 'AO', fullName: 'Awesome Oscillator', value: 'ao', params: '[5, 34]', inChartPane: false, icon: 'stars' },
    { label: 'ROC', fullName: 'Rate of Change', value: 'roc', params: '[12, 6]', inChartPane: false, icon: 'insights' },
    { label: 'PVT', fullName: 'Price Volume Trend', value: 'pvt', params: 'None', inChartPane: false, icon: 'trending_flat' },
    { label: 'AVP', fullName: 'Average Price', value: 'avp', params: 'None', inChartPane: false, icon: 'calculate' }
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

.material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>