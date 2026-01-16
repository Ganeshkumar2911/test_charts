<template>
    <!-- Desktop Menu -->
    <v-menu 
        v-if="!$vuetify.display.xs"
        v-model="menu" 
        :close-on-content-click="false" 
        location="top"
    >
        <template v-slot:activator="{ props }">
            <v-btn
                flat
                class="text-capitalize"
                :class="themeStore.isDarkMode ? 'bg-grey-darken-4 text-white' : 'bg-white'"
                v-bind="props"
            >
                {{ selectedIntervalModel.label }}
            </v-btn>
        </template>

        <v-card 
            class="my-2" 
            min-width="220"
            :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : 'bg-white'"
        >
            <v-card-title 
                class="text-subtitle-1 font-weight-bold pa-3"
                :class="themeStore.isDarkMode ? 'text-white' : ''"
            >
                Select Time Interval
            </v-card-title>
            <v-divider></v-divider>
            
            <v-list 
                density="compact" 
                max-height="700" 
                class="overflow-y-auto"
                :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : ''"
            >
                <v-list-item
                    v-for="interval in intervals"
                    :key="interval.value"
                    @click="selectInterval(interval)"
                    :active="selectedIntervalModel.value === interval.value"
                    class="cursor-pointer"
                    :class="themeStore.isDarkMode ? 'text-white' : ''"
                >
                    <v-list-item-title>{{ interval.label }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>

    <!-- Mobile Button + Bottom Sheet -->
    <template v-if="$vuetify.display.xs">
        <v-btn
            flat
            class="text-capitalize"
            :class="themeStore.isDarkMode ? 'bg-grey-darken-4 text-white' : 'bg-white'"
            @click="bottomSheet = true"
        >
            {{ selectedIntervalModel.label }}
        </v-btn>

        <v-bottom-sheet v-model="bottomSheet">
            <v-card :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : 'bg-white'" height="60vh">
                <v-card-title 
                    class="d-flex align-center text-subtitle-1 font-weight-bold pa-3"
                    :class="themeStore.isDarkMode ? 'text-white' : ''"
                >
                    <span class="mx-1">Select Time Interval</span>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="bottomSheet = false"></v-btn>
                </v-card-title>
                <v-divider></v-divider>
                
                <v-card-text class="pa-0">
                    <v-list 
                        density="comfortable"
                        :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : ''"
                    >
                        <v-list-item
                            v-for="interval in intervals"
                            :key="interval.value"
                            @click="selectIntervalMobile(interval)"
                            :active="selectedIntervalModel.value === interval.value"
                            class="cursor-pointer"
                            :class="themeStore.isDarkMode ? 'text-white' : ''"
                        >
                            <v-list-item-title>{{ interval.label }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </template>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useThemeStore } from '@/store/theme';

const themeStore = useThemeStore()
 
const props = defineProps({
    selectedInterval: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:selectedInterval']);

const menu = ref(false);
const bottomSheet = ref(false);

const selectedIntervalModel = computed({
    get: () => props.selectedInterval,
    set: (value) => emit('update:selectedInterval', value)
});

const intervals = [
    { label: '1 Min', value: '1m' },
    { label: '3 Min', value: '3m' },
    { label: '5 Min', value: '5m' },
    { label: '15 Min', value: '15m' },
    { label: '30 Min', value: '30m' },
    { label: '1 Hour', value: '1h' },
    { label: '2 Hours', value: '2h' },
    { label: '4 Hours', value: '4h' },
    { label: '6 Hours', value: '6h' },
    { label: '8 Hours', value: '8h' },
    { label: '12 Hours', value: '12h' },
    { label: '1 Day', value: '1d' },
    { label: '3 Days', value: '3d' },
    { label: '1 Week', value: '1w' },
    { label: '1 Month', value: '1M' }
];

const selectInterval = (interval) => {
    selectedIntervalModel.value = interval;
    menu.value = false;
};

const selectIntervalMobile = (interval) => {
    selectedIntervalModel.value = interval;
    bottomSheet.value = false;
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>