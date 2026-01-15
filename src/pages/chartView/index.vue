<template>
  <div class="d-flex flex-column fill-height overflow-hidden" :class="isDarkMode ? 'bg-grey-darken-4' : ''">
    <!-- Top toolbar -->
    <div class="d-flex align-center">
      <v-btn variant="text" icon="mdi-menu" />

      <v-btn
        variant="outlined"
        prepend-icon="mdi-magnify"
        class="mx-2 rounded-xl justify-start border border-grey-darken-1 text-capitalize"
        width="200"
        @click="searchDialog = true"
      >
        {{ selectedSymbol.symbol }}
      </v-btn>
      <v-divider vertical class="my-2"></v-divider>
      <IntervalSelector v-model:selectedInterval="selectedInterval" />
      <v-divider vertical class="my-2"></v-divider>
      <ChartTypeSelector v-model:selectedChartType="selectedChartType" />
      <v-divider vertical class="my-2"></v-divider>
      <IndicatorSelector v-model:selectedIndicators="selectedIndicators"/>
      <v-divider vertical class="my-2"></v-divider>
    </div>

    <div class="d-flex flex-grow-1" :class="isDarkMode ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'">
      <!-- Drawing Tools Sidebar -->
      <div class="d-flex flex-column fill-height overflow-hidden" :class="isDarkMode ? 'bg-grey-darken-4' : 'bg-white'">
        <!-- Dark/Light Mode Toggle -->
        <v-tooltip location="right">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="isDarkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
              variant="text"
              size="small"
              class="mb-2 ml-1"
              @click="toggleTheme()"
            ></v-btn>
          </template>
          <span>{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
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
              :color="selectedTool === tool.value ? 'primary' : 'default'"
              @click="selectTool(tool.value)"
              ><span class="material-symbols-outlined">{{ tool.icon }}</span>
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
            ><span class="material-symbols-outlined">delete</span></v-btn>
          </template>
          <span>Clear All</span>
        </v-tooltip>
      </div>
      
      <!-- Chart Area -->
      <div class="flex-grow-1 mt-1 ml-1 rounded" style="background-color: white;">
        <Chart
          class="rounded-s" 
          v-model:symbol="selectedSymbol.symbol"
          v-model:interval="selectedInterval.value"
          v-model:chartType="selectedChartType.value"
          v-model:indicators="selectedIndicators"
          v-model:selectedTool="selectedTool"
          @indicator-removed="indicatorRemove"
          
          @tool-used="onToolUsed"
        />
      </div>
    </div>

    <!-- Symbol Search Dialog -->
    <SymbolSearchDialog 
      v-model:dialog="searchDialog"
      v-model:selectedSymbol="selectedSymbol"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useThemeStore } from '@/store/theme.js'
import { storeToRefs } from 'pinia';
import IntervalSelector from '@/components/chatView/IntervalSelector.vue';
import ChartTypeSelector from '@/components/chatView/ChartTypeSelector.vue';
import IndicatorSelector from '@/components/chatView/IndicatorSelector.vue';
import SymbolSearchDialog from '@/components/chatView/SymbolSearchDialog.vue';
import Chart from './chat.vue';

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)
const { toggleTheme } = themeStore

const searchDialog = ref(false);
const selectedInterval = ref({ label: '1 Minute', value: '1m' });
const selectedChartType = ref({ label: 'Candlestick', value: 'candle_solid', icon: 'candlestick_chart' });
const selectedIndicators = ref([]);
const selectedSymbol = ref({ 
  symbol: 'BTCUSDT', 
  name: 'Bitcoin', 
  type: 'crypto',
  exchange: 'Binance'
});
const selectedTool = ref(null);

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

const indicatorRemove = (indicatorName) => {
  selectedIndicators.value = selectedIndicators.value.filter(
    indicator => indicator.value.toUpperCase() !== indicatorName
  );
};

const selectTool = (tool) => {
  selectedTool.value = tool;
};

const onToolUsed = () => {
  selectedTool.value = null;
};

const clearAllDrawings = () => {
  selectedTool.value = 'clearAll';
};
</script>