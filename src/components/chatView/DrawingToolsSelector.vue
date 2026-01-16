<template>
    <!-- Desktop Sidebar - Hidden on mobile -->
    <div 
        v-if="!$vuetify.display.xs"
        class="d-flex flex-column fill-height overflow-hidden" 
        :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : 'bg-white'"
    >
        <!-- Dark/Light Mode Toggle -->
        <v-tooltip location="right">
            <template v-slot:activator="{ props }">
                <v-btn
                    v-bind="props"
                    :icon="themeStore.isDarkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
                    variant="text"
                    size="small"
                    class="mb-2 ml-1"
                    @click="themeStore.toggleTheme()"
                ></v-btn>
            </template>
            <span>{{ themeStore.isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
        </v-tooltip>

        <v-divider class="my-2"></v-divider>

        <!-- Drawing Tools -->
        <v-tooltip 
            v-for="tool in drawingTools" 
            :key="tool.value"
            location="right"
        >
            <template v-slot:activator="{ props }">
                <v-btn
                    v-bind="props"
                    variant="text"
                    size="small"
                    class="mb-2"
                    :color="selectedToolModel === tool.value ? 'primary' : 'default'"
                    @click="selectTool(tool.value)"
                >
                    <span class="material-symbols-outlined">{{ tool.icon }}</span>
                </v-btn>
            </template>
            <span>{{ tool.label }}</span>
        </v-tooltip>
        
        <v-divider class="my-2"></v-divider>
        
        <!-- Clear all drawings -->
        <v-tooltip location="right">
            <template v-slot:activator="{ props }">
                <v-btn
                    v-bind="props"
                    variant="text"
                    size="small"
                    color="error"
                    @click="clearAllDrawings"
                >
                    <span class="material-symbols-outlined">delete</span>
                </v-btn>
            </template>
            <span>Clear All</span>
        </v-tooltip>
    </div>

    <!-- Mobile Button + Bottom Sheet -->
    <template v-if="$vuetify.display.xs">
        <v-bottom-sheet v-model="bottomSheetModel">
            <v-card :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : 'bg-white'" height="65vh">
                <v-card-title 
                    class="d-flex align-center text-subtitle-1 font-weight-bold pa-3"
                    :class="themeStore.isDarkMode ? 'text-white' : ''"
                >
                    <span class="mx-2">Drawing Tools</span>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="bottomSheetModel = false"></v-btn>
                </v-card-title>
                <v-divider></v-divider>
                
                <v-card-text class="pa-4" style="height: calc(65vh - 120px); overflow-y: auto;">
                    <v-row>
                        <v-col 
                            v-for="tool in drawingTools" 
                            :key="tool.value"
                            cols="4"
                        >
                            <v-card
                                height="100"
                                :class="[
                                    'text-center pa-4 cursor-pointer rounded-lg',
                                    themeStore.isDarkMode ? 'bg-grey-darken-3' : 'bg-grey-lighten-4',
                                    selectedToolModel === tool.value ? 'border-primary' : ''
                                ]"
                                :style="selectedToolModel === tool.value ? 'border: 2px solid rgb(var(--v-theme-primary))' : ''"
                                @click="selectToolMobile(tool.value)"
                                elevation="0"
                            >
                                <span 
                                    class="material-symbols-outlined d-block mb-2" 
                                    :class="themeStore.isDarkMode ? 'text-white' : ''"
                                    style="font-size: 32px;"
                                >
                                    {{ tool.icon }}
                                </span>
                                <div 
                                    class="text-caption" 
                                    :class="themeStore.isDarkMode ? 'text-white' : ''"
                                    style="line-height: 1.2;"
                                >
                                    {{ tool.label }}
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                
                <v-divider></v-divider>
                <v-card-actions :class="themeStore.isDarkMode ? 'bg-grey-darken-4' : ''">
                    <v-btn
                        variant="text"
                        size="small"
                        color="error"
                        @click="clearAllDrawingsMobile"
                        :class="themeStore.isDarkMode ? 'text-white' : ''"
                    >
                        <v-icon size="small" class="mr-1">mdi-delete</v-icon>
                        Clear All
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        variant="text"
                        color="primary"
                        size="small"
                        @click="bottomSheetModel = false"
                    >
                        Done
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
    </template>
</template>

<script setup>
import { computed } from 'vue';
import { useThemeStore } from '@/store/theme';

const themeStore = useThemeStore();

const props = defineProps({
    selectedTool: {
        type: String,
        default: null
    },
    bottomSheet: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits(['update:selectedTool', 'update:bottomSheet', 'clear-all']);

const selectedToolModel = computed({
    get: () => props.selectedTool,
    set: (value) => emit('update:selectedTool', value)
});

const bottomSheetModel = computed({
    get: () => props.bottomSheet,
    set: (value) => emit('update:bottomSheet', value)
});

const drawingTools = [
  { label: 'Horizontal Line', value: 'horizontalStraightLine', icon: 'horizontal_rule' },
  { label: 'Vertical Line', value: 'verticalStraightLine', icon: 'height' },
  { label: 'Segment Line', value: 'straightLine', icon: 'diagonal_line' },
  { label: 'Ray Line', value: 'rayLine', icon: 'trending_up' },
  { label: 'Price Line', value: 'priceLine', icon: 'line_start' },
  { label: 'Pin', value: 'simpleAnnotation', icon: 'push_pin' },
  { label: 'Parallel Lines', value: 'parallelStraightLine', icon: 'drag_handle' },
  { label: 'Fibonacci Line', value: 'fibonacciLine', icon: 'format_align_justify' }
];

const selectTool = (tool) => {
    selectedToolModel.value = tool;
};

const selectToolMobile = (tool) => {
    selectedToolModel.value = tool;
    bottomSheetModel.value = false;
};

const clearAllDrawings = () => {
    selectedToolModel.value = 'clearAll';
    emit('clear-all');
};

const clearAllDrawingsMobile = () => {
    selectedToolModel.value = 'clearAll';
    emit('clear-all');
    bottomSheetModel.value = false;
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.border-primary {
    border: 2px solid rgb(var(--v-theme-primary));
}

.material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>