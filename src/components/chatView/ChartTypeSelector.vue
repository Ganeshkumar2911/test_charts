<template>
    <v-menu v-model="menu" :close-on-content-click="false" location="top">
        <template v-slot:activator="{ props }">
            <v-btn
                flat
                v-bind="props"
                :class="themeStore.isDarkMode ? 'bg-grey-darken-4 text-white' : 'bg-white'"
            >
                <span class="material-symbols-outlined">{{ selectedChartTypeModel.icon }}</span>
            </v-btn>
        </template>

        <v-card 
            class="my-2" 
            min-width="280"
            :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : 'bg-white'"
        >
            <v-card-title 
                class="text-subtitle-1 font-weight-bold pa-3"
                :class="themeStore.isDarkMode ? 'text-white' : ''"
            >
                Select Chart Type
            </v-card-title>
            <v-divider></v-divider>
            
            <v-list 
                density="compact" 
                max-height="400" 
                class="overflow-y-auto"
                :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : ''"
            >
                <v-list-item
                    v-for="chartType in chartTypes"
                    :key="chartType.value"
                    @click="selectChartType(chartType)"
                    :active="selectedChartTypeModel.value === chartType.value"
                    class="cursor-pointer"
                    :class="themeStore.isDarkMode ? 'text-white' : ''"
                >
                    <template v-slot:prepend>
                        <span class="material-symbols-outlined mr-3">{{ chartType.icon }}</span>
                    </template>
                    <v-list-item-title>{{ chartType.label }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useThemeStore } from '@/store/theme';
const themeStore = useThemeStore()


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
    { label: 'Candlestick', value: 'candle_solid', icon: 'candlestick_chart' },
    { label: 'Line', value: 'line', icon: 'show_chart' },
    { label: 'Hollow Candlestick', value: 'candle_stroke', icon: 'leaderboard' },
    { label: 'Up Stroke Candle', value: 'candle_up_stroke', icon: 'trending_up' },
    { label: 'Down Stroke Candle', value: 'candle_down_stroke', icon: 'trending_down' },
    { label: 'Area', value: 'area', icon: 'area_chart' },
    { label: 'OHLC Bar', value: 'ohlc', icon: 'bar_chart' }
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