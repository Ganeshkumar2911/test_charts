<template>
    <v-dialog v-model="dialogModel" height="80%" max-width="800" scrollable>
        <v-card :class="isDarkMode ? 'bg-grey-darken-4' : 'bg-white'">
            <v-card-title 
                class="d-flex align-center"
                :class="isDarkMode ? 'text-white' : ''"
            >
                <span class="text-h6 font-weight-bold">Symbol Search</span>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-close" variant="text" @click="dialogModel = false"></v-btn>
            </v-card-title>
            <!-- Search Input -->
            <div class="pa-4">
                <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Search symbols..."
                    variant="outlined"
                    density="comfortable"
                    clearable                    
                    flat
                    rounded="lg"
                    class="no-focus-outline"
                    :class="isDarkMode ? 'text-white' : ''"
                >
                </v-text-field>
            </div>

            <!-- Filter Chips -->
            <div class="px-4 pb-2">
                <v-chip-group v-model="selectedFilter" selected-class="bg-primary" mandatory>
                    <v-chip 
                        v-for="filter in filters" 
                        :key="filter.value"
                        :value="filter.value"
                        size="small"
                        :class="isDarkMode ? 'bg-grey-darken-2 text-white' : ''"
                    >
                        {{ filter.label }}
                    </v-chip>
                </v-chip-group>
            </div>
            <!-- Symbol List -->
            <v-card-text 
                style="max-height: 500px;" 
                class="pa-0"
                :class="isDarkMode ? 'bg-grey-darken-4' : ''"
            >
                <v-list :class="isDarkMode ? 'bg-grey-darken-4' : ''">
                    <v-list-item
                        v-for="symbol in filteredSymbols"
                        :key="symbol.symbol"
                        @click="selectSymbol(symbol)"
                        class="cursor-pointer"
                        :class="{ 
                            'bg-blue-lighten-5': !isDarkMode && selectedSymbolModel.symbol === symbol.symbol,
                            'bg-blue-darken-3': isDarkMode && selectedSymbolModel.symbol === symbol.symbol,
                            'text-white': isDarkMode
                        }"
                    >
                        <template v-slot:prepend>
                            <v-avatar :color="symbol.color" size="40">
                                <v-icon v-if="symbol.icon" :icon="symbol.icon" color="white"></v-icon>
                                <span v-else class="text-white font-weight-bold">{{ symbol.symbol.substring(0, 2) }}</span>
                            </v-avatar>
                        </template>

                        <v-list-item-title class="font-weight-medium">
                            <span class="text-primary">{{ symbol.displaySymbol }}</span>
                            {{ symbol.name }}
                        </v-list-item-title>

                        <template v-slot:append>
                            <div class="text-right">
                                <div class="text-caption text-grey">{{ symbol.type }}</div>
                                <div class="text-body-2 font-weight-medium">{{ symbol.exchange }}</div>
                            </div>
                        </template>
                    </v-list-item>

                    <v-list-item v-if="filteredSymbols.length === 0">
                        <v-list-item-title 
                            class="text-center text-grey"
                            :class="isDarkMode ? 'text-grey-lighten-1' : ''"
                        >
                            No symbols found
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDarkMode } from '@/constants/useDarkMode';

const { isDarkMode } = useDarkMode();

const props = defineProps({
    dialog: {
        type: Boolean,
        required: true
    },
    selectedSymbol: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:dialog', 'update:selectedSymbol']);

const dialogModel = computed({
    get: () => props.dialog,
    set: (value) => emit('update:dialog', value)
});

const selectedSymbolModel = computed({
    get: () => props.selectedSymbol,
    set: (value) => emit('update:selectedSymbol', value)
});

const searchQuery = ref('');
const selectedFilter = ref('all');

const filters = [
    { label: 'All', value: 'all' },
    { label: 'Stocks', value: 'stock' },
    { label: 'Funds', value: 'fund' },
    { label: 'Futures', value: 'futures' },
    { label: 'Forex', value: 'forex' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'Indices', value: 'indices' },
    { label: 'Bonds', value: 'bonds' },
    { label: 'Economy', value: 'economy' },
    { label: 'Options', value: 'options' }
];

const symbols = [
    { symbol: 'BTCUSDT', displaySymbol: 'BTC', name: 'Bitcoin', type: 'crypto', exchange: 'Binance', icon: 'mdi-bitcoin', color: 'orange' },
    { symbol: 'ETHUSDT', displaySymbol: 'ETH', name: 'Ethereum', type: 'crypto', exchange: 'Binance', icon: 'mdi-ethereum', color: 'blue-grey' },
    { symbol: 'BNBUSDT', displaySymbol: 'BNB', name: 'Binance Coin', type: 'crypto', exchange: 'Binance', color: 'yellow-darken-2' },
    { symbol: 'SOLUSDT', displaySymbol: 'SOL', name: 'Solana', type: 'crypto', exchange: 'Binance', color: 'purple' },
    { symbol: 'XRPUSDT', displaySymbol: 'XRP', name: 'Ripple', type: 'crypto', exchange: 'Binance', color: 'blue' },
    { symbol: 'ADAUSDT', displaySymbol: 'ADA', name: 'Cardano', type: 'crypto', exchange: 'Binance', color: 'blue-darken-2' },
    { symbol: 'DOGEUSDT', displaySymbol: 'DOGE', name: 'Dogecoin', type: 'crypto', exchange: 'Binance', color: 'yellow-darken-3' },
    { symbol: 'MATICUSDT', displaySymbol: 'MATIC', name: 'Polygon', type: 'crypto', exchange: 'Binance', color: 'purple-darken-2' },
    { symbol: 'DOTUSDT', displaySymbol: 'DOT', name: 'Polkadot', type: 'crypto', exchange: 'Binance', color: 'pink' },
    { symbol: 'AVAXUSDT', displaySymbol: 'AVAX', name: 'Avalanche', type: 'crypto', exchange: 'Binance', color: 'red' },
    { symbol: 'LINKUSDT', displaySymbol: 'LINK', name: 'Chainlink', type: 'crypto', exchange: 'Binance', color: 'blue' },
    { symbol: 'UNIUSDT', displaySymbol: 'UNI', name: 'Uniswap', type: 'crypto', exchange: 'Binance', color: 'pink' },
    { symbol: 'LTCUSDT', displaySymbol: 'LTC', name: 'Litecoin', type: 'crypto', exchange: 'Binance', color: 'grey' },
    { symbol: 'TRXUSDT', displaySymbol: 'TRX', name: 'Tron', type: 'crypto', exchange: 'Binance', color: 'red' },
    { symbol: 'ATOMUSDT', displaySymbol: 'ATOM', name: 'Cosmos', type: 'crypto', exchange: 'Binance', color: 'blue-grey' },
    
    { symbol: 'BTCUSDT', displaySymbol: 'BTC', name: 'Bitcoin Futures', type: 'futures', exchange: 'Binance Futures', icon: 'mdi-bitcoin', color: 'orange' },
    { symbol: 'ETHUSDT', displaySymbol: 'ETH', name: 'Ethereum Futures', type: 'futures', exchange: 'Binance Futures', icon: 'mdi-ethereum', color: 'blue-grey' },
];

const filteredSymbols = computed(() => {
    let filtered = symbols;

    if (selectedFilter.value !== 'all') {
        filtered = filtered.filter(s => s.type === selectedFilter.value);
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(s => 
            s.symbol.toLowerCase().includes(query) ||
            s.displaySymbol.toLowerCase().includes(query) ||
            s.name.toLowerCase().includes(query)
        );
    }

    return filtered;
});

const selectSymbol = (symbol) => {
    selectedSymbolModel.value = symbol;
    dialogModel.value = false;
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>