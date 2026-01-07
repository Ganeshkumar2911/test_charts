<template>
    <v-container>
        <h2 class="text-center bg-primary">{{ $route.params.id }}</h2>
        <div ref="chartContainer" class="chart-container"></div>
        <v-tabs class="my-4" v-model="interval">
            <v-tab 
                v-for="interval in intervals" 
                :key="interval.value" 
                :value="interval.value"
                class="mx-4"
                selected-class="rounded-lg text-white bg-primary"
                hide-slider
                @click="changeInterval()"
            >
            {{ interval.title }}
            </v-tab>
        </v-tabs>

    </v-container>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

    const chartContainer = ref(null);
    let chart = null;
    let candlestickSeries = null;
    const interval = ref('1m');
    const route = useRoute();
    const symbol = route.params.id;
    const intervals = [
        { title: '1m', value: '1m' },
        { title: '5m', value: '5m' },
        { title: '15m', value: '15m' },
        { title: '1h', value: '1h' },
        { title: '6h', value: '6h' },
        { title: '1d', value: '1d' },
        { title: '1w', value: '1w' },
        { title: '1M', value: '1M' }
    ];
    
    const changeInterval = async () => {
        const historicalData = await getHestoickData(symbol);
        candlestickSeries.setData(historicalData);
        cryptoWebSocket(symbol);
    }
    const getHestoickData = async (symbol) => {
        const response = await fetch(
            `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval.value}&limit=300`
        );
        const data = await response.json();
        return data.map(candle => ({
            time: candle[0] / 1000,
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4])
        }));

    }
    const getStocksHistoricalData = () => {
        const params = {
            from: "2017-12-15 09:15:00",
            to: "2017-12-15 09:20:00",
        };
        const successHandler = (response) => {
            console.log("Historical Data:", response.data);
        };
        const failureHandler = (error) => {
            console.error("Error:", error);
        };
        proxy.$api.request_GET(
            "/instruments/historical/5633/minute",
            params,
            successHandler,
            failureHandler
        );
    }

    let socket = null;
    const cryptoWebSocket = (symbol) => {
        if (socket) {
            socket.close();
            socket = null;
        }
        socket = new WebSocket(
            `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@kline_${interval.value}`
        );
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const candle = message.k;
            // console.log(candle);
            candlestickSeries.update({
                time: candle.t / 1000,
                open: parseFloat(candle.o),
                high: parseFloat(candle.h),
                low: parseFloat(candle.l),
                close: parseFloat(candle.c)
            });
        };
    };
    let stocksSocket = null;
    const stockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Njc4MTA2MDAsInN1YiI6IjEifQ.TIMSBwFmUjvnkd3M-CoLYglBE-T2CLne9aZhc5lYRxQ";
    const stocksWebSocket = () => {
        if (stocksSocket) {
            stocksSocket.close();
            stocksSocket = null;
        }
        stocksSocket = new WebSocket(
            `wss://bullback.xtention.in/api/v1/live/ws?token=${stockToken}`
        );
        stocksSocket.onmessage = async(event) => {
            const message = JSON.parse(event.data);
            console.log("Stock Live Data:", message.data);
        };
    }

    onMounted(async () => {
        // getStocksHistoricalData();
        stocksWebSocket();
        chart = createChart(chartContainer.value, {
            width: chartContainer.value.clientWidth,
            height: window.innerHeight * 0.7,
            layout: {
            background: { color: '#2b2b43' },
            textColor: '#d1d4dc',
            },
            grid: {
            vertLines: { color: '#2b2b43' },
            horzLines: { color: '#2b2b43' },
            },
        });
        candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        const historicalData = await getHestoickData(symbol);
        candlestickSeries.setData(historicalData);
        cryptoWebSocket(symbol);
    });
    watch(() => route.params.id,
        async (symbol) => {
            const historicalData = await getHestoickData(symbol);
            candlestickSeries.setData(historicalData);
            cryptoWebSocket(symbol);
        }
    );


</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 70vh;
}
.active-tab {
    background-color: #1976d2;
    color: white;
}
</style>