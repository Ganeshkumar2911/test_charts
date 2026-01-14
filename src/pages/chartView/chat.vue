<template>
  <div id="chart" style="width:100%;height:100%" />
</template>

<script setup>
import { defineProps, watch, onMounted, onBeforeUnmount } from 'vue';
import { init, dispose } from 'klinecharts';
import { defineEmits } from 'vue';
import { useThemeStore } from '@/store/theme';

const themeStore = useThemeStore()

const emit = defineEmits(['tool-used']);

let chart = null
let socket = null;
let candleData = null;

console.log('Circle overlay registered');
const props = defineProps({
  symbol: {
    type: String,
    required: true
  },
  interval: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    required: true
  },
  indicators: {
    type: Array,
    required: true
  },
  selectedTool: {
    type: String,
    default: null
  },
});
onMounted(() => {
  cryptoWebSocket();

  createChart();
})

onBeforeUnmount(() => {
  if (socket) {
    socket.close();
    socket = null;
  }
  if (chart) {
    dispose('chart');
    chart = null;
  }
})

watch(
  () => [props.symbol, props.interval, props.chartType],
  ([newSymbol, newInterval, newChartType]) => {
    console.log('Props changed:', {
      symbol: newSymbol,
      interval: newInterval,
      chartType: newChartType
    });

    // Close existing WebSocket
    if (socket) {
      socket.close();
      socket = null;
    }

    // Dispose existing chart
    if (chart) {
      dispose('chart');
      chart = null;
    }

    // Recreate chart and WebSocket
    createChart();
  }
);
watch(
  () => props.indicators,
  (newIndicators) => {
    if (!chart) return;

    // Remove all existing indicators
    const existingIndicators = chart.getIndicators() || [];
    existingIndicators.forEach(indicator => {
      chart.removeIndicator(indicator.name);
    });

    // Add new indicators
    newIndicators.forEach(indicator => {
      try {
        // Parse params, handle 'None' case
        let params;
        if (indicator.params === 'None') {
          params = [];
        } else {
          params = JSON.parse(indicator.params);
        }

        // Create indicator based on inChartPane flag
        if (indicator.inChartPane) {
          // On chart (overlay)
          chart.createIndicator({
            name: indicator.value.toUpperCase(),
            calcParams: params
          }, true, { id: 'candle_pane' });
        } else {
          // Below chart (separate pane)
          chart.createIndicator({
            name: indicator.value.toUpperCase(),
            calcParams: params
          }, false);
        }
      } catch (error) {
        console.error(`Error adding indicator ${indicator.label}:`, error);
      }
    });
  },
  { deep: true }
);
// Watch for tool selection
watch(() => props.selectedTool,
  (newTool) => {
    if (!chart) return;

    if (newTool === 'clearAll') {
      // Remove all overlays
      chart.removeOverlay();
      emit('tool-used');
    } else if (newTool) {
      chart.createOverlay(newTool);
      emit('tool-used');
    }
  }
);

watch(() => themeStore.isDarkMode,
  (isDark) => {
    if (!chart) return;

    const backgroundColor = isDark ? '#1e1e1e' : '#ffffff';
    const textColor = isDark ? '#d9d9d9' : '#333333';
    const gridColor = isDark ? '#404040' : '#e0e0e0';

    chart.setStyles({
      candle: {
        type: props.chartType
      },
      grid: {
        horizontal: {
          color: gridColor,
          style: 'solid'
        },
        vertical: {
          color: gridColor,
          style: 'solid'
        }
      },
      xAxis: {
        axisLine: { color: gridColor },
        tickText: { color: textColor }
      },
      yAxis: {
        axisLine: { color: gridColor },
        tickText: { color: textColor }
      }
    });

    document.getElementById('chart').style.backgroundColor = backgroundColor;
  },
  { immediate: true }
);

const createChart = async () => {
  chart = init('chart')

  // Apply dark mode on chart creation
  const backgroundColor = themeStore.isDarkMode ? '#1e1e1e' : '#ffffff';
  const textColor = themeStore.isDarkMode ? '#d9d9d9' : '#333333';
  const gridColor = themeStore.isDarkMode ? '#404040' : '#e0e0e0';

  chart.setStyles({
    candle: props.chartType === 'line'
      ? {
        type: 'area',
        area: {
          lineColor: 'red',
          backgroundColor: 'transparent'
        }
      }
      : {
        type: props.chartType
      },
    grid: {
      horizontal: {
        color: gridColor,
        style: 'solid'
      },
      vertical: {
        color: gridColor,
        style: 'solid'
      }
    },
    xAxis: {
      axisLine: { color: gridColor },
      tickText: { color: textColor }
    },
    yAxis: {
      axisLine: { color: gridColor },
      tickText: { color: textColor }
    }
  });

  document.getElementById('chart').style.backgroundColor = backgroundColor;

  chart.setSymbol({ ticker: props.symbol })
  chart.setPeriod({ span: 1, type: 'day' })

  candleData = await getHistoricalData();
  chart.setDataLoader({
    getBars: ({ callback }) => {
      callback(candleData)
    },

    subscribeBar: ({ callback }) => {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        const candle = message.k
        if (!candle) return

        const dataPoint = {
          timestamp: candle.t,
          open: Number(candle.o),
          high: Number(candle.h),
          low: Number(candle.l),
          close: Number(candle.c),
          volume: Number(candle.v)
        }

        // THIS is the only doc-consistent way
        callback(dataPoint)
      }
    },

    unsubscribeBar: () => {
      if (socket) socket.close()
    }
  })

}

const getHistoricalData = async () => {
  const symbol = props.symbol;
  const interval = props.interval;
  const limit = 500;

  try {
    const response = await fetch(
      `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    const data = await response.json();

    return data.map(candle => ({
      timestamp: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}

const cryptoWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }

  const wsUrl = `wss://fstream.binance.com/ws/${props.symbol.toLowerCase()}@kline_${props.interval}`;
  console.log('Connecting to WebSocket:', wsUrl);

  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket closed');
  };
};
</script>
