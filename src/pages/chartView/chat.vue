<template>
    <div id="chart" style="width:100%;height:100%"/>
</template>

<script setup>
import { defineProps, watch, onMounted, onBeforeUnmount } from 'vue'; 
import { init, dispose, getSupportedFigures } from 'klinecharts';
import { defineEmits } from 'vue';
import { useThemeStore } from '@/store/theme';

import { getCurrentInstance } from 'vue';
import { id } from 'vuetify/locale';

const supports = getSupportedFigures();
const { proxy } = getCurrentInstance();

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
    getnewHistoricalData();
    console.log('Supported figures:', supports);
})
const getnewHistoricalData = async () => {
    const successHandler = (response) => {
        console.log('Historical data fetched:', response); 
    };
    const failureHandler = (error) => {
        console.error("Error:", error);
    };
    proxy.$api.request_GET( 
        "/historical?instrument_token=5633&interval=minute&from=2017-12-15 09:15:00&to=2017-12-15",
        {},
        successHandler,
        failureHandler
    );
}
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
        
        
        // Dispose existing chart
        if (chart) {
            dispose('chart');
            chart = null;
        }
        
        // Recreate chart and WebSocket
        cryptoWebSocket();
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
            chart.removeIndicator(indicator.id);
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
        chart.setStyles({
            indicator: {
                tooltip: {
                    features: [{
                        id: 'remove_indicator',
                        name: 'Remove Indicator',
                        position: 'left',
                        marginLeft: 6,
                        marginTop: 0,
                        marginRight: 0,
                        marginBottom: 0,
                        paddingLeft: 2,
                        paddingTop: 4,
                        paddingRight: 2,
                        paddingBottom: 2,
                        size: 12,
                        color: '#888888',
                        activeColor: '#ff0000',
                        backgroundColor: 'transparent',
                        activeBackgroundColor: 'rgba(255, 0, 0, 0.1)',
                        type: 'path',
                        content: {
                            style: 'stroke',
                            path: 'M2,2 L10,10 M10,2 L2,10',
                            lineWidth: 1.5
                        }
                    }]
                }
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
                type: props.chartType,
                tooltip: {
                    showRule: 'always',
                    showType: 'standard',
                    title: {
                        show: true,
                        size: 14,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        color: textColor, // Dynamic color for symbol and period
                        marginLeft: 8,
                        marginTop: 4,
                        marginRight: 8,
                        marginBottom: 4
                    },
                    legend: {
                        size: 12,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        color: isDark ? '#FFFFFF' : '#000000',
                        marginLeft: 8,
                        marginTop: 4,
                        marginRight: 8,
                        marginBottom: 4
                    }
                }
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
   chart = init('chart', {
            timezone: 'Asia/Kolkata',
            formatter: {
                formatDate: ({ timestamp, type }) => {
                const d = new Date(timestamp)

                if (type === 'crosshair' || type === 'xAxis') {
                    return d.toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                    })
                }

                return d.toLocaleString()
                }
            }
    });
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
                },
                tooltip: {
                    showRule: 'always',
                    showType: 'standard',
                    title: {
                        show: true,
                        size: 14,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        color: textColor,
                        marginLeft: 8,
                        marginTop: 4,
                        marginRight: 8,
                        marginBottom: 4
                    },
                    legend: {
                        size: 12,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        color: textColor,
                        marginLeft: 8,
                        marginTop: 4,
                        marginRight: 8,
                        marginBottom: 4
                    }
                }
            }
            : {
                type: props.chartType,
                tooltip: {
                    showRule: 'always',
                    showType: 'standard',
                    title: {
                        show: true,
                        size: 14,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        color: textColor,
                        marginLeft: 8,
                        marginTop: 4,
                        marginRight: 8,
                        marginBottom: 4
                    },
                    legend: {
                        size: 12,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        color: textColor,
                        marginLeft: 8,
                        marginTop: 4,
                        marginRight: 8,
                        marginBottom: 4,
                        template: [
                            // { title: 'time', value: '{time}' },
                            { title: 'open', value: '{open}' },
                            { title: 'high', value: '{high}' },
                            { title: 'low', value: '{low}' },
                            { title: 'close', value: '{close}' },
                            { title: 'volume', value: '{volume}' }
                        ]
                    }
                }
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
            show: true,
            axisLine: { color: gridColor },
            tickText: { color: textColor }
        },
        yAxis: {
            axisLine: { color: gridColor },
            tickText: { color: textColor }
        },
        crosshair: {
            show: true, 
            vertical: {
                show: true, 
                text: {
                    show: true,
                }
            }
        }
    });
    
    document.getElementById('chart').style.backgroundColor = backgroundColor;
    
    chart.setSymbol({ ticker: props.symbol })
    chart.setPeriod({ span: props.interval.toUpperCase()})
    
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
                    open: +candle.o,
                    high: +candle.h,
                    low: +candle.l,
                    close: +candle.c,
                    volume: +candle.v
                }

                const last = candleData[candleData.length - 1]

                if (last && last.timestamp === dataPoint.timestamp) {
                    candleData[candleData.length - 1] = dataPoint
                } else {
                    candleData.push(dataPoint)
                }

                callback(dataPoint)
            }
        },
    });
    chart.subscribeAction('onIndicatorTooltipFeatureClick', (data) => {
        chart.removeIndicator({id: data.indicator.id});
        emit('indicator-removed', data.indicator.name);
    });
}

const getHistoricalData = async () => {
    const symbol = props.symbol;
    const interval = props.interval;
    const limit = 1500;
    
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