<template>
  <div class="d-flex flex-column fill-height overflow-hidden" :class="isDarkMode ? 'bg-grey-darken-4' : ''">
    <!-- Top toolbar - Hidden on mobile -->
    <div class="d-none d-sm-flex align-center">
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
      <DrawingToolsSelector 
        v-model:selectedTool="selectedTool"
        @clear-all="clearAllDrawings"
      />
      
      <!-- Chart Area - Full width on mobile -->
      <div class="flex-grow-1 rounded" :class="{'mt-1 ml-1': $vuetify.display.smAndUp}" style="background-color: white;">
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

    <!-- Bottom Bar - Only visible on mobile -->
    <div class="d-flex d-sm-none align-center justify-space-around pa-2" :class="isDarkMode ? 'bg-grey-darken-4' : 'bg-white'" style="border-top: 1px solid #e0e0e0;">
      <v-btn
        variant="text"
        icon="mdi-magnify"
        @click="searchDialog = true"
      ></v-btn>
      <v-divider vertical class="mx-1"></v-divider>
      <IntervalSelector v-model:selectedInterval="selectedInterval" />
      <v-divider vertical class="mx-1"></v-divider>
      <ChartTypeSelector v-model:selectedChartType="selectedChartType" />
      <v-divider vertical class="mx-1"></v-divider>
      <IndicatorSelector v-model:selectedIndicators="selectedIndicators"/>
      <v-divider vertical class="mx-1"></v-divider>
      <v-btn
        flat
        :class="themeStore.isDarkMode ? 'bg-grey-darken-4 text-white' : 'bg-white'"
        @click="bottomSheet = true"
      >
        <span class="material-symbols-outlined">draw</span>
      </v-btn>
      <DrawingToolsSelector 
        v-model:selectedTool="selectedTool"
        v-model:bottomSheet="bottomSheet"
        @clear-all="clearAllDrawings"
      />
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
import DrawingToolsSelector from '@/components/chatView/DrawingToolsSelector.vue';
import Chart from './chat.vue';

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)
const { toggleTheme } = themeStore

const searchDialog = ref(false);
const selectedInterval = ref({ label: '1 Min', value: '1m' });
const selectedChartType = ref({ label: 'Candlestick', value: 'candle_solid', icon: 'candlestick_chart' });
const selectedIndicators = ref([]);
const selectedSymbol = ref({ 
  symbol: 'BTCUSDT', 
  name: 'Bitcoin', 
  type: 'crypto',
  exchange: 'Binance'
});
const selectedTool = ref(null);
const bottomSheet = ref(false);

const indicatorRemove = (indicatorName) => {
  selectedIndicators.value = selectedIndicators.value.filter(
    indicator => indicator.value.toUpperCase() !== indicatorName
  );
};

const onToolUsed = () => {
  selectedTool.value = null;
};

const clearAllDrawings = () => {
  selectedTool.value = 'clearAll';
};
</script>