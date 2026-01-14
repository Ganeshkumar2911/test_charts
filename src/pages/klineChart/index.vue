<template>
  <div>
    <div class="d-flex my-6">
      <v-select
        class="mx-4"
        v-model="selectedTool"
        :items="drawingTools"
        item-title="label"
        item-value="name"
        variant="outlined"
        label="Select Drawing Tool"
        style="max-width: 300px;"
        @update:modelValue="activateDrawing"
        density="compact"
      ></v-select>
      <v-btn class="mx-2 mt-1" @click="removeAllDrawings" color="error">
        Clear All
      </v-btn>
    </div>

    <div id="chart" style="width:1280px;height:650px"/>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { init, dispose, registerIndicator } from 'klinecharts'

let chart = null
const selectedTool = ref('')

const drawingTools = [
  { name: 'segment', label: '📈 Trend Line' },
  { name: 'horizontalStraightLine', label: '➖ Horizontal Line' },
  { name: 'verticalStraightLine', label: '⬆️ Vertical Line' },
  { name: 'rect', label: '⬜ Rectangle' },
  { name: 'fibonacciLine', label: '📊 Fibonacci' },
  { name: 'priceChannelLine', label: '📉 Price Channel' },
  { name: 'priceLine', label: '💲 Price Line' }
]

const activateDrawing = () => {
  if (!selectedTool.value) {
    alert('Please select a drawing tool first!')
    return
  }
  chart.createOverlay({ name: selectedTool.value })
}

const removeAllDrawings = () => {
  selectedTool.value = ''
  chart.removeOverlay()
}
registerIndicator({
  name: 'MID_PRICE',           // Unique name
  shortName: 'MID',            // Short display name
  
  figures: [
    { key: 'mid', title: 'Mid: ', type: 'line' }  // One line
  ],
  
  calc: (kLineDataList) => {
    // Loop through each candle
    return kLineDataList.map((candle) => {
      // Calculate: (High + Low) / 2
      const mid = (candle.high + candle.low) / 2
      
      // Return the result
      return { 
        timestamp: candle.timestamp,
        mid: mid 
      }
    })
  }
})

onMounted(() => {
  chart = init('chart')
  chart.setSymbol({ ticker: 'BTCUSDT' })
  chart.setPeriod({ span: 2, type: 'day' })

  chart.setDataLoader({
    getBars: async ({ callback }) => {
        const symbol = 'BTCUSDT'
        const interval = '1d'
        const limit = 300

        const res = await fetch(
          `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
        )
        const data = await res.json()

        const bars = data.map(k => ({
          timestamp: k[0],
          open: Number(k[1]),
          high: Number(k[2]),
          low: Number(k[3]),
          close: Number(k[4]),
          volume: Number(k[5])
        }))
        callback(bars)
    }
  })
  
  chart.createIndicator({
    name: 'MA',
    // calcParams: [20],
  }, true, { id: 'candle_pane' })
  
  chart.createIndicator({
    name: 'MID_PRICE',
    // calcParams: [20],
  }, true, { id: 'candle_pane' })

  chart.createIndicator({
    name: 'VOL'
  }, false)
})

onUnmounted(() => {
  dispose('chart')
})
</script>