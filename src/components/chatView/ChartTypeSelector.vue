<template>
    <v-menu v-model="menu" :close-on-content-click="false" location="top">
        <template v-slot:activator="{ props }">
            <v-btn
                flat
                v-bind="props"
                :class="isDarkMode ? 'bg-grey-darken-4 text-white' : 'bg-white'"
            >
                <v-icon :icon="selectedChartTypeModel.icon" size="small" class="mr-2"></v-icon>
            </v-btn>
        </template>

        <v-card 
            class="my-2" 
            min-width="280"
            :class="isDarkMode ? 'bg-grey-darken-4' : 'bg-white'"
        >
            <v-card-title 
                class="text-subtitle-1 font-weight-bold pa-3"
                :class="isDarkMode ? 'text-white' : ''"
            >
                Select Chart Type
            </v-card-title>
            <v-divider></v-divider>
            
            <v-list 
                density="compact" 
                max-height="400" 
                class="overflow-y-auto"
                :class="isDarkMode ? 'bg-grey-darken-4' : ''"
            >
                <v-list-item
                    v-for="chartType in chartTypes"
                    :key="chartType.value"
                    @click="selectChartType(chartType)"
                    :active="selectedChartTypeModel.value === chartType.value"
                    class="cursor-pointer"
                    :class="isDarkMode ? 'text-white' : ''"
                >
                    <template v-slot:prepend>
                        <v-icon :icon="chartType.icon" size="small"></v-icon>
                    </template>
                    <v-list-item-title>{{ chartType.label }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDarkMode } from '@/constants/useDarkMode';

const { isDarkMode } = useDarkMode();

const props = defineProps({
    selectedChartType: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:selectedChartType']);

const menu = ref(false);

const selectedChartTypeModel = computed({
    get: () => props.selectedChartType,
    set: (value) => emit('update:selectedChartType', value)
});

const chartTypes = [
    { label: 'Candlestick', value: 'candle_solid', icon: 'mdi-chart-box-outline' },
    { label: 'Line', value: 'line', icon: 'mdi-chart-line-variant' },
    { label: 'Hollow Candlestick', value: 'candle_stroke', icon: 'mdi-chart-box' },
    { label: 'Up Stroke Candle', value: 'candle_up_stroke', icon: 'mdi-chart-box-plus-outline' },
    { label: 'Down Stroke Candle', value: 'candle_down_stroke', icon: 'mdi-chart-line' },
    { label: 'Area', value: 'area', icon: 'mdi-chart-areaspline' },
    { label: 'OHLC Bar', value: 'ohlc', icon: 'mdi-chart-bar' }
];

const selectChartType = (chartType) => {
    selectedChartTypeModel.value = chartType;
    menu.value = false;
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>